import express from 'express';
const router = express.Router();
import {
  getHomePageData,
  searchSongs,
  getSongDetails,
  getAlbumDetails,
  getPlaylistDetails,
} from '../controllers/musicController.js';

router.get('/home', getHomePageData);
router.get('/search', searchSongs);
router.get('/song/:id', getSongDetails);
router.get('/album/:id', getAlbumDetails);
router.get('/playlist/:id', getPlaylistDetails);

export default router;