import { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer = ({ timeRemaining, setTimeRemaining, onTimeUp, isActive }: TimerProps) => {
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
      
      if (timeRemaining <= 1) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isActive, setTimeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-danger';
    if (timeRemaining <= 30) return 'text-warning';
    return 'text-primary';
  };

  const getProgressWidth = (total: number) => {
    const percentage = (timeRemaining / total) * 100;
    return Math.max(0, percentage);
  };

  return (
    <div className="card-anime mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        </div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            timeRemaining <= 10 
              ? 'bg-gradient-to-r from-danger to-warning' 
              : timeRemaining <= 30 
                ? 'bg-gradient-to-r from-warning to-accent'
                : 'bg-gradient-to-r from-primary to-primary-glow'
          }`}
          style={{ width: `${getProgressWidth(60)}%` }}
        />
      </div>
      
      {timeRemaining <= 10 && (
        <div className="mt-2 text-center">
          <span className="text-danger text-sm font-medium animate-pulse">
            ⚠️ Hurry up! Time is running out!
          </span>
        </div>
      )}
    </div>
  );
};