import React, { useState, useEffect } from 'react';
import { userApi } from '../api/axios';
import { Loader2, Plus, Music, Trash2 } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playSong } = usePlayer();

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const { data } = await userApi.get('/playlists');
      setPlaylists(data);
    } catch (err) {
      setError('Failed to fetch playlists.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const { data } = await userApi.post('/playlists', {
        name: newPlaylistName,
      });
      setPlaylists([...playlists, data]);
      setNewPlaylistName('');
    } catch (err) {
      alert('Failed to create playlist.');
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }
    try {
      await userApi.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete playlist.');
    }
  };

  // Helper to get image URL from Spotify track object
  const getImageUrl = (track) => {
    return track?.album?.images?.[0]?.url || '';
  };
  
  // Helper to get artist names from Spotify track object
  const getArtists = (track) => {
    return track?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist';
  };

  // --- THIS IS THE FIX ---
  const handlePlaySong = (track) => {
    // Pass just the track's Spotify URI
    playSong(track.uri);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Playlists</h1>

      {/* Create New Playlist Form */}
      <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name..."
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
          Create
        </button>
      </form>

      {/* Playlists */}
      <div className="space-y-8">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{playlist.name}</h2>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {playlist.songs.length > 0 ? (
                <div className="space-y-2">
                  {/* 'song' here is now a Spotify track object */}
                  {playlist.songs.map((track, index) => (
                    <div
                      key={track.id ? `${playlist._id}-${track.id}-${index}` : `${playlist._id}-${index}`} // Handle potential duplicate IDs
                      className="flex items-center p-3 transition-all rounded-lg cursor-pointer group hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      // --- THIS IS THE FIX ---
                      onClick={() => handlePlaySong(track)}
                    >
                      <img
                        src={getImageUrl(track)} // Use helper
                        alt={track.name}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex-1 ml-4">
                        <p
                          className="font-medium truncate"
                          dangerouslySetInnerHTML={{ __html: track.name }}
                        />
                        <p
                          className="text-sm truncate text-neutral-600 dark:text-neutral-400"
                          dangerouslySetInnerHTML={{
                            __html: getArtists(track), // Use helper
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">
                  This playlist is empty. Add songs from the search page!
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-xl text-center text-neutral-500">
            You haven't created any playlists yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Playlists;