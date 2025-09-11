import { text } from 'express';
import mongoose from 'mongoose';

const commentaireSchema = new mongoose.Schema({
    titre: {
      type: String,
      required: true
    },
    contenu: {
      type: String,
      required: true
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur'
    },
    anime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anime'
    },
}, { timestamps: true });

export default mongoose.model('Commentaire', commentaireSchema);
