
import { Router } from "express";
import { createEpisode, getAllEpisodes, getEpisodeById, updateEpisode, deleteEpisode } from "../controllers/episode.controller.js"

const router = Router()

router.post('/new', createEpisode)
router.get('/all', getAllEpisodes)
router.get('/:id', getEpisodeById)
router.put('/:id', updateEpisode)
router.delete('/:id', deleteEpisode)

export default router