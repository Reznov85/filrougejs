import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema({
    nom: {
      type: String,
      required: true
    },
    siteWeb: {
      type: String,
      required: true
    },
    pays: {
      type: String,
      required: true
    }
}, { timestamps: true });

export default mongoose.model('Studio', studioSchema);
