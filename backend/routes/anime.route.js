
import { Router } from "express";
import { createAnime, getAllAnimes, getAnimeById, updateAnime, deleteAnime, addImages, removeImages, getLastAnimes, getBestAnimes,  } from "../controllers/anime.controller.js"
import adminAuth from "../middlewares/adminAuth.js";
import auth from "../middlewares/auth.js";

const AnimeRoute = Router();

AnimeRoute.post('/new', auth, adminAuth,createAnime)
AnimeRoute.get('/all', getAllAnimes)
AnimeRoute.put('/add/:id',auth, adminAuth, addImages)
AnimeRoute.get('/:id', getAnimeById)
AnimeRoute.put('/update/:id',auth, adminAuth, updateAnime)
AnimeRoute.delete('/delete/:id',auth, adminAuth, deleteAnime)
AnimeRoute.put('/add-images/:id',auth, adminAuth, addImages)
AnimeRoute.put('/remove-images/:id',auth, adminAuth, removeImages)
AnimeRoute.get('/last/list', getLastAnimes)
AnimeRoute.get('/top/list', getBestAnimes)

export default AnimeRoute