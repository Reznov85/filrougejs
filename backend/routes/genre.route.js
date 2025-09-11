
import { Router } from "express";
import { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } from "../controllers/genre.controller.js"

const genreRoute= Router()

genreRoute.post('/new', createGenre)
genreRoute.get('/all', getAllGenres)
genreRoute.get('/:id', getGenreById)
genreRoute.put('/:id', updateGenre)
genreRoute.delete('/:id', deleteGenre)

export default genreRoute