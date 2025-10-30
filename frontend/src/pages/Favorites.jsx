// C:\beatflow\frontend\src\pages\Favorites.jsx

import React from 'react';
import useAuth from '../hooks/useAuth';
import SongCard from '../components/SongCard';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const favoriteTracks = user?.favorites || [];

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
          <Heart className="w-10 h-10 text-white" fill="white" />
        </div>
        <h1 className="text-4xl font-bold">Liked Songs</h1>
      </div>

      {favoriteTracks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {favoriteTracks.map((track) => (
            <SongCard 
              key={track.id} 
              track={track} 
              playlist={favoriteTracks} // Pass the favorites list as the playlist context
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
          <Heart className="w-16 h-16 mb-4" />
          <p className="text-xl">You haven't liked any songs yet.</p>
          <p>Click the heart icon on a song to save it here.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;