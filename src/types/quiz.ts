export interface Question {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'image-based' | 'multiple-select' | 'ranking' | 'number';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | number | number[];
  explanation?: string;
  imageUrl?: string;
  timeLimit: number; // in seconds
}

export interface Quiz {
  id: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  createdAt: Date;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  answers: Array<{
    questionId: string;
    userAnswer: string | number | number[];
    isCorrect: boolean;
  }>;
  completedAt: Date;
}

export interface User {
  id: string;
  name: string;
  totalXP: number;
  quizzesCompleted: number;
  averageScore: number;
  rank: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
}