import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';

// --- Favorites ---

// @desc    Get user's favorite songs
// @route   GET /api/user/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user.favorites);
});

// @desc    Add a song to favorites
// @route   POST /api/user/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const song = req.body.song; // song is the full song object

  if (!song || !song.id) {
    res.status(400);
    throw new Error('Song data is required');
  }

  // Check if already favorited
  const isFavorited = user.favorites.find((s) => s.id === song.id);
  if (isFavorited) {
    res.status(400);
    throw new Error('Song already in favorites');
  }

  user.favorites.push(song);
  await user.save();
  res.status(201).json(user.favorites);
});

// @desc    Remove a song from favorites
// @route   DELETE /api/user/favorites/:id
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const songId = req.params.id;

  user.favorites = user.favorites.filter((s) => s.id !== songId);
  await user.save();
  res.status(200).json(user.favorites);
});

// --- Playlists ---

// @desc    Get user's playlists
// @route   GET /api/user/playlists
// @access  Private
const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ user: req.user.id });
  res.status(200).json(playlists);
});

// @desc    Create a new playlist
// @route   POST /api/user/playlists
// @access  Private
const createPlaylist = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Playlist name is required');
  }

  const playlist = new Playlist({
    name,
    user: req.user.id,
    songs: [],
  });

  const createdPlaylist = await playlist.save();

  // Also add to user's playlist references
  const user = await User.findById(req.user.id);
  user.playlists.push(createdPlaylist._id);
  await user.save();

  res.status(201).json(createdPlaylist);
});

// @desc    Get a single playlist by ID
// @route   GET /api/user/playlists/:id
// @access  Private
const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    res.status(404);
    throw new Error('Playlist not found');
  }

  // Ensure it belongs to the user
  if (playlist.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(playlist);
});

// @desc    Add a song to a playlist
// @route   POST /api/user/playlists/:id/add
// @access  Private
const addSongToPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  const song = req.body.song;

  if (!playlist) {
    res.status(404);
    throw new Error('Playlist not found');
  }
  if (playlist.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Check if song already in playlist
  const songExists = playlist.songs.find((s) => s.id === song.id);
  if (songExists) {
    res.status(400);
    throw new Error('Song already in this playlist');
  }

  playlist.songs.push(song);
  await playlist.save();
  res.status(200).json(playlist);
});

// @desc    Delete a playlist
// @route   DELETE /api/user/playlists/:id
// @access  Private
const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    res.status(404);
    throw new Error('Playlist not found');
  }
  if (playlist.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await playlist.deleteOne();

  // Remove from user's list
  const user = await User.findById(req.user.id);
  user.playlists = user.playlists.filter(
    (p) => p.toString() !== req.params.id
  );
  await user.save();

  res.status(200).json({ id: req.params.id, message: 'Playlist removed' });
});

export {
  getFavorites,
  addFavorite,
  removeFavorite,
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  addSongToPlaylist,
  deletePlaylist,
};