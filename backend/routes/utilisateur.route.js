
import { Router } from "express";
import { register, login, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur, getMe, updateMyPassword, addImages, removeImages, updateMyAvatar } from "../controllers/utilisateur.controller.js"
import  adminAuth  from "../middlewares/adminAuth.js"
import auth from "../middlewares/auth.js";
import multer from "multer";

const upload = multer({ dest: "uploads/avatars" }); // à adapter à ta config

const utilisateurRoutes = Router()

utilisateurRoutes.post('/register', register)
utilisateurRoutes.post('/login', login)
utilisateurRoutes.get('/all', auth, adminAuth, getAllUtilisateurs)
utilisateurRoutes.get('/profil', auth, getMe)
utilisateurRoutes.get('/:id', auth, adminAuth, getUtilisateurById)
utilisateurRoutes.put('/:id', auth, updateUtilisateur)
utilisateurRoutes.put('/add-images/:id',auth, adminAuth, addImages)
utilisateurRoutes.put('/remove-images/:id',auth, adminAuth, removeImages)
utilisateurRoutes.delete('/:id', auth, adminAuth, deleteUtilisateur)
utilisateurRoutes.put('/changepassword', auth, updateMyPassword)
utilisateurRoutes.put('/profil/avatar', auth, upload.single("avatar"), updateMyAvatar)





export default utilisateurRoutes