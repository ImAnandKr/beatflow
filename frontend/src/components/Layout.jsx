import React from 'react'; // <-- THIS IS THE FIX
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';
import usePlayer from '../hooks/usePlayer';

const Layout = () => {
  const { currentSong } = usePlayer();

  return (
    <div className="flex flex-col min-h-screen text-neutral-800 dark:text-neutral-200">
      <Navbar />
      <main
        className={`flex-grow p-4 md:p-8 ${
          currentSong ? 'pb-24' : ''
        } transition-all duration-300`}
      >
        <Outlet />
      </main>
      {currentSong && <MusicPlayer />}
    </div>
  );
};

export default Layout;