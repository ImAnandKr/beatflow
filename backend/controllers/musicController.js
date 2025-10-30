// C:\beatflow\backend\controllers\musicController.js

import asyncHandler from 'express-async-handler';
import SpotifyWebApi from 'spotify-web-api-node';

// --- Spotify API Setup ---
// --- Spotify API Setup ---
// Ensure dotenv has loaded before this module is fully evaluated
import dotenv from 'dotenv';
dotenv.config(); // Call it here too, just to be absolutely sure

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, // Read the value again here
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Read the value again here
  redirectUri: process.env.SPOTIFY_REDIRECT_URI, // Read the value again here
});

// Add a check immediately after creation
if (!spotifyApi.getClientId()) {
    console.error("FATAL: Spotify Client ID not set in spotifyApi object!");
}
if (!spotifyApi.getClientSecret()) {
    console.error("FATAL: Spotify Client Secret not set in spotifyApi object!");
}
// --- End of Spotify API Setup ---
// Function to get/refresh the access token using Client Credentials Flow
const refreshSpotifyToken = async () => {
  try {
    // --- ADD THESE LINES ---
    console.log("Attempting Spotify token refresh with:");
    console.log("Client ID:", spotifyApi.getClientId());
    console.log("Client Secret Set:", spotifyApi.getClientSecret() ? 'Yes' : 'No'); // Don't log the actual secret
    // --- END OF ADDED LINES ---
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('Spotify access token refreshed!');
    spotifyApi.setAccessToken(data.body['access_token']);

    // Refresh token before it expires (e.g., halfway through expiry time)
    const expiresIn = data.body['expires_in']; // Time in seconds
    // Schedule the next refresh slightly before the token expires (e.g., after 90% of its lifetime)
    setTimeout(refreshSpotifyToken, (expiresIn * 1000 * 0.9));
  } catch (err) {
    console.error(
      'Could not refresh Spotify access token:',
      err.message || err.body?.error_description || err
    );
    // Retry after a delay if fetching fails
    setTimeout(refreshSpotifyToken, 60 * 1000); // Retry after 1 minute on failure
  }
};

// Get initial token when server starts
refreshSpotifyToken();

// Middleware to check if token is valid (optional but good practice)
// You can apply this middleware to routes if needed
const ensureSpotifyToken = asyncHandler(async (req, res, next) => {
  if (!spotifyApi.getAccessToken()) {
    console.log('No Spotify token found, attempting to refresh...');
    await refreshSpotifyToken(); // Wait for refresh
    if (!spotifyApi.getAccessToken()) {
      // If still no token after refresh attempt, return an error
      return res.status(503).json({ message: 'Spotify API unavailable - failed to get token' });
    }
  }
  next();
});

// --- Spotify API Endpoints ---

// @desc    Get homepage data (New Releases)
// @route   GET /api/music/home
// @access  Public
const getHomePageData = asyncHandler(async (req, res) => {
  try {
    await ensureSpotifyToken(req, res, () => {}); // Ensure token is valid

    // Get Spotify's New Releases for India (IN)
    const data = await spotifyApi.getNewReleases({ limit: 20, country: 'IN' });

    // Send back the array of albums
    res.json(data.body.albums.items);
  } catch (error) {
    console.error('Error in getHomePageData (Spotify - New Releases):', error.body || error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error fetching homepage data from Spotify' });
    }
  }
});
// @desc    Search for songs (tracks) in India market
// @route   GET /api/music/search?query=
// @access  Public
const searchSongs = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }
  try {
     await ensureSpotifyToken(req, res, () => {});

    // Search tracks, prioritizing results available in India (IN)
    const data = await spotifyApi.searchTracks(query, { limit: 20, market: 'IN' });
    res.json(data.body.tracks.items); // Send back the array of tracks
  } catch (error) {
    console.error('Error in searchSongs (Spotify):', error.body || error.message);
    if (!res.headersSent) {
        res.status(500).json({ message: 'Error searching songs on Spotify' });
    }
  }
});

// @desc    Get song (track) details for India market
// @route   GET /api/music/song/:id
// @access  Public
const getSongDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await ensureSpotifyToken(req, res, () => {});

    // Get specific track details, checking availability in India (IN)
    const data = await spotifyApi.getTrack(id, { market: 'IN' });
    res.json(data.body); // Send back the full track object
  } catch (error) {
    console.error('Error in getSongDetails (Spotify):', error.body || error.message);
    if (!res.headersSent) {
        // Handle specific 'Not Found' error from Spotify
        if (error.statusCode === 404 || error.body?.error?.status === 404) {
          return res.status(404).json({ message: 'Song not found on Spotify' });
        }
        res.status(500).json({ message: 'Error fetching song details from Spotify' });
    }
  }
});

// @desc    Get album details for India market
// @route   GET /api/music/album/:id
// @access  Public
const getAlbumDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
     await ensureSpotifyToken(req, res, () => {});

    // Get specific album details, checking track availability in India (IN)
    const data = await spotifyApi.getAlbum(id, { market: 'IN' });
    res.json(data.body); // Send back the full album object
  } catch (error) {
    console.error('Error in getAlbumDetails (Spotify):', error.body || error.message);
     if (!res.headersSent) {
        if (error.statusCode === 404 || error.body?.error?.status === 404) {
          return res.status(404).json({ message: 'Album not found on Spotify' });
        }
        res.status(500).json({ message: 'Error fetching album details from Spotify' });
    }
  }
});

// @desc    Get playlist details for India market
// @route   GET /api/music/playlist/:id
// @access  Public
const getPlaylistDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await ensureSpotifyToken(req, res, () => {});

    // Get specific playlist details, checking track availability in India (IN)
    const data = await spotifyApi.getPlaylist(id, { market: 'IN' });
    res.json(data.body); // Send back the full playlist object
  } catch (error) {
    console.error('Error in getPlaylistDetails (Spotify):', error.body || error.message);
    if (!res.headersSent) {
       if (error.statusCode === 404 || error.body?.error?.status === 404) {
        return res.status(404).json({ message: 'Playlist not found on Spotify' });
      }
      res.status(500).json({ message: 'Error fetching playlist details from Spotify' });
    }
  }
});

export {
  getHomePageData,
  searchSongs,
  getSongDetails,
  getAlbumDetails,
  getPlaylistDetails,
  // ensureSpotifyToken // Only export if you plan to use it per-route
};