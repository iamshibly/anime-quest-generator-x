import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { User } from '../types/quiz';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Bot users for populating leaderboard
  const botUsers: User[] = [
    { id: 'bot-1', name: 'OtakuMaster', totalXP: 15420, quizzesCompleted: 87, averageScore: 94.5, rank: 1 },
    { id: 'bot-2', name: 'AnimeExpert', totalXP: 12850, quizzesCompleted: 76, averageScore: 91.2, rank: 2 },
    { id: 'bot-3', name: 'MangaKing', totalXP: 10950, quizzesCompleted: 63, averageScore: 88.7, rank: 3 },
    { id: 'bot-4', name: 'TokyoFan', totalXP: 8750, quizzesCompleted: 52, averageScore: 85.3, rank: 4 },
    { id: 'bot-5', name: 'NinjaWiz', totalXP: 7320, quizzesCompleted: 41, averageScore: 82.1, rank: 5 },
    { id: 'bot-6', name: 'DragonSlayer', totalXP: 6180, quizzesCompleted: 38, averageScore: 79.4, rank: 6 },
    { id: 'bot-7', name: 'PirateKing', totalXP: 5440, quizzesCompleted: 33, averageScore: 76.8, rank: 7 },
    { id: 'bot-8', name: 'ShinigamiX', totalXP: 4670, quizzesCompleted: 29, averageScore: 74.2, rank: 8 }
  ];

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = () => {
    const data = localStorage.getItem('leaderboard');
    let realUsers: User[] = data ? JSON.parse(data) : [];
    
    // Merge real users with bot users and sort by XP
    const combinedUsers = [...realUsers, ...botUsers]
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 10); // Top 10 only
    
    // Update ranks
    combinedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    setLeaderboard(combinedUsers);
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
            <p className="text-muted-foreground">Loading leaderboard...</p>
            <p className="text-sm text-muted-foreground">Compete with other anime fans!</p>
          </div>
        ) : (
          leaderboard.map((user, index) => {
            const isCurrentUser = user.id === currentUser?.id;
            const isBot = user.id.startsWith('bot-');
            
            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isCurrentUser
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isBot ? 'bg-gradient-to-r from-secondary to-accent' : 'bg-gradient-to-r from-primary to-secondary'
                      }`}>
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{user.name}</h3>
                          {isBot && <span className="text-xs bg-muted px-2 py-1 rounded-full">BOT</span>}
                          {isCurrentUser && <span className="text-xs bg-primary px-2 py-1 rounded-full text-white">YOU</span>}
                        </div>
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
            );
          })
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