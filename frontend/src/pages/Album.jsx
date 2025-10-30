import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { musicApi } from '../api/axios';
import { Loader2, Music, Play } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';

const Album = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        // This backend route now fetches from Spotify
        const { data } = await musicApi.get(`/album/${id}`);
        setAlbum(data);
      } catch (err) {
        setError('Failed to load album.');
        console.error('Album Fetch Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  // Helper to play a specific track from the album list
const handlePlaySong = (track) => {
    // playSong(track, album.tracks.items); // <-- OLD
    playSong(track.uri); // <-- NEW: Pass the track's Spotify URI
  };

  // Helper to get image URL from Spotify album object
  const getImageUrl = (album) => {
    return album?.images?.[0]?.url || '';
  };
  
  // Helper to get artist names from Spotify album object
  const getArtists = (album) => {
    return album?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist';
  };

  // Helper to format track duration
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
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

  if (!album) return null;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Album Cover */}
        <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
          <img
            src={getImageUrl(album)}
            alt={album.name}
            className="w-full rounded-lg shadow-xl aspect-square"
          />
        </div>

        {/* Album Details */}
        <div className="flex-1">
          <h1
            className="text-4xl font-bold"
            dangerouslySetInnerHTML={{ __html: album.name }}
          />
          <p
            className="mt-2 text-xl text-neutral-600 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: getArtists(album) }}
          />
          <p className="mt-1 text-sm text-neutral-500">
            {album.release_date.substring(0, 4)} • {album.total_tracks} songs
          </p>
          <button
            // Play the first track of the album
            onClick={() => handlePlaySong(album.tracks.items[0])}
            className="flex items-center gap-2 px-6 py-3 mt-6 font-bold text-white transition-transform rounded-full bg-primary hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white" />
            Play
          </button>

          {/* Song List */}
          <div className="mt-8 space-y-2">
            {album.tracks.items.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handlePlaySong(track)}
                className="flex items-center p-3 transition-all rounded-lg cursor-pointer group hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="flex items-center justify-center w-8 text-neutral-500">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Music className="hidden w-5 h-5 group-hover:block" />
                </div>
                <div className="flex-1 ml-4">
                  <p
                    className="font-medium truncate"
                    dangerouslySetInnerHTML={{ __html: track.name }}
                  />
                  <p
                    className="text-sm truncate text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{
                      __html: track.artists.map((a) => a.name).join(', '),
                    }}
                  />
                </div>
                <div className="text-sm text-neutral-500">
                  {formatTime(track.duration_ms)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;