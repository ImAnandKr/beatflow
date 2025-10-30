// C:\beatflow\frontend\src\components\AddToPlaylistModal.jsx

import React, { useState, useEffect } from 'react';
import { userApi } from '../api/axios';
import { Loader2, X } from 'lucide-react';

const AddToPlaylistModal = ({ track, isOpen, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch playlists only when the modal is opened
    if (isOpen) {
      const fetchPlaylists = async () => {
        try {
          setLoading(true);
          setError(null);
          const { data } = await userApi.get('/playlists');
          setPlaylists(data);
        } catch (err) {
          setError('Failed to load your playlists.');
          console.error('Fetch Playlists Error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylists();
    }
  }, [isOpen]); // Re-run when isOpen changes

  const handleAddSong = async (playlistId) => {
    try {
      // The backend expects the track object inside a 'song' property
      await userApi.post(`/playlists/${playlistId}/add`, { song: track });
      alert(`Song added to playlist!`);
      onClose(); // Close the modal on success
    } catch (err) {
      console.error('Add to Playlist Error:', err);
      alert(err.response?.data?.message || 'Failed to add song. Maybe it is already in this playlist?');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Modal Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose} // Close when clicking overlay
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-xl dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click when clicking content
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute p-2 transition-colors rounded-full top-3 right-3 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-4 text-xl font-semibold">Add to Playlist</h2>
        <p className="mb-4 text-sm truncate text-neutral-600 dark:text-neutral-400">
          Add <span className="font-medium text-neutral-800 dark:text-neutral-200">{track.name}</span> to:
        </p>

        {/* Playlist List */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && playlists.length > 0 && (
            playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => handleAddSong(playlist._id)}
                className="p-3 font-medium transition-colors rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {playlist.name} ({playlist.songs.length} songs)
              </div>
            ))
          )}

          {!loading && !error && playlists.length === 0 && (
            <p className="py-4 text-center text-neutral-500">
              You haven't created any playlists yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;