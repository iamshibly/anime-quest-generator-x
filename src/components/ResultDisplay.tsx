import { QuizResult, Quiz } from '../types/quiz';
import { Trophy, Target, Clock, RotateCcw, ArrowRight } from 'lucide-react';

interface ResultDisplayProps {
  result: QuizResult;
  quiz: Quiz;
  onRetry: () => void;
  onNewQuiz: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const ResultDisplay = ({ result, quiz, onRetry, onNewQuiz }: ResultDisplayProps) => {
  const scorePercentage = (result.score / result.totalQuestions) * 100;

  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-success';
    if (scorePercentage >= 70) return 'text-warning';
    return 'text-danger';
  };

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return 'Outstanding! 🎉';
    if (scorePercentage >= 80) return 'Great job! 👏';
    if (scorePercentage >= 70) return 'Good work! 👍';
    if (scorePercentage >= 50) return 'Not bad! 📚';
    return 'Keep practicing! 💪';
  };

  const getXPEarned = () => {
    if (scorePercentage >= 90) return 200;
    if (scorePercentage >= 80) return 100;
    if (scorePercentage >= 70) return 50;
    return 20;
  };

  const getGrade = () => {
    if (scorePercentage >= 90) return 'A+';
    if (scorePercentage >= 85) return 'A';
    if (scorePercentage >= 80) return 'B+';
    if (scorePercentage >= 75) return 'B';
    if (scorePercentage >= 70) return 'C+';
    if (scorePercentage >= 65) return 'C';
    if (scorePercentage >= 60) return 'D+';
    if (scorePercentage >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className="card-anime text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {scorePercentage >= 90 ? '🏆' : scorePercentage >= 70 ? '🌟' : '📚'}
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl text-muted-foreground">{getScoreMessage()}</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 rounded-xl bg-primary/10 border border-primary">
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {result.score}/{result.totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Questions Correct</div>
          </div>
          
          <div className="p-6 rounded-xl bg-accent/10 border border-accent">
            <div className="text-4xl font-bold text-accent">
              {scorePercentage.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
          </div>
          
          <div className="p-6 rounded-xl bg-success/10 border border-success">
            <div className="text-4xl font-bold text-success">
              {getGrade()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Grade</div>
          </div>
        </div>

        {/* XP Earned */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary-glow/20 border border-primary mb-6">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">+{getXPEarned()} XP Earned!</span>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>Difficulty: {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Time Limit: {quiz.timeLimit}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className="btn-secondary-anime flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => onNewQuiz('medium')}
            className="btn-anime flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            New Quiz
          </button>
        </div>
      </div>

      {/* Question Review */}
      <div className="card-anime">
        <h3 className="text-xl font-bold mb-4">Question Review</h3>
        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = result.answers[index];
            const isCorrect = userAnswer?.isCorrect;
            
            return (
              <div 
                key={question.id}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect 
                    ? 'border-success bg-success/10' 
                    : 'border-danger bg-danger/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    isCorrect ? 'bg-success' : 'bg-danger'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{question.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={isCorrect ? 'text-success font-medium' : 'text-danger font-medium'}>
                          {question.type === 'mcq' 
                            ? question.options?.[userAnswer?.userAnswer as number] || 'No answer'
                            : question.type === 'true-false'
                              ? (userAnswer?.userAnswer === 1 ? 'True' : userAnswer?.userAnswer === 0 ? 'False' : 'No answer')
                              : userAnswer?.userAnswer || 'No answer'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Correct answer: </span>
                        <span className="text-success font-medium">
                          {question.type === 'mcq' 
                            ? question.options?.[question.correctAnswer as number]
                            : question.type === 'true-false'
                              ? (question.correctAnswer === 1 ? 'True' : 'False')
                              : question.correctAnswer
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl ${isCorrect ? 'text-success' : 'text-danger'}`}>
                    {isCorrect ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};