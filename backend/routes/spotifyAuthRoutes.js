// C:\beatflow\backend\routes\spotifyAuthRoutes.js

import express from 'express';
const router = express.Router();
import {
  spotifyLogin,
  spotifyCallback,
  refreshUserToken,
} from '../controllers/spotifyAuthController.js';

router.get('/login', spotifyLogin);
router.get('/callback', spotifyCallback);
router.post('/refresh', refreshUserToken);

export default router;