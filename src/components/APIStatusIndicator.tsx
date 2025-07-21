import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface APIStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  responseTime: number | null;
  error: string | null;
}

export const APIStatusIndicator = () => {
  const [status, setStatus] = useState<APIStatus>({
    isOnline: false,
    lastChecked: null,
    responseTime: null,
    error: null
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkAPIStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setStatus({
          isOnline: true,
          lastChecked: new Date(),
          responseTime,
          error: null
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('API health check failed:', error);
      setStatus({
        isOnline: false,
        lastChecked: new Date(),
        responseTime: null,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkAPIStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkAPIStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'text-warning';
    return status.isOnline ? 'text-success' : 'text-danger';
  };

  const getStatusIcon = () => {
    if (isChecking) return <Clock className="w-4 h-4 animate-spin" />;
    if (status.isOnline) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (status.isOnline) {
      return `Online ${status.responseTime ? `(${status.responseTime}ms)` : ''}`;
    }
    return 'Offline - Using mock data';
  };

  return (
    <div className="card-anime">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm">🌐 API Status</h4>
        <button
          onClick={checkAPIStatus}
          disabled={isChecking}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={getStatusColor()}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {status.lastChecked && (
            <div className="text-xs text-muted-foreground">
              Last checked: {status.lastChecked.toLocaleTimeString()}
            </div>
          )}
          {status.error && (
            <div className="text-xs text-danger mt-1">
              Error: {status.error}
            </div>
          )}
        </div>
      </div>

      {/* Status Details */}
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Backend:</span>
          <span className={status.isOnline ? 'text-success' : 'text-danger'}>
            {status.isOnline ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Quiz Mode:</span>
          <span className={status.isOnline ? 'text-primary' : 'text-warning'}>
            {status.isOnline ? 'AI Generated' : 'Mock Data'}
          </span>
        </div>
      </div>

      {!status.isOnline && (
        <div className="mt-3 p-2 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-xs text-warning">
            💡 Start the backend server to enable AI-generated quizzes!
          </p>
        </div>
      )}
    </div>
  );
};