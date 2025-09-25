
import { Router } from "express";
import { createEpisode, getAllEpisodes, getEpisodeById, updateEpisode, deleteEpisode } from "../controllers/episode.controller.js"
import adminAuth from "../middlewares/adminAuth.js";

const episodeRoute = Router()

episodeRoute.post('/new', adminAuth, createEpisode)
episodeRoute.get('/all', adminAuth, getAllEpisodes)
episodeRoute.get('/:id', adminAuth, getEpisodeById)
episodeRoute.put('/:id', adminAuth, updateEpisode)
episodeRoute.delete('/:id', adminAuth, deleteEpisode)

export default episodeRoute