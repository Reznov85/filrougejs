import Note from "../models/note.model.js";
import Anime from "../models/anime.model.js";

export async function recomputeAnimeRating(animeId) {
  const agg = await Note.aggregate([
    { $match: { anime: new (await import("mongoose")).default.Types.ObjectId(animeId) } },
    { $group: { _id: "$anime", avg: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = agg[0] || {};
  await Anime.findByIdAndUpdate(animeId, { ratingAvg: avg, ratingCount: count }, { new: true });
  return { avg, count };
}