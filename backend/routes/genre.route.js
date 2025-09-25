
import { Router } from "express";
import { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } from "../controllers/genre.controller.js"
import adminAuth from "../middlewares/adminAuth.js";
import auth from "../middlewares/auth.js";

const genreRoute= Router()

genreRoute.post('/new', auth, adminAuth, createGenre)
genreRoute.get('/all', auth, adminAuth, getAllGenres)
genreRoute.get('/:id', auth, adminAuth, getGenreById)
genreRoute.put('/:id', auth, adminAuth, updateGenre)
genreRoute.delete('/:id', auth, adminAuth, deleteGenre)

export default genreRoute