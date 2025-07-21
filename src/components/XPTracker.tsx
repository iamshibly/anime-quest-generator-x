import { useState, useEffect } from 'react';
import { User } from '../types/quiz';
import { Zap, TrendingUp, Target, Award } from 'lucide-react';

export const XPTracker = () => {
  const [user, setUser] = useState<User | null>(null);
  const [xpProgress, setXPProgress] = useState(0);

  useEffect(() => {
    loadUser();
    const interval = setInterval(loadUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = () => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      setUser(currentUser);
      calculateProgress(currentUser.totalXP);
    }
  };

  const calculateProgress = (xp: number) => {
    // Simple level system: every 1000 XP is a new level
    const currentLevel = Math.floor(xp / 1000);
    const xpInCurrentLevel = xp % 1000;
    const progressPercentage = (xpInCurrentLevel / 1000) * 100;
    setXPProgress(progressPercentage);
  };

  const getLevel = (xp: number) => Math.floor(xp / 1000) + 1;
  const getXPToNextLevel = (xp: number) => 1000 - (xp % 1000);

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Anime Legend';
    if (level >= 25) return 'Manga Master';
    if (level >= 15) return 'Otaku Expert';
    if (level >= 10) return 'Quiz Veteran';
    if (level >= 5) return 'Rising Star';
    return 'Anime Newbie';
  };

  const getLevelIcon = (level: number) => {
    if (level >= 50) return '👑';
    if (level >= 25) return '🌟';
    if (level >= 15) return '🔥';
    if (level >= 10) return '⚡';
    if (level >= 5) return '🚀';
    return '🌱';
  };

  if (!user) {
    return (
      <div className="card-anime animate-pulse">
        <div className="h-24 bg-muted rounded-xl"></div>
      </div>
    );
  }

  const currentLevel = getLevel(user.totalXP);
  const xpToNext = getXPToNextLevel(user.totalXP);

  return (
    <div className="card-anime">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">XP Progress</h3>
          <p className="text-sm text-muted-foreground">Level up by completing quizzes!</p>
        </div>
      </div>

      {/* Current Level */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getLevelIcon(currentLevel)}</div>
          <div>
            <div className="text-2xl font-bold text-primary">Level {currentLevel}</div>
            <div className="text-sm text-muted-foreground">{getLevelTitle(currentLevel)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{user.totalXP.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progress to Level {currentLevel + 1}</span>
          <span className="text-sm font-medium">{xpToNext} XP to go</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-xl bg-success/10 border border-success/20">
          <div className="text-lg font-bold text-success">{user.quizzesCompleted}</div>
          <div className="text-xs text-muted-foreground">Quizzes</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-warning/10 border border-warning/20">
          <div className="text-lg font-bold text-warning">{user.averageScore.toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="text-lg font-bold text-secondary">#{user.rank || '--'}</div>
          <div className="text-xs text-muted-foreground">Rank</div>
        </div>
      </div>

      {/* Achievements Hint */}
      <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Next Milestone</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {currentLevel < 5 && 'Complete 5 more quizzes to become a Rising Star! 🚀'}
          {currentLevel >= 5 && currentLevel < 10 && 'Keep going to become a Quiz Veteran! ⚡'}
          {currentLevel >= 10 && currentLevel < 15 && 'You\'re on your way to Otaku Expert! 🔥'}
          {currentLevel >= 15 && currentLevel < 25 && 'Almost a Manga Master! 🌟'}
          {currentLevel >= 25 && currentLevel < 50 && 'Legend status awaits! 👑'}
          {currentLevel >= 50 && 'You are a true Anime Legend! 👑'}
        </p>
      </div>
    </div>
  );
};