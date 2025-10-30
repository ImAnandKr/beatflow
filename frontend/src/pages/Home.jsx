import React, { useState, useEffect } from 'react';
import { musicApi } from '../api/axios';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await musicApi.get('/home');
        setNewReleases(data || []);
      } catch (err) {
        setError('Failed to load new releases. Please try again later.');
        console.error('Home Fetch Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  // Helper function to get artist names for albums
  const getAlbumArtists = (album) => {
     return album?.artists?.map((artist) => artist.name).join(', ') || 'Various Artists';
  };


  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">New Releases</h1>

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
          {newReleases.map((album) => (
            <Link key={album.id} to={`/album/${album.id}`} className="block">
              <div
                className="relative p-4 overflow-hidden transition-all duration-300 rounded-lg shadow-md cursor-pointer group bg-neutral-50 dark:bg-neutral-800 hover:shadow-lg"
              >
                <img
                  src={album.images?.[0]?.url}
                  alt={album.name}
                  className="object-cover w-full rounded-lg aspect-square"
                />
                <div className="mt-3">
                  <h3
                    className='font-semibold truncate'
                    dangerouslySetInnerHTML={{ __html: album.name }}
                  />
                  {/* Corrected line below */}
                  <p
                    className="text-sm truncate text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: getAlbumArtists(album) }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;