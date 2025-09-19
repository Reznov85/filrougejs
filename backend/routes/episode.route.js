
import { Router } from "express";
import { createEpisode, getAllEpisodes, getEpisodeById, updateEpisode, deleteEpisode } from "../controllers/episode.controller.js"

const episodeRoute = Router()

episodeRoute.post('/new', createEpisode)
episodeRoute.get('/all', getAllEpisodes)
episodeRoute.get('/:id', getEpisodeById)
episodeRoute.put('/:id', updateEpisode)
episodeRoute.delete('/:id', deleteEpisode)

export default episodeRoute