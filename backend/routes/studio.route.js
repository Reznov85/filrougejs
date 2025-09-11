
import { Router } from "express";
import { createStudio, getAllStudios, getStudioById, updateStudio, deleteStudio } from "../controllers/studio.controller.js"

const studioRoute= Router()

studioRoute.post('/new', createStudio)
studioRoute.get('/all', getAllStudios)
studioRoute.get('/:id', getStudioById)
studioRoute.put('/:id', updateStudio)
studioRoute.delete('/:id', deleteStudio)

export default studioRoute