import Genre from "../models/genre.model.js"
import genreValidation from "../validations/genre.validation.js"

const createGenre = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "pas de données dans la requête"})
        }
        const {error} = genreValidation(body).genreCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const genre = new Genre(body)
        const newGenre = await genre.save()
        return res.status(201).json(newGenre)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllGenres = async(req, res) => {
    try {
        const genres = await Genre.find()
        return res.status(200).json(genres)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getGenreById = async(req,res) => {
    try {
        const genre = await Genre.findById(req.params.id)
        if(!genre){
            return res.status(404).json({message: "genre doesn't exist"})
        }
        return res.status(200).json(genre)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateGenre = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = genreValidation(body).genreUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedGenre){
            res.status(404).json({message: "genre doesn't exist"})
        }
        return res.status(200).json(updatedGenre)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteGenre = async(req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id)
        if(!genre){
            return res.status(404).json({message: "genre doesn't exist"})
        }
        return res.status(200).json({message: "genre has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre }