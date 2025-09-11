import Episode from "../models/episode.model.js"
import episodeValidation from "../validations/episode.validation.js"

const createEpisode = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "no data in the request"})
        }
        const {error} = episodeValidation(body).episodeCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const episode = new Episode(body)
        const newEpisode = await episode.save()
        return res.status(201).json(newEpisode)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllEpisodes = async(req, res) => {
    try {
        const episodes = await Episode.find()
        return res.status(200).json(episodes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getEpisodeById = async(req,res) => {
    try {
        const episode = await Episode.findById(req.params.id)
        if(!episode){
            return res.status(404).json({message: "episode doesn't exist"})
        }
        return res.status(200).json(episode)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateEpisode = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = episodeValidation(body).episodeUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedEpisode = await Episode.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedEpisode){
            res.status(404).json({message: "episode doesn't exist"})
        }
        return res.status(200).json(updatedEpisode)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteEpisode = async(req, res) => {
    try {
        const episode = await Episode.findByIdAndDelete(req.params.id)
        if(!episode){
            return res.status(404).json({message: "episode doesn't exist"})
        }
        return res.status(200).json({message: "episode has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createEpisode, getAllEpisodes, getEpisodeById, updateEpisode, deleteEpisode }