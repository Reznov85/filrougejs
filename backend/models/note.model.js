import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true, index: true },
  anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true, index: true }, // adapte le champ si tu notes autre chose
  value: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Empêche les doublons (1 note par user/anime)
noteSchema.index({ user: 1, anime: 1 }, { unique: true });


export default mongoose.model("Note", noteSchema);