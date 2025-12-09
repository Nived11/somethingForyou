import { Play, Pause, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading?: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const AudioPlayer = ({ 
  isPlaying, 
  currentTime, 
  duration, 
  isLoading = false,
  onPlayPause, 
  onSeek 
}: AudioPlayerProps) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        disabled={isLoading}
        className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-indigo-700 transition-colors flex-shrink-0 disabled:bg-gray-400"
        type="button"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} fill="white" />
        ) : (
          <Play size={16} fill="white" />
        )}
      </button>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            disabled={duration === 0}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: duration > 0 
                ? `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${progressPercentage}%, #E5E7EB ${progressPercentage}%, #E5E7EB 100%)`
                : '#E5E7EB'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>
            {isLoading ? 'Loading...' : duration > 0 ? formatTime(duration) : '0:00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
