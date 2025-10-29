import React from 'react'; // <-- THIS IS THE FIX
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Album from './pages/Album';
import Playlists from './pages/Playlists';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Routes with Navbar and MusicPlayer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="album/:id" element={<Album />} />
        {/* Protected Routes */}
        <Route
          path="playlists"
          element={
            <PrivateRoute>
              <Playlists />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Standalone Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;