import React, { useState } from 'react';
import { Play, PlusCircle, Heart } from 'lucide-react'; // Import Heart
import usePlayer from '../hooks/usePlayer';
import useAuth from '../hooks/useAuth'; 
import { motion } from 'framer-motion';
import AddToPlaylistModal from './AddToPlaylistModal';

const SongCard = ({ track, playlist }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { user, addFavorite, removeFavorite, isFavorite } = useAuth(); // Get new auth functions
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if this track is favorited *from the context*
  const favorited = isFavorite(track.id);

  const getImageUrl = (track) => {
    return track?.album?.images?.[0]?.url || '';
  };

  const getArtists = (track) => {
    return track?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist';
  };

  const imageUrl = getImageUrl(track);
  const artists = getArtists(track);
  const isCurrentlyPlaying = currentSong?.id === track.id && isPlaying;

  const handlePlay = () => {
    // playSong(track, playlist); // <-- OLD
    playSong(track.uri); // <-- NEW: Pass the track's Spotify URI
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add songs to a playlist.');
      return;
    }
    setIsModalOpen(true);
  };

  // --- New Favorite Handler ---
  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Stop click from playing song
     if (!user) {
      alert('Please log in to like songs.');
      return;
    }
    if (favorited) {
      removeFavorite(track.id);
    } else {
      addFavorite(track); // Pass the full track object
    }
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.03 }}
        className="relative p-4 overflow-hidden transition-all duration-300 rounded-lg shadow-md group bg-neutral-50 dark:bg-neutral-800"
      >
        <div className="relative cursor-pointer" onClick={handlePlay}>
          <img
            src={imageUrl}
            alt={track.name}
            className="object-cover w-full rounded-lg aspect-square"
          />
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
        
        <div className="flex items-start justify-between pt-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold truncate cursor-pointer"
              onClick={handlePlay}
              dangerouslySetInnerHTML={{ __html: track.name }}
            />
            <p
              className="text-sm truncate text-neutral-600 dark:text-neutral-400"
              dangerouslySetInnerHTML={{ __html: artists }}
            />
          </div>
          
          {/* Action buttons wrapper */}
          <div className="flex items-center ml-2">
            {/* Add to Playlist Button */}
            {user && (
              <button
                onClick={handleOpenModal}
                title="Add to playlist"
                className="p-1 transition-colors rounded-full text-neutral-500 hover:text-primary dark:hover:text-primary-light"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}

            {/* Favorite (Like) Button */}
            {user && (
              <button
                onClick={handleToggleFavorite}
                title={favorited ? "Remove from favorites" : "Add to favorites"}
                className={`p-1 transition-colors rounded-full ${
                  favorited
                    ? 'text-red-500' // Liked state
                    : 'text-neutral-500 hover:text-red-500' // Default state
                }`}
              >
                {/* Show filled heart if favorited, outline if not */}
                <Heart className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AddToPlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={track}
      />
    </>
  );
};

export default SongCard;