import Note from "../models/note.model.js";
import { recomputeAnimeRating } from "../services/rating.service.js";

// POST /rating/:animeId  body: { value: 1..5 }
// upsert : crée ou met à jour la note de l’utilisateur
export async function setMyRating(req, res) {
  try {
    const userId = req.user.id; // ton middleware auth met l’id ici
    const { animeId } = req.params;
    const { value } = req.body;

    if (![1,2,3,4,5].includes(Number(value))) {
      return res.status(400).json({ message: "La note doit être un entier entre 1 et 5." });
    }

    await Note.findOneAndUpdate(
      { user: userId, anime: animeId },
      { $set: { value } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const { avg, count } = await recomputeAnimeRating(animeId);
    return res.json({ ok: true, avg, count, my: value });
  } catch (e) {
    // en cas de violation d’unicité, on retente en update
    return res.status(500).json({ message: e.message });
  }
}

// GET /rating/:animeId -> moyenne, count, ma note
export async function getAnimeRating(req, res) {
  try {
    const userId = req.user?.id; // optionnel : si non connecté, pas de "my"
    const { animeId } = req.params;

    // Récup rapide depuis Anime (cache)
    // Si tu n’as pas ajouté ratingAvg/ratingCount au modèle Anime, fais une agrégation ici.
    const doc = await (await import("../models/anime.model.js")).default.findById(animeId).select("ratingAvg ratingCount").lean();
    if (!doc) return res.status(404).json({ message: "Anime introuvable" });

    let my = null;
    if (userId) {
      const r = await Note.findOne({ user: userId, anime: animeId }).select("value").lean();
      my = r?.value ?? null;
    }
    return res.json({ avg: doc.ratingAvg, count: doc.ratingCount, my });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

// DELETE /rating/:animeId -> supprime MA note
export async function deleteMyRating(req, res) {
  try {
    const userId = req.user.id;
    const { animeId } = req.params;

    await Note.findOneAndDelete({ user: userId, anime: animeId });
    const { avg, count } = await recomputeAnimeRating(animeId);

    return res.json({ ok: true, avg, count, my: null });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}


export async function getTopRated(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const minCount = Math.max(Number(req.query.minCount) || 0, 0);

    const data = await (await import("../models/anime.model.js")).default
      .find({ ratingCount: { $gte: minCount } })
      .select("titreFr titreOriginal image ratingAvg ratingCount")
      .sort({ ratingAvg: -1, ratingCount: -1, _id: 1 })
      .limit(limit)
      .populate("image", "nom") // si image = refs -> récupère nom des fichiers
      .lean();

    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

