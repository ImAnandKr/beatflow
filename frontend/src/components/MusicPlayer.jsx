// C:\beatflow\frontend\src\components\MusicPlayer.jsx

import React from 'react';
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
import usePlayer from '../hooks/usePlayer'; // Our updated hook

const MusicPlayer = () => {
  const {
    currentSong, // This is the full track object from Spotify
    isPlaying,
    progress,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    handleSeek,
    handleVolumeChange, // We'll add a volume slider soon
  } = usePlayer();

  // Get data from the Spotify track object
  const imageUrl = currentSong?.album?.images?.[0]?.url;
  const songName = currentSong?.name;
  const artists = currentSong?.artists?.map((artist) => artist.name).join(', ');

  // Convert ms to 0:00 format
  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressSeconds = Math.floor(progress / 1000);
  const durationSeconds = Math.floor(duration / 1000);
  
  const onSeek = (e) => {
      const seekTimeSeconds = Number(e.target.value);
      handleSeek(seekTimeSeconds);
  };
  
  const onVolumeChange = (e) => {
      const newVolume = Number(e.target.value);
      handleVolumeChange(newVolume);
  };
  
  // Don't render the player if there's no song loaded
  if (!currentSong) return null;

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
          src={imageUrl}
          alt={songName}
          className="w-14 h-14 rounded-md"
        />
        <div className="hidden md:block">
          <p className="font-semibold truncate text-md">{songName}</p>
          <p className="text-sm truncate text-neutral-600 dark:text-neutral-400">
            {artists}
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
        
        {/* Progress Bar (now in seconds) */}
        <div className="flex items-center w-full gap-2 mt-2">
          <span className="text-xs">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={durationSeconds || 0}
            value={progressSeconds || 0}
            onChange={onSeek} // Use our new seek handler
            className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-700 range-sm"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end w-1/4 gap-2">
        <Volume2 className="w-5 h-5" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.5" // Default volume
          onChange={onVolumeChange} // Use new volume handler
          className="hidden w-24 h-1 rounded-lg appearance-none cursor-pointer md:block bg-neutral-200 dark:bg-neutral-700 range-sm"
        />
      </div>
    </motion.div>
  );
};

export default MusicPlayer;