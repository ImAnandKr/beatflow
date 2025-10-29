import React, { createContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]); // The current queue
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // 50% volume

  const audioRef = useRef(null);

  // Function to clean up image URLs
  const cleanUrl = (url) => {
    if (!url) return '';
    return url.replace(/_90x90\.jpg|_150x150\.jpg|_500x500\.jpg/g, '_500x500\.jpg');
  };

  // Function to get the best quality download URL
  const getBestDownloadUrl = (downloadUrl) => {
    if (!downloadUrl) return null;
    return (
      downloadUrl.find((q) => q.quality === '320kbps') ||
      downloadUrl.find((q) => q.quality === '160kbps') ||
      downloadUrl.find((q) => q.quality === '96kbps') ||
      downloadUrl[0]
    )?.url;
  };

  // Effect to handle audio playback
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error('Play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Effect to update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song, songList = []) => {
    const songUrl = getBestDownloadUrl(song.downloadUrl);
    if (!songUrl) {
      alert('This song is not available for streaming.');
      return;
    }

    const cleanedSong = {
      ...song,
      image: cleanUrl(song.image[2]?.url),
      url: songUrl,
      primaryArtists: song.artists.primary
        .map((artist) => artist.name)
        .join(', '),
    };

    setCurrentSong(cleanedSong);
    setPlaylist(songList.length > 0 ? songList : [song]); // Set the queue
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex], playlist);
  };

  const playPrevious = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex], playlist);
  };

  // Audio element event handlers
  const onTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const onLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
    playNext();
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        handleSeek,
        handleVolumeChange,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onEnded={onEnded}
      />
    </PlayerContext.Provider>
  );
};

export default PlayerContext;