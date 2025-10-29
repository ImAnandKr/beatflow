import React, { useState, useEffect } from 'react'; // <-- FIX
import { useParams } from 'react-router-dom';
import { musicApi } from '../api/axios';
import { Loader2, Music } from 'lucide-react';
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
        const { data } = await musicApi.get(`/album/${id}`);
        setAlbum(data);
      } catch (err) {
        setError('Failed to load album.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  const handlePlaySong = (song, index) => {
    // Create a playlist of all album songs starting from the one clicked
    const playlist = album.songs.slice(index);
    playSong(song, playlist);
  };

  const getImageUrl = (image) => {
    if (!image || !Array.isArray(image) || image.length === 0) return '';
    const bestImage =
      image.find((img) => img.quality === '500x500') ||
      image[image.length - 1];
    return bestImage.url.replace('http:', 'https:');
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
        <div className="flex-shrink-0 md:w-1/3">
          <img
            src={getImageUrl(album.image)}
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
            dangerouslySetInnerHTML={{
              __html: album.artists.primary.map((a) => a.name).join(', '),
            }}
          />
          <p className="mt-1 text-sm text-neutral-500">
            {album.year} • {album.songCount} songs
          </p>
          <button
            onClick={() => handlePlaySong(album.songs[0], 0)}
            className="px-6 py-3 mt-6 font-bold text-white transition-transform rounded-full bg-primary hover:scale-105"
          >
            Play All
          </button>

          {/* Song List */}
          <div className="mt-8 space-y-2">
            {album.songs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className="flex items-center p-3 transition-all rounded-lg cursor-pointer group hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="flex items-center justify-center w-8 text-neutral-500">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Music className="hidden w-5 h-5 group-hover:block" />
                </div>
                <div className="flex-1 ml-4">
                  <p
                    className="font-medium truncate"
                    dangerouslySetInnerHTML={{ __html: song.name }}
                  />
                  <p
                    className="text-sm truncate text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{
                      __html: song.artists.primary
                        .map((a) => a.name)
                        .join(', '),
                    }}
                  />
                </div>
                <div className="text-sm text-neutral-500">
                  {formatTime(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export default Album;