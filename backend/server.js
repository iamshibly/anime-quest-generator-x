const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY; // Store securely in environment

// Quiz generation endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { difficulty = 'medium', questionCount = 5, topics = [] } = req.body;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = generateQuizPrompt(difficulty, questionCount, topics);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Anime Quiz App'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator AI specialized in anime and manga. Generate quiz questions in valid JSON format only. Do not include any additional text or explanations outside the JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    // Parse the JSON response
    let quizData;
    try {
      // Clean the response to ensure valid JSON
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      quizData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and format the quiz data
    const formattedQuiz = formatQuizData(quizData, difficulty);
    
    res.json(formattedQuiz);

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate quiz prompt based on parameters
function generateQuizPrompt(difficulty, questionCount, topics) {
  const difficultyDescriptions = {
    easy: 'beginner-friendly questions about popular anime and manga series',
    medium: 'moderately challenging questions requiring good anime/manga knowledge',
    hard: 'expert-level questions about obscure details and deep anime/manga lore'
  };

  const topicsString = topics.length > 0 ? ` Focus on these series: ${topics.join(', ')}.` : '';

  return `Generate ${questionCount} ${difficulty} ${difficultyDescriptions[difficulty]} for an anime and manga quiz.${topicsString}

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "unique_id",
      "type": "mcq",
      "difficulty": "${difficulty}",
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Brief explanation",
      "timeLimit": 30
    },
    {
      "id": "unique_id_2",
      "type": "true-false",
      "difficulty": "${difficulty}",
      "question": "True/False question text",
      "correctAnswer": 1,
      "explanation": "Brief explanation",
      "timeLimit": 25
    },
    {
      "id": "unique_id_3",
      "type": "fill-blank",
      "difficulty": "${difficulty}",
      "question": "Fill in the blank: Character name is ______",
      "correctAnswer": "Answer",
      "explanation": "Brief explanation",
      "timeLimit": 35
    }
  ]
}

Rules:
- Mix question types: mcq, true-false, fill-blank
- For MCQ: correctAnswer is the index (0-3) of the correct option
- For true-false: correctAnswer is 0 for false, 1 for true
- For fill-blank: correctAnswer is the exact string answer
- Include popular series like Naruto, One Piece, Attack on Titan, Dragon Ball, Demon Slayer, My Hero Academia
- Make explanations educational and interesting
- Ensure questions are accurate and well-researched`;
}

// Format and validate quiz data
function formatQuizData(quizData, difficulty) {
  if (!quizData.questions || !Array.isArray(quizData.questions)) {
    throw new Error('Invalid quiz data structure');
  }

  const formattedQuestions = quizData.questions.map((q, index) => ({
    id: q.id || `question_${Date.now()}_${index}`,
    type: q.type || 'mcq',
    difficulty: q.difficulty || difficulty,
    question: q.question || 'Question text missing',
    options: q.options || undefined,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || 'No explanation provided',
    timeLimit: q.timeLimit || getDefaultTimeLimit(q.type),
    imageUrl: q.imageUrl || undefined
  }));

  return {
    id: `quiz_${Date.now()}`,
    questions: formattedQuestions,
    difficulty,
    timeLimit: formattedQuestions.reduce((total, q) => total + q.timeLimit, 0),
    createdAt: new Date().toISOString()
  };
}

// Get default time limit based on question type
function getDefaultTimeLimit(type) {
  switch (type) {
    case 'mcq': return 30;
    case 'true-false': return 20;
    case 'fill-blank': return 40;
    case 'image-based': return 45;
    default: return 30;
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});