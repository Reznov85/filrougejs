// routes/note.route.js
import { Router } from "express";
import auth from "../middlewares/auth.js";
import { setMyRating, getAnimeRating, deleteMyRating, getTopRated } from "../controllers/note.controller.js";

const noteRoute = Router();

// Récup moyenne + ma note (si connecté)
noteRoute.get("/:animeId", auth.optional ?? ((req,res,next)=>next()), getAnimeRating); 
// si tu n’as pas d’auth.optional, fais deux routes : publique + privée

// Créer/mettre à jour ma note
noteRoute.post("/:animeId", auth, setMyRating);

// Supprimer ma note
noteRoute.delete("/:animeId", auth, deleteMyRating);

// Top notés
noteRoute.get("/_public/top", getTopRated);

export default noteRoute;
