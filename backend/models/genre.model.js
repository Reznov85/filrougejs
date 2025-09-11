import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
    nom: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
}, 
{ timestamps: true });

export default mongoose.model('Genre', genreSchema);
