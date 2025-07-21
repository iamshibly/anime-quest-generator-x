import { Question, Quiz } from '../types/quiz';

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    difficulty: 'medium',
    question: "Who is the main protagonist of the anime 'One Piece'?",
    options: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Sanji'],
    correctAnswer: 0,
    explanation: "Monkey D. Luffy is the main character and captain of the Straw Hat Pirates.",
    timeLimit: 30
  },
  {
    id: '2',
    type: 'true-false',
    difficulty: 'easy',
    question: "Naruto Uzumaki wants to become the Hokage of the Hidden Leaf Village.",
    correctAnswer: 1,
    explanation: "True! Naruto's dream is to become Hokage and be acknowledged by everyone.",
    timeLimit: 20
  },
  {
    id: '3',
    type: 'fill-blank',
    difficulty: 'hard',
    question: "In Attack on Titan, the main character Eren Yeager lives in the _____ District of Wall Maria.",
    correctAnswer: "Shiganshina",
    explanation: "Eren lives in Shiganshina District, which was breached by the Colossal Titan.",
    timeLimit: 45
  },
  {
    id: '4',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of Light Yagami's Shinigami in Death Note?",
    options: ['Rem', 'Ryuk', 'Misa', 'L'],
    correctAnswer: 1,
    explanation: "Ryuk is the Shinigami who dropped his Death Note into the human world.",
    timeLimit: 30
  },
  {
    id: '5',
    type: 'true-false',
    difficulty: 'medium',
    question: "In Dragon Ball Z, Goku is originally from planet Earth.",
    correctAnswer: 0,
    explanation: "False! Goku is a Saiyan from planet Vegeta, sent to Earth as a baby.",
    timeLimit: 25
  },
  {
    id: '6',
    type: 'mcq',
    difficulty: 'hard',
    question: "In Demon Slayer, what is the name of Tanjiro's sister?",
    options: ['Nezuko', 'Shinobu', 'Mitsuri', 'Kanao'],
    correctAnswer: 0,
    explanation: "Nezuko Kamado is Tanjiro's younger sister who was turned into a demon.",
    timeLimit: 30
  }
];

export const generateMockQuiz = (difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Quiz => {
  const filteredQuestions = mockQuestions.filter(q => q.difficulty === difficulty);
  const selectedQuestions = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    selectedQuestions.push({
      ...filteredQuestions[randomIndex],
      id: `${Date.now()}-${i}`
    });
  }
  
  return {
    id: `quiz-${Date.now()}`,
    questions: selectedQuestions,
    difficulty,
    timeLimit: selectedQuestions.reduce((total, q) => total + q.timeLimit, 0),
    createdAt: new Date()
  };
};