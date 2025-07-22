import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, QuizResult, User } from '../types/quiz';
import { generateMockQuiz } from '../data/mockQuizzes';
import { quizAPI } from '../services/quizAPI';
import { toast } from 'sonner';

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<string | number | number[]>>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startQuiz = useCallback(async (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsLoading(true);
    try {
      console.log(`Starting ${difficulty} quiz with AI generation...`);
      
      // Use the API service for better error handling and validation
      const quiz = await quizAPI.generateQuiz({
        difficulty,
        questionCount: 5,
        topics: [] // Can be extended later for specific anime/manga series
      });

      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizResult(null);
      setTimeRemaining(quiz.questions[0]?.timeLimit || 30);
      setIsQuizActive(true);
      
      toast.success(`🎌 AI-generated ${difficulty} quiz ready! Let's test your knowledge!`);
    } catch (error) {
      console.error('AI quiz generation failed:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock quiz data...');
      const mockQuiz = generateMockQuiz(difficulty, 5);
      
      setCurrentQuiz(mockQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizResult(null);
      setTimeRemaining(mockQuiz.questions[0]?.timeLimit || 30);
      setIsQuizActive(true);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.warning(`🔄 Using offline mode: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback((answer: string | number | number[]) => {
    if (!currentQuiz || !isQuizActive) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(currentQuiz.questions[currentQuestionIndex + 1]?.timeLimit || 30);
    } else {
      finishQuiz(newAnswers);
    }
  }, [currentQuiz, currentQuestionIndex, userAnswers, isQuizActive]);

  const finishQuiz = useCallback((answers: Array<string | number | number[]> = userAnswers) => {
    if (!currentQuiz) return;

    setIsQuizActive(false);
    
    let score = 0;
    const resultAnswers = currentQuiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      
      // Handle different question types for correctness checking
      if (question.type === 'multiple-select' || question.type === 'ranking') {
        // For array answers, check if arrays match exactly
        const correctAnswer = question.correctAnswer as number[];
        const userAnswerArray = userAnswer as number[];
        isCorrect = Array.isArray(correctAnswer) && Array.isArray(userAnswerArray) &&
          correctAnswer.length === userAnswerArray.length &&
          correctAnswer.every((val, idx) => val === userAnswerArray[idx]);
      } else {
        // For single value answers
        isCorrect = userAnswer === question.correctAnswer;
      }
      
      if (isCorrect) score++;
      
      return {
        questionId: question.id,
        userAnswer: userAnswer || '',
        isCorrect
      };
    });

    const result: QuizResult = {
      quizId: currentQuiz.id,
      userId: getCurrentUser().id,
      score,
      totalQuestions: currentQuiz.questions.length,
      timeTaken: 0, // Would calculate actual time taken
      answers: resultAnswers,
      completedAt: new Date()
    };

    setQuizResult(result);
    updateUserStats(result);
    toast.success(`Quiz completed! Score: ${score}/${currentQuiz.questions.length}`);
  }, [currentQuiz, userAnswers]);

  const timeUp = useCallback(() => {
    if (isQuizActive) {
      finishQuiz();
      toast.warning('Time\'s up! Quiz auto-submitted.');
    }
  }, [isQuizActive, finishQuiz]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsQuizActive(false);
    setTimeRemaining(0);
    setQuizResult(null);
  }, []);

  return {
    currentQuiz,
    currentQuestion: currentQuiz?.questions[currentQuestionIndex] || null,
    currentQuestionIndex,
    userAnswers,
    isQuizActive,
    timeRemaining,
    setTimeRemaining,
    quizResult,
    isLoading,
    startQuiz,
    submitAnswer,
    finishQuiz,
    timeUp,
    resetQuiz
  };
};

// Helper functions
const getCurrentUser = (): User => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: `Player${Math.floor(Math.random() * 1000)}`,
    totalXP: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    rank: 0
  };
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

const updateUserStats = (result: QuizResult) => {
  const user = getCurrentUser();
  const scorePercentage = (result.score / result.totalQuestions) * 100;
  
  // Calculate XP based on performance
  let xpGained = 20; // Base XP
  if (scorePercentage >= 90) xpGained = 200;
  else if (scorePercentage >= 80) xpGained = 100;
  else if (scorePercentage >= 70) xpGained = 50;
  
  const updatedUser: User = {
    ...user,
    totalXP: user.totalXP + xpGained,
    quizzesCompleted: user.quizzesCompleted + 1,
    averageScore: ((user.averageScore * user.quizzesCompleted) + scorePercentage) / (user.quizzesCompleted + 1)
  };
  
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  updateLeaderboard(updatedUser, xpGained);
  
  toast.success(`+${xpGained} XP earned!`);
};

const updateLeaderboard = (user: User, xpGained: number) => {
  const leaderboardData = localStorage.getItem('leaderboard');
  let leaderboard: User[] = leaderboardData ? JSON.parse(leaderboardData) : [];
  
  const existingUserIndex = leaderboard.findIndex(u => u.id === user.id);
  if (existingUserIndex >= 0) {
    leaderboard[existingUserIndex] = user;
  } else {
    leaderboard.push(user);
  }
  
  leaderboard.sort((a, b) => b.totalXP - a.totalXP);
  leaderboard = leaderboard.slice(0, 10); // Keep only top 10
  
  // Update ranks
  leaderboard.forEach((user, index) => {
    user.rank = index + 1;
  });
  
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
};