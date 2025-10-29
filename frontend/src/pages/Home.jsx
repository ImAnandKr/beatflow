import React, { useState, useEffect } from 'react'; // <-- FIX
import { musicApi } from '../api/axios';
import SongCard from '../components/SongCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState('Trending Now');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        // This fetches our hardcoded "Today's Top Hindi" playlist
        const { data } = await musicApi.get('/home');
        setTrendingSongs(data.songs || []);
        setPlaylistTitle(data.name || 'Trending Now');
      } catch (err) {
        setError('Failed to load trending songs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{playlistTitle}</h1>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} playlist={trendingSongs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;