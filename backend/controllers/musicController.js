// C:\beatflow\backend\controllers\musicController.js

import asyncHandler from 'express-async-handler';
import axios from 'axios';

const SAAVN_BASE_URL = 'https://saavn.napsterify.in/api';

// @desc    Get homepage data (e.g., trending playlists)
// @route   GET /api/music/home
// @access  Public
const getHomePageData = asyncHandler(async (req, res) => {
  try {
    const playlistId = '114401205'; // ID for "Today's Top Hindi"
    const { data } = await axios.get(
      `${SAAVN_BASE_URL}/playlists?id=${playlistId}`
    );

    if (data.success) {
      res.json(data.data);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error in getHomePageData:', error); // <-- THIS IS THE FIX
    res
      .status(500)
      .json({ message: 'Error fetching homepage data', error: error.message });
  }
});

// @desc    Search for songs
// @route   GET /api/music/search?query=
// @access  Public
const searchSongs = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const { data } = await axios.get(
      `${SAAVN_BASE_URL}/search/songs?query=${encodeURIComponent(query)}`
    );
    if (data.success) {
      res.json(data.data.results);
    } else {
      res.status(404).json({ message: 'No results found' });
    }
  } catch (error) {
    console.error('Error in searchSongs:', error); // <-- THIS IS THE FIX
    res
      .status(500)
      .json({ message: 'Error searching songs', error: error.message });
  }
});

// @desc    Get song details
// @route   GET /api/music/song/:id
// @access  Public
const getSongDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(`${SAAVN_BASE_URL}/songs?id=${id}`);
    if (data.success && data.data.length > 0) {
      res.json(data.data[0]);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error in getSongDetails:', error); // <-- THIS IS THE FIX
    res
      .status(500)
      .json({ message: 'Error fetching song details', error: error.message });
  }
});

// @desc    Get album details
// @route   GET /api/music/album/:id
// @access  Public
const getAlbumDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(`${SAAVN_BASE_URL}/albums?id=${id}`);
    if (data.success) {
      res.json(data.data);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    console.error('Error in getAlbumDetails:', error); // <-- THIS IS THE FIX
    res
      .status(500)
      .json({ message: 'Error fetching album details', error: error.message });
  }
});

// @desc    Get playlist details
// @route   GET /api/music/playlist/:id
// @access  Public
const getPlaylistDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(`${SAAVN_BASE_URL}/playlists?id=${id}`);
    if (data.success) {
      res.json(data.data);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error in getPlaylistDetails:', error); // <-- THIS IS THE FIX
    res.status(500).json({
      message: 'Error fetching playlist details',
      error: error.message,
    });
  }
});

export {
  getHomePageData,
  searchSongs,
  getSongDetails,
  getAlbumDetails,
  getPlaylistDetails,
};