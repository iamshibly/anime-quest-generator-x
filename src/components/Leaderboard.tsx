import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { User } from '../types/quiz';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = () => {
    const data = localStorage.getItem('leaderboard');
    if (data) {
      setLeaderboard(JSON.parse(data));
    }
  };

  const loadCurrentUser = () => {
    const data = localStorage.getItem('currentUser');
    if (data) {
      setCurrentUser(JSON.parse(data));
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-accent" />;
      case 2: return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3: return <Award className="w-6 h-6 text-warning" />;
      default: return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-accent to-warning text-accent-foreground';
      case 2: return 'bg-gradient-to-r from-muted to-border text-foreground';
      case 3: return 'bg-gradient-to-r from-warning to-accent text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatXP = (xp: number) => {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
  };

  return (
    <div className="card-anime">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <p className="text-muted-foreground">Top 10 Quiz Masters</p>
        </div>
      </div>

      {/* Current User Status */}
      {currentUser && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">Your Stats</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatXP(currentUser.totalXP)} XP
              </div>
              <div className="text-sm text-muted-foreground">
                Rank #{currentUser.rank || 'Unranked'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/20">
            <div className="text-center">
              <div className="text-lg font-bold">{currentUser.quizzesCompleted}</div>
              <div className="text-xs text-muted-foreground">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{currentUser.averageScore.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-muted-foreground">No players yet!</p>
            <p className="text-sm text-muted-foreground">Be the first to complete a quiz and claim the top spot!</p>
          </div>
        ) : (
          leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                user.id === currentUser?.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBadge(user.rank)}`}>
                    {user.rank <= 3 ? getRankIcon(user.rank) : <span className="font-bold text-sm">#{user.rank}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>🎯 {user.quizzesCompleted} quizzes</span>
                        <span>📊 {user.averageScore.toFixed(1)}% avg</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {formatXP(user.totalXP)}
                  </div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* XP Levels Info */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <h4 className="font-bold mb-2">🎖️ XP Rewards</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>🥇 90%+ Score: <span className="font-bold text-accent">200 XP</span></div>
          <div>🥈 80%+ Score: <span className="font-bold text-secondary">100 XP</span></div>
          <div>🥉 70%+ Score: <span className="font-bold text-warning">50 XP</span></div>
          <div>📝 Completion: <span className="font-bold text-primary">20 XP</span></div>
        </div>
      </div>
    </div>
  );
};