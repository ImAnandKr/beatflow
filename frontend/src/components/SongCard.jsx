import React from 'react'; // <-- FIX
import { Play } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';
import { motion } from 'framer-motion';

const SongCard = ({ song, playlist }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();

  // Helper to clean up image URLs for better quality
  const getImageUrl = (image) => {
    if (!image || !Array.isArray(image) || image.length === 0) return '';
    // Get the 150x150 or 500x500 link
    const bestImage =
      image.find((img) => img.quality === '150x150') ||
      image.find((img) => img.quality === '500x500') ||
      image[image.length - 1];
    return bestImage.url.replace('http:', 'https:');
  };

  // Helper to format artist names
  const getArtists = (artists) => {
    if (typeof artists === 'string') return artists;
    if (artists?.primary) {
      return artists.primary.map((artist) => artist.name).join(', ');
    }
    return 'Various Artists';
  };

  const imageUrl = getImageUrl(song.image);
  const artists = getArtists(song.artists);
  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlay = () => {
    playSong(song, playlist);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      className="relative p-4 overflow-hidden transition-all duration-300 rounded-lg shadow-md cursor-pointer group bg-neutral-50 dark:bg-neutral-800 hover:shadow-lg"
      onClick={handlePlay}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={song.name}
          className="object-cover w-full rounded-lg aspect-square"
        />
        {/* Play button overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black/50 ${
            isCurrentlyPlaying
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Play className="w-12 h-12 text-white fill-white" />
        </div>
      </div>
      <div className="mt-3">
        <h3
          className={`font-semibold truncate ${
            isCurrentlyPlaying ? 'text-primary' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: song.name }}
        />
        <p
          className="text-sm truncate text-neutral-600 dark:text-neutral-400"
          dangerouslySetInnerHTML={{ __html: artists }}
        />
      </div>
    </motion.div>
  );
};

export default SongCard;