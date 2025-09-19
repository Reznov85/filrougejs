import Image from "../models/image.model.js"
import imageValidation from "../validations/image.validation.js"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url";
import animeModel from "../models/anime.model.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createImage = async(req,res)=>{
try {
const {body} = req
if(!body){
return res.status(400).json({message: "Pas de données dans la requête"})
}
const {error} = imageValidation(body).imageCreate
if(error){
return res.status(401).json(error.details[0].message)
}
if(req.file){
// on fait en sorte que le nom du fichier soit enregistré sous la form "http://localhost:3000/uploads/image_1756211197484.jpg"
body.nom =`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
}
const image = new Image(body)
const newImage = await image.save()
return res.status(201).json(newImage)
} catch (error) {
console.log(error)
res.status(500).json({message: "Erreur serveur", error: error})
}}

const getAllImages = async(req, res) => {
    try {
const images = await Image.find()
return res.status(200).json(images)
} catch (error) {
console.log(error)
res.status(500).json({message: "Erreur serveur", error: error})
}}

const getImageById = async(req,res) => {
try {
const image = await Image.findById(req.params.id)
if(!image){
return res.status(404).json({message: "image n'existe pas"})
}
return res.status(200).json(image)
} catch (error) {
console.log(error)
res.status(500).json({message: "Erreur serveur", error: error})
}}

const updateImage = async(req,res) => {
try {
const {body} = req
if(!body){
return res.status(400).json({message: "Pas de données dans la requête"})
}
const {error} = imageValidation(body).imageUpdate
if(error){
return res.status(401).json(error.details[0].message)
}
const updatedImage = await Image.findByIdAndUpdate(req.params.id, body,
{new: true})
if(!updatedImage){
res.status(404).json({message: "image n'existe pas"})
}
return res.status(200).json(updatedImage)
} catch (error) {
console.log(error)
res.status(500).json({message: "Erreur serveur", error: error})
}}

const deleteImage = async(req, res) => {
try {
const jeux = await animeModel.find({ images: req.params.id})
if(jeux.length >0){
return res.status(400).json({message: `l'image est utilisée dans
les jeux${animes.map(anime => ' '+anime.titreFr)}`})
}
const image = await Image.findById(req.params.id)
if(!image){
return res.status(404).json({message: "l'image n'existe pas"})
}
if(image.nom){
const oldPath = path.join(__dirname, '../uploads/',
image.nom.split('/').at(-1))
console.log(oldPath)
if(fs.existsSync(oldPath)) {fs.unlinkSync(oldPath)}
}
await image.deleteOne()
return res.status(200).json({message: "image a été supprimée"})
} catch (error) {
console.log(error)
res.status(500).json({message: "Erreur serveur", error: error})
}
}
export { createImage, getAllImages, getImageById, updateImage, deleteImage }