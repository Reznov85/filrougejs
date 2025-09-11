
import { Router } from "express";
import { createCommentaire, getAllCommentaires, getCommentaireById, updateCommentaire, deleteCommentaire } from "../controllers/commentaire.controller.js"

const commentaireRoute = Router()

commentaireRoute.post('/new', createCommentaire)
commentaireRoute.get('/all', getAllCommentaires)
commentaireRoute.get('/:id', getCommentaireById)
commentaireRoute.put('/:id', updateCommentaire)
commentaireRoute.delete('/:id', deleteCommentaire)

export default commentaireRoute