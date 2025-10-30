import mongoose from 'mongoose';

const playlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    
    // --- THIS IS THE FIX ---
    // Change 'songs' to store the full Spotify track object
    songs: [mongoose.Schema.Types.Mixed],
    // -----------------------
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;