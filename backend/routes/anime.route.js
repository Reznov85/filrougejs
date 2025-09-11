
import { Router } from "express";
import { createAnime, getAllAnimes, getAnimeById, updateAnime, deleteAnime } from "../controllers/anime.controller.js"
import { adminOnly } from "../middlewares/auth.js";

const AnimeRoute = Router();

AnimeRoute.post('/new', adminOnly, createAnime)
AnimeRoute.get('/all', getAllAnimes)
AnimeRoute.get('/:id', getAnimeById)
AnimeRoute.put('/:id', adminOnly, updateAnime)
AnimeRoute.delete('/:id', adminOnly, deleteAnime)

export default AnimeRoute