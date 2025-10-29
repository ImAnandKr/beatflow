import React from 'react'; // <-- FIX
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
} from 'lucide-react';
import { motion } from 'framer-motion';
import usePlayer from '../hooks/usePlayer';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlayPause,
    playNext,
    playPrevious,
    handleSeek,
    handleVolumeChange,
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-t-lg"
    >
      {/* Song Info */}
      <div className="flex items-center w-1/4 gap-3">
        <img
          src={currentSong.image}
          alt={currentSong.name}
          className="w-14 h-14 rounded-md"
        />
        <div className="hidden md:block">
          <p className="font-semibold truncate text-md">{currentSong.name}</p>
          <p className="text-sm truncate text-neutral-600 dark:text-neutral-400">
            {currentSong.primaryArtists}
          </p>
        </div>
      </div>

      {/* Player Controls & Progress */}
      <div className="flex flex-col items-center flex-1 w-1/2 max-w-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={playPrevious}
            className="transition-transform hover:scale-110"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-10 h-10 transition-transform rounded-full bg-primary text-white hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={playNext}
            className="transition-transform hover:scale-110"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center w-full gap-2 mt-2">
          <span className="text-xs">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-700 range-sm"
            style={{
              backgroundSize: `${(progress / duration) * 100}% 100%`,
            }}
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end w-1/4 gap-2">
        <VolumeIcon />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="hidden w-24 h-1 rounded-lg appearance-none cursor-pointer md:block bg-neutral-200 dark:bg-neutral-700 range-sm"
        />
      </div>
    </motion.div>
  );
};

export default MusicPlayer;