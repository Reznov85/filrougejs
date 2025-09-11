import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
    numero: {
      type: Number,
      required: true
    },
    saison: {
      type: Number,
      required: true
    },
    titre: {
      type: String,
      required: true
    },
    synopsis: {
      type: String,
      required: true
    },
    duree: {
      type: Number,
      required: true
    },
    anime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime',
        required: true
    }



},
 { timestamps: true });

export default mongoose.model('Episode', episodeSchema);
