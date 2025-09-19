
import { Router } from "express";
import { register, login, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur } from "../controllers/utilisateur.controller.js"
import  adminAuth  from "../middlewares/adminAuth.js"
import auth from "../middlewares/auth.js";


const utilisateurRoutes = Router()

utilisateurRoutes.post('/register', register)
utilisateurRoutes.post('/login', login)
utilisateurRoutes.get('/all', auth, adminAuth, getAllUtilisateurs)
utilisateurRoutes.get('/:id', adminAuth, getUtilisateurById)
utilisateurRoutes.put('/:id', adminAuth, updateUtilisateur)
utilisateurRoutes.delete('/:id', adminAuth, deleteUtilisateur)


export default utilisateurRoutes