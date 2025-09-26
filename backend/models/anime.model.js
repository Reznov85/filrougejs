import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
    titreOriginal: {
      type: String,
      required: true
    },
    titreFr: {
      type: String,
      required: true
    },
    auteur: {
      type: String
    },
    synopsis: {
      type: String,
      required: true
    },
    nbSaison: {
      type: Number
    },
    nbEpisode: {
      type: Number
    },
    ratingAvg: { type: Number, default: 0 },
    
    ratingCount: { type: Number, default: 0 },
    
    image: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      nullable: true
    }],
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode'
    }],
    utilisateurs: [{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur'
    }],
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    studios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }],
    commentaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commentaire'
    }]
}, { timestamps: true });

export default mongoose.model('Anime', animeSchema);
