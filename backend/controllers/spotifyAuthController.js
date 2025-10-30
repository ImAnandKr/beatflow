// C:\beatflow\backend\controllers\spotifyAuthController.js

import SpotifyWebApi from 'spotify-web-api-node';
import asyncHandler from 'express-async-handler';

// These scopes allow us to read playback state and control playback
const scopes = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// @desc    Login with Spotify
// @route   GET /api/spotify-auth/login
// @access  Public
const spotifyLogin = (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

// @desc    Callback from Spotify
// @route   GET /api/spotify-auth/callback
// @access  Public
const spotifyCallback = asyncHandler(async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state; // We can add state validation later if needed

  if (error) {
    console.error('Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=spotify_error`);
    return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];

    // Send tokens back to the frontend
    // A common way is via query params. In a real app, you'd use secure cookies.
    res.redirect(
      `${process.env.FRONTEND_URL}?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
    );
  } catch (err) {
    console.error('Error getting tokens:', err.body || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
  }
});

// @desc    Refresh user access token
// @route   POST /api/spotify-auth/refresh
// @access  Public
const refreshUserToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const spotifyApi_user = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    refreshToken: refreshToken,
  });

  try {
    const data = await spotifyApi_user.refreshAccessToken();
    res.json({
      access_token: data.body['access_token'],
      expires_in: data.body['expires_in'],
    });
  } catch (err) {
    console.error('Could not refresh access token:', err.body || err.message);
    res.status(400).json({ message: 'Could not refresh access token' });
  }
});

export { spotifyLogin, spotifyCallback, refreshUserToken };