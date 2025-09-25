
import { Router } from "express";
import { createCommentaire, getAllCommentaires,  updateCommentaire, deleteCommentaire, getCommentsByAnime } from "../controllers/commentaire.controller.js"
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const commentaireRoute = Router()

commentaireRoute.post('/new', auth, createCommentaire)
commentaireRoute.get('/all', auth, getAllCommentaires)
commentaireRoute.get("/:animeId", getCommentsByAnime)
commentaireRoute.put('/:id',auth, adminAuth, updateCommentaire)
commentaireRoute.delete('/:id',auth,  adminAuth, deleteCommentaire)

export default commentaireRoute