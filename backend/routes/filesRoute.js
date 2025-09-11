import { Router } from "express";
import { createImage, getAllImages, getImageById, updateImage, deleteImage }
from "../controllers/file.controller.js"
import { upload } from "../middlewares/upload.js"
const imageRoute = Router()
imageRoute.post('/new', upload.single('nom'), createImage)
imageRoute.get('/all', getAllImages)
imageRoute.get('/:id', getImageById)
imageRoute.put('/:id', updateImage)
imageRoute.delete('/:id', deleteImage)
export default imageRoute