
import { Router } from "express";
import { createStudio, getAllStudios, getStudioById, updateStudio, deleteStudio } from "../controllers/studio.controller.js"
import adminAuth from "../middlewares/adminAuth.js";
import auth from "../middlewares/auth.js";

const studioRoute= Router()

studioRoute.post('/new', auth, adminAuth, createStudio)
studioRoute.get('/all', auth, adminAuth, getAllStudios)
studioRoute.get('/:id', auth, adminAuth, getStudioById)
studioRoute.put('/:id', auth, adminAuth, updateStudio)
studioRoute.delete('/:id', auth, adminAuth, deleteStudio)

export default studioRoute