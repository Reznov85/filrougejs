
import { Router } from "express";
import { register, login, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur } from "../controllers/utilisateur.controller.js"
import { adminOnly } from "../middlewares/auth.js";

const utilisateurRoutes = Router()

utilisateurRoutes.post('/register', register)
utilisateurRoutes.post('/login', login)
utilisateurRoutes.get('/all', adminOnly, getAllUtilisateurs)
utilisateurRoutes.get('/:id', adminOnly, getUtilisateurById)
utilisateurRoutes.put('/:id', adminOnly, updateUtilisateur)
utilisateurRoutes.delete('/:id', adminOnly, deleteUtilisateur)


export default utilisateurRoutes