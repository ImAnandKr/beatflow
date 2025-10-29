import React, { useState, useEffect } from 'react'; // <-- FIX
import { useSearchParams } from 'react-router-dom';
import { musicApi } from '../api/axios';
import SongCard from '../components/SongCard';
import { Loader2, SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
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
        const { data } = await musicApi.get(`/search?query=${query}`);
        setResults(data || []);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
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
          {results.map((song) => (
            <SongCard key={song.id} song={song} playlist={results} />
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