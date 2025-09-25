import { Router } from "express";
import { createImage, getAllImages, getImageById, updateImage, deleteImage }
from "../controllers/file.controller.js"
import { upload } from "../middlewares/upload.js"
import adminAuth from "../middlewares/adminAuth.js";
import auth from "../middlewares/auth.js";

const imageRoute = Router()
imageRoute.post('/new', auth, adminAuth, upload.single('nom'), createImage)
imageRoute.get('/all', auth, adminAuth, getAllImages)
imageRoute.get('/:id', auth, adminAuth, getImageById)
imageRoute.put('/:id', auth, adminAuth, updateImage)
imageRoute.delete('/:id',auth, adminAuth, deleteImage)
export default imageRoute