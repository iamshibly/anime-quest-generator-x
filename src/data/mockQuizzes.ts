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
  },
  {
    id: '7',
    type: 'true-false',
    difficulty: 'easy',
    question: "In My Hero Academia, Deku's real name is Izuku Midoriya.",
    correctAnswer: 1,
    explanation: "True! Deku is the hero name of Izuku Midoriya.",
    timeLimit: 20
  },
  {
    id: '8',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of the organization that Itachi belongs to in Naruto?",
    options: ['Akatsuki', 'Root', 'ANBU', 'Sound Four'],
    correctAnswer: 0,
    explanation: "Itachi is a member of the Akatsuki organization.",
    timeLimit: 30
  },
  {
    id: '9',
    type: 'fill-blank',
    difficulty: 'hard',
    question: "In Fullmetal Alchemist, the first law of alchemy is: 'To obtain something, something of _____ value must be lost.'",
    correctAnswer: "equal",
    explanation: "The Law of Equivalent Exchange states that to obtain something, something of equal value must be lost.",
    timeLimit: 45
  },
  {
    id: '10',
    type: 'mcq',
    difficulty: 'easy',
    question: "What type of food does Goku love most in Dragon Ball?",
    options: ['Ramen', 'Sushi', 'Rice', 'Any food'],
    correctAnswer: 3,
    explanation: "Goku loves all types of food and has an enormous appetite!",
    timeLimit: 25
  },
  {
    id: '11',
    type: 'true-false',
    difficulty: 'medium',
    question: "In Attack on Titan, the Colossal Titan is 60 meters tall.",
    correctAnswer: 1,
    explanation: "True! The Colossal Titan stands at 60 meters tall.",
    timeLimit: 30
  },
  {
    id: '12',
    type: 'mcq',
    difficulty: 'hard',
    question: "In Jujutsu Kaisen, what is Yuji Itadori's cursed technique called?",
    options: ['Divergent Fist', 'Black Flash', 'Shrine', 'Blood Manipulation'],
    correctAnswer: 2,
    explanation: "Yuji inherits Sukuna's cursed technique called 'Shrine' which includes Cleave and Dismantle.",
    timeLimit: 35
  },
  {
    id: '13',
    type: 'fill-blank',
    difficulty: 'medium',
    question: "In Spirited Away, Chihiro works at a _____ house to save her parents.",
    correctAnswer: "bath",
    explanation: "Chihiro works at Yubaba's bathhouse for spirits.",
    timeLimit: 30
  },
  {
    id: '14',
    type: 'true-false',
    difficulty: 'easy',
    question: "Pikachu is Ash's first Pokémon in the Pokémon anime series.",
    correctAnswer: 1,
    explanation: "True! Pikachu was given to Ash as his starter Pokémon by Professor Oak.",
    timeLimit: 20
  },
  {
    id: '15',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of Edward Elric's brother in Fullmetal Alchemist?",
    options: ['Alphonse', 'Roy', 'Winry', 'Maes'],
    correctAnswer: 0,
    explanation: "Alphonse Elric is Edward's younger brother who lost his body in a failed alchemical experiment.",
    timeLimit: 30
  }
];

// Track used questions to prevent repetition
const usedQuestionIds = new Set<string>();

export const generateMockQuiz = (difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Quiz => {
  const filteredQuestions = mockQuestions.filter(q => q.difficulty === difficulty);
  
  // Create a pool of available questions (excluding recently used ones)
  let availableQuestions = filteredQuestions.filter(q => !usedQuestionIds.has(q.id));
  
  // If we've used all questions, reset the pool but shuffle it
  if (availableQuestions.length < count) {
    usedQuestionIds.clear();
    availableQuestions = [...filteredQuestions];
  }
  
  // Shuffle the available questions
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  
  // Select unique questions
  const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length)).map((question, index) => {
    // Mark this question as used
    usedQuestionIds.add(question.id);
    
    return {
      ...question,
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    };
  });
  
  // If we don't have enough questions of the specified difficulty, 
  // fill with questions from other difficulties
  if (selectedQuestions.length < count) {
    const allOtherQuestions = mockQuestions
      .filter(q => q.difficulty !== difficulty && !usedQuestionIds.has(q.id))
      .sort(() => Math.random() - 0.5);
    
    const needed = count - selectedQuestions.length;
    const additionalQuestions = allOtherQuestions.slice(0, needed).map((question, index) => {
      usedQuestionIds.add(question.id);
      return {
        ...question,
        id: `${Date.now()}-additional-${index}-${Math.random().toString(36).substr(2, 9)}`
      };
    });
    
    selectedQuestions.push(...additionalQuestions);
  }
  
  return {
    id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    questions: selectedQuestions,
    difficulty,
    timeLimit: selectedQuestions.reduce((total, q) => total + q.timeLimit, 0),
    createdAt: new Date()
  };
};