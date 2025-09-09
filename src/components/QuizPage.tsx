import { useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { QuestionBox } from './QuestionBox';
import { Timer } from './Timer';
import { ResultDisplay } from './ResultDisplay';
import { Leaderboard } from './Leaderboard';
import { XPTracker } from './XPTracker';
import { APIStatusIndicator } from './APIStatusIndicator';
import { Brain, Zap, Target, Settings, Users, Home } from 'lucide-react';

export const QuizPage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'quiz' | 'results'>('menu');
  
  const {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    isQuizActive,
    timeRemaining,
    setTimeRemaining,
    quizResult,
    isLoading,
    startQuiz,
    submitAnswer,
    timeUp,
    resetQuiz
  } = useQuiz();

  const handleStartQuiz = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setCurrentView('quiz');
    await startQuiz(difficulty);
  };

  const handleQuizComplete = () => {
    setCurrentView('results');
  };

  const handleRetry = () => {
    resetQuiz();
    setCurrentView('menu');
  };

  const handleBackToMenu = () => {
    resetQuiz();
    setCurrentView('menu');
  };

  const handleNewQuiz = (difficulty: 'easy' | 'medium' | 'hard') => {
    resetQuiz();
    handleStartQuiz(difficulty);
  };

  const handleAnswerSubmit = (answer: string | number) => {
    submitAnswer(answer);
    if (currentQuiz && currentQuestionIndex >= currentQuiz.questions.length - 1) {
      setTimeout(() => handleQuizComplete(), 1000);
    }
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'from-success to-success/80',
          icon: '🟢',
          description: 'Perfect for beginners',
          questions: '5 questions',
          time: '30s per question'
        };
      case 'medium':
        return {
          color: 'from-warning to-warning/80',
          icon: '🟡',
          description: 'Good challenge for fans',
          questions: '5 questions',
          time: '30s per question'
        };
      case 'hard':
        return {
          color: 'from-danger to-danger/80',
          icon: '🔴',
          description: 'For true anime experts',
          questions: '5 questions',
          time: '30s per question'
        };
      default:
        return {
          color: 'from-primary to-primary-glow',
          icon: '❓',
          description: 'Unknown difficulty',
          questions: '5 questions',
          time: '30s per question'
        };
    }
  };

  // Menu View
  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Video */}
        <div className="fixed inset-0 w-full h-full z-0">
          <div style={{position:"absolute", width:"100%", height:"100%", top:"0", left:"0"}}>
            <iframe 
              allow="autoplay" 
              height="100%" 
              src="https://streamable.com/e/6byo68?autoplay=1&muted=1&loop=1" 
              width="100%" 
              style={{border:"none", width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none"}}
            />
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 bg-background/80 backdrop-blur-sm min-h-screen">
        {/* Header */}
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Anime & Manga Quiz</h1>
                  <p className="text-muted-foreground">Test your otaku knowledge!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className={`p-2 rounded-xl transition-colors ${
                    showLeaderboard 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <div className="card-anime text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4 animate-float">🎌</div>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Ready to Test Your Knowledge?
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Challenge yourself with questions about your favorite anime and manga series!
                  </p>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="card-anime">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" />
                  Choose Your Difficulty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                    const config = getDifficultyConfig(difficulty);
                    return (
                      <button
                        key={difficulty}
                        onClick={() => handleStartQuiz(difficulty)}
                        disabled={isLoading}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative ${
                          selectedDifficulty === difficulty
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        {isLoading && selectedDifficulty === difficulty && (
                          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-white text-sm font-medium">Generating Quiz...</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-4xl mb-3">{config.icon}</div>
                          <h4 className="text-xl font-bold capitalize mb-2">{difficulty}</h4>
                          <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>📝 {config.questions}</div>
                            <div>⏱️ {config.time}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="card-anime">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  Quiz Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">AI-Generated Questions</h4>
                      <p className="text-sm text-muted-foreground">
                        Fresh questions powered by DeepSeek AI, covering all your favorite series
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Target className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Multiple Question Types</h4>
                      <p className="text-sm text-muted-foreground">
                        MCQ, True/False, Fill in the blanks, and image-based questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Settings className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Timed Challenges</h4>
                      <p className="text-sm text-muted-foreground">
                        Race against the clock with auto-submit when time runs out
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Users className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">XP & Leaderboards</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn XP, level up, and compete with other anime fans
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <APIStatusIndicator />
              <XPTracker />
              {showLeaderboard && <Leaderboard />}
              
              {/* Quick Stats */}
              <div className="card-anime">
                <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Popular Series:</span>
                    <span className="font-medium">One Piece, Naruto, AOT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Question Types:</span>
                    <span className="font-medium">4 different types</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max XP per quiz:</span>
                    <span className="font-medium text-primary">200 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if (currentView === 'quiz' && currentQuiz && currentQuestion) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Video */}
        <div className="fixed inset-0 w-full h-full z-0">
          <div style={{position:"absolute", width:"100%", height:"100%", top:"0", left:"0"}}>
            <iframe 
              allow="autoplay" 
              height="100%" 
              src="https://streamable.com/e/6byo68?autoplay=1&muted=1&loop=1" 
              width="100%" 
              style={{border:"none", width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none"}}
            />
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 bg-background/80 backdrop-blur-sm min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">
                {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Quiz
              </h1>
              <button
                onClick={handleRetry}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <Timer
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onTimeUp={timeUp}
            isActive={isQuizActive}
          />

          <QuestionBox
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentQuiz.questions.length}
            onAnswer={handleAnswerSubmit}
          />
        </div>
        </div>
      </div>
    );
  }

  // Results View
  if (currentView === 'results' && quizResult && currentQuiz) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Video */}
        <div className="fixed inset-0 w-full h-full z-0">
          <div style={{position:"absolute", width:"100%", height:"100%", top:"0", left:"0"}}>
            <iframe 
              allow="autoplay" 
              height="100%" 
              src="https://streamable.com/e/6byo68?autoplay=1&muted=1&loop=1" 
              width="100%" 
              style={{border:"none", width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none"}}
            />
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 bg-background/80 backdrop-blur-sm min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-2">
              <ResultDisplay
                result={quizResult}
                quiz={currentQuiz}
                onRetry={handleRetry}
                onNewQuiz={handleNewQuiz}
                onBackToMenu={handleBackToMenu}
              />
            </div>
            
            {/* Sidebar with Leaderboard and XP */}
            <div className="space-y-6">
              <XPTracker />
              <Leaderboard />
              <APIStatusIndicator />
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return null;
};