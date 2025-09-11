import Anime from "../models/anime.model.js"
import animeValidation from "../validations/anime.validation.js"

const createAnime = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "pas de données dans la requête"})
        }
        const {error} = animeValidation(body).animeCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const anime = new Anime(body)
        const newAnime = await anime.save()
        return res.status(201).json(newAnime)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllAnimes = async(req, res) => {
    try {
        const animes = await Anime.find()
        return res.status(200).json(animes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getAnimeById = async(req,res) => {
    try {
        const anime = await Anime.findById(req.params.id)
        if(!anime){
            return res.status(404).json({message: "anime doesn't exist"})
        }
        return res.status(200).json(anime)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateAnime = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = animeValidation(body).animeUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedAnime){
            res.status(404).json({message: "anime doesn't exist"})
        }
        return res.status(200).json(updatedAnime)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteAnime = async(req, res) => {
    try {
        const anime = await Anime.findByIdAndDelete(req.params.id)
        if(!anime){
            return res.status(404).json({message: "anime doesn't exist"})
        }
        return res.status(200).json({message: "anime has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createAnime, getAllAnimes, getAnimeById, updateAnime, deleteAnime }