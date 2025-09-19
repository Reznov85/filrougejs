
import { Router } from "express";
import { createAnime, getAllAnimes, getAnimeById, updateAnime, deleteAnime, addImages, removeImages } from "../controllers/anime.controller.js"
import {  } from "../middlewares/auth.js"

const AnimeRoute = Router();

AnimeRoute.post('/new',createAnime)
AnimeRoute.get('/all', getAllAnimes)
AnimeRoute.put('/add/:id', addImages)
AnimeRoute.get('/:id', getAnimeById)
AnimeRoute.put('/:id',  updateAnime)
AnimeRoute.delete('/:id',  deleteAnime)
AnimeRoute.put('/add-images/:id', addImages)
AnimeRoute.put('/remove-images/:id', removeImages)

export default AnimeRoute