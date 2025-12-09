import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const play = useCallback((src: string) => {
    setIsLoading(true);

    // If switching tracks, cleanup old audio
    if (currentTrack !== src) {
      cleanup();
      
      const newAudio = new Audio();
      newAudio.preload = 'metadata';
      newAudio.src = src;
      
      audioRef.current = newAudio;
      setCurrentTrack(src);
      setCurrentTime(0);
      setDuration(0);

      // Setup event listeners
      const handleLoadedMetadata = () => {
        console.log('✅ Metadata loaded - Duration:', newAudio.duration);
        setDuration(newAudio.duration);
        setIsLoading(false);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(newAudio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleError = (e: ErrorEvent) => {
        console.error('❌ Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      };

      newAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
      newAudio.addEventListener('canplay', handleCanPlay);
      newAudio.addEventListener('timeupdate', handleTimeUpdate);
      newAudio.addEventListener('ended', handleEnded);
      newAudio.addEventListener('error', handleError as any);

      // Load and play
      newAudio.load();
      newAudio.play()
        .then(() => {
          console.log('▶️ Playing:', src);
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('❌ Play error:', error);
          setIsLoading(false);
          setIsPlaying(false);
        });
    } else {
      // Same track, just resume
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('❌ Play error:', error);
            setIsLoading(false);
          });
      }
    }
  }, [currentTrack, cleanup]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    isLoading,
    play,
    pause,
    stop,
    seek,
  };
};
