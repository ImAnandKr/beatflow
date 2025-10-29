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
    songs: [
      {
        // Store song objects directly
        id: String,
        name: String,
        image: Array,
        downloadUrl: Array,
        artists: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;