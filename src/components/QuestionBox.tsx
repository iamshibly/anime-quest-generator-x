import { useState, useEffect } from 'react';
import { Question } from '../types/quiz';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuestionBoxProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string | number | number[]) => void;
  isResultMode?: boolean;
  userAnswer?: string | number | number[];
  showResult?: boolean;
}

export const QuestionBox = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  isResultMode = false, 
  userAnswer, 
  showResult = false 
}: QuestionBoxProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | number[]>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setHasSubmitted(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (selectedAnswer !== '' && !hasSubmitted) {
      setHasSubmitted(true);
      onAnswer(selectedAnswer);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success/10 border-success';
      case 'medium': return 'text-warning bg-warning/10 border-warning';
      case 'hard': return 'text-danger bg-danger/10 border-danger';
      default: return 'text-primary bg-primary/10 border-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '📝';
      case 'true-false': return '✅';
      case 'fill-blank': return '📝';
      case 'image-based': return '🖼️';
      case 'multiple-select': return '☑️';
      case 'ranking': return '📊';
      case 'number': return '🔢';
      default: return '❓';
    }
  };

  const renderMCQOptions = () => {
    return question.options?.map((option, index) => {
      const isSelected = selectedAnswer === index;
      const isCorrect = question.correctAnswer === index;
      const isUserAnswer = userAnswer === index;
      
      let optionClass = 'quiz-option';
      if (showResult) {
        if (isCorrect) optionClass += ' correct';
        else if (isUserAnswer && !isCorrect) optionClass += ' incorrect';
      } else if (isSelected) {
        optionClass += ' selected';
      }

      return (
        <button
          key={index}
          className={optionClass}
          onClick={() => !isResultMode && !hasSubmitted && setSelectedAnswer(index)}
          disabled={isResultMode || hasSubmitted}
        >
          <div className="flex items-center justify-between">
            <span className="text-left flex-1">{option}</span>
            {showResult && (
              <div className="ml-2">
                {isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                {isUserAnswer && !isCorrect && <XCircle className="w-5 h-5 text-danger" />}
              </div>
            )}
          </div>
        </button>
      );
    });
  };

  const renderTrueFalse = () => {
    const options = ['False', 'True'];
    return options.map((option, index) => {
      const isSelected = selectedAnswer === index;
      const isCorrect = question.correctAnswer === index;
      const isUserAnswer = userAnswer === index;
      
      let optionClass = 'quiz-option';
      if (showResult) {
        if (isCorrect) optionClass += ' correct';
        else if (isUserAnswer && !isCorrect) optionClass += ' incorrect';
      } else if (isSelected) {
        optionClass += ' selected';
      }

      return (
        <button
          key={index}
          className={optionClass}
          onClick={() => !isResultMode && !hasSubmitted && setSelectedAnswer(index)}
          disabled={isResultMode || hasSubmitted}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">{option === 'True' ? '✅' : '❌'}</span>
            <span className="font-medium">{option}</span>
            {showResult && (
              <div className="ml-2">
                {isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                {isUserAnswer && !isCorrect && <XCircle className="w-5 h-5 text-danger" />}
              </div>
            )}
          </div>
        </button>
      );
    });
  };

  const renderFillInBlank = () => {
    return (
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-4 rounded-xl border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none transition-colors"
          placeholder="Type your answer here..."
          value={selectedAnswer as string}
          onChange={(e) => !isResultMode && !hasSubmitted && setSelectedAnswer(e.target.value)}
          disabled={isResultMode || hasSubmitted}
        />
        {showResult && (
          <div className="p-4 rounded-xl bg-success/10 border border-success">
            <p className="text-success font-medium">Correct Answer: {question.correctAnswer}</p>
            {userAnswer && (
              <p className="text-muted-foreground">Your Answer: {userAnswer}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMultipleSelect = () => {
    const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    
    return question.options?.map((option, index) => {
      const isSelected = selectedArray.includes(index);
      const isCorrect = Array.isArray(question.correctAnswer) && question.correctAnswer.includes(index);
      const isUserAnswer = Array.isArray(userAnswer) && userAnswer.includes(index);
      
      let optionClass = 'quiz-option';
      if (showResult) {
        if (isCorrect) optionClass += ' correct';
        else if (isUserAnswer && !isCorrect) optionClass += ' incorrect';
      } else if (isSelected) {
        optionClass += ' selected';
      }

      return (
        <button
          key={index}
          className={optionClass}
          onClick={() => {
            if (!isResultMode && !hasSubmitted) {
              const newSelected = [...selectedArray];
              if (newSelected.includes(index)) {
                newSelected.splice(newSelected.indexOf(index), 1);
              } else {
                newSelected.push(index);
              }
              setSelectedAnswer(newSelected);
            }
          }}
          disabled={isResultMode || hasSubmitted}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                isSelected ? 'bg-primary border-primary' : 'border-border'
              }`}>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-left flex-1">{option}</span>
            </div>
            {showResult && (
              <div className="ml-2">
                {isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                {isUserAnswer && !isCorrect && <XCircle className="w-5 h-5 text-danger" />}
              </div>
            )}
          </div>
        </button>
      );
    });
  };

  const renderRanking = () => {
    const rankingArray = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Drag to reorder or click to select position:</p>
        <div className="space-y-2">
          {question.options?.map((option, index) => {
            const currentPosition = rankingArray.indexOf(index);
            const displayPosition = currentPosition >= 0 ? currentPosition + 1 : '?';
            
            return (
              <div
                key={index}
                className="p-3 rounded-xl border-2 border-border bg-card flex items-center justify-between hover:border-primary/50 transition-colors"
              >
                <span>{option}</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => {
                        if (!isResultMode && !hasSubmitted) {
                          const newRanking = [...rankingArray];
                          const currentPos = newRanking.indexOf(index);
                          if (currentPos >= 0) newRanking.splice(currentPos, 1);
                          newRanking.splice(pos - 1, 0, index);
                          setSelectedAnswer(newRanking.slice(0, question.options?.length || 0));
                        }
                      }}
                      disabled={isResultMode || hasSubmitted}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                        currentPosition === pos - 1
                          ? 'bg-primary border-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {showResult && (
          <div className="p-4 rounded-xl bg-success/10 border border-success">
            <p className="text-success font-medium">Correct Order: {
              Array.isArray(question.correctAnswer) && question.options
                ? question.correctAnswer.map(idx => question.options![idx]).join(' → ')
                : 'N/A'
            }</p>
          </div>
        )}
      </div>
    );
  };

  const renderNumber = () => {
    return (
      <div className="space-y-4">
        <input
          type="number"
          className="w-full p-4 rounded-xl border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none transition-colors"
          placeholder="Enter your answer..."
          value={selectedAnswer as number || ''}
          onChange={(e) => !isResultMode && !hasSubmitted && setSelectedAnswer(parseInt(e.target.value) || 0)}
          disabled={isResultMode || hasSubmitted}
        />
        {showResult && (
          <div className="p-4 rounded-xl bg-success/10 border border-success">
            <p className="text-success font-medium">Correct Answer: {question.correctAnswer}</p>
            {userAnswer && (
              <p className="text-muted-foreground">Your Answer: {userAnswer}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card-anime">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getTypeIcon(question.type)}</span>
          <div>
            <div className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Time Limit</div>
          <div className="font-bold text-primary">{question.timeLimit}s</div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 leading-relaxed">
          {question.question}
        </h2>
        {question.imageUrl && (
          <img 
            src={question.imageUrl} 
            alt="Question image" 
            className="w-full max-w-md mx-auto rounded-xl shadow-lg"
          />
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.type === 'mcq' && renderMCQOptions()}
        {question.type === 'true-false' && renderTrueFalse()}
        {question.type === 'fill-blank' && renderFillInBlank()}
        {question.type === 'multiple-select' && renderMultipleSelect()}
        {question.type === 'ranking' && renderRanking()}
        {question.type === 'number' && renderNumber()}
      </div>

      {/* Submit Button */}
      {!isResultMode && !hasSubmitted && (
        <button
          className="btn-anime w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={
            selectedAnswer === '' || 
            (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) ||
            (question.type === 'ranking' && Array.isArray(selectedAnswer) && selectedAnswer.length !== question.options?.length)
          }
        >
          Submit Answer
        </button>
      )}

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-primary mb-1">Explanation</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};