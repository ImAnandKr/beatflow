import express from 'express';
const router = express.Router();
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  addSongToPlaylist,
  deletePlaylist,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// All these routes are protected
router.use(protect);

// Favorite Routes
router.route('/favorites').get(getFavorites).post(addFavorite);
router.route('/favorites/:id').delete(removeFavorite);

// Playlist Routes
router.route('/playlists').get(getPlaylists).post(createPlaylist);
router
  .route('/playlists/:id')
  .get(getPlaylistById)
  .delete(deletePlaylist);
router.route('/playlists/:id/add').post(addSongToPlaylist);

export default router;