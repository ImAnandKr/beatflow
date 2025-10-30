import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { musicApi } from '../api/axios';
import SongCard from '../components/SongCard'; // This component is now updated for Spotify tracks
import { Loader2, SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]); // Will hold Spotify tracks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const search = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Backend now searches Spotify and returns track items
        const { data } = await musicApi.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(data || []); // Expecting an array of Spotify track items
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error('Search Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>

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

      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {/* Map through results and pass each item as 'track' to SongCard */}
          {results.map((track) => (
            // Make sure track has a unique id
            track.id ? <SongCard key={track.id} track={track} playlist={results} /> : null
          ))}
        </div>
      )}

       {!loading && !error && results.length === 0 && query && (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
          <SearchIcon className="w-16 h-16 mb-4" />
          <p className="text-xl">No results found for "{query}".</p>
          <p>Try searching for a different song or artist.</p>
        </div>
      )}

      {!query && (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
          <SearchIcon className="w-16 h-16 mb-4" />
          <p className="text-xl">Search for your favorite songs.</p>
          <p>Use the search bar in the navigation to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Search;