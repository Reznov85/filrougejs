import Studio from "../models/studio.model.js"
import studioValidation from "../validations/studio.validation.js"

const createStudio = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "pas de données dans la requête"})
        }
        const {error} = studioValidation(body).studioCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const studio = new Studio(body)
        const newStudio = await studio.save()
        return res.status(201).json(newStudio)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const getAllStudios = async(req, res) => {
    try {
        const studios = await Studio.find()
        return res.status(200).json(studios)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const getStudioById = async(req,res) => {
    try {
        const studio = await Studio.findById(req.params.id)
        if(!studio){
            return res.status(404).json({message: "ce studio n'existe pas"})
        }
        return res.status(200).json(studio)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const updateStudio = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "pas de données dans la requête"})
        }

        const {error} = studioValidation(body).studioUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedStudio = await Studio.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedStudio){
            res.status(404).json({message: "ce studio n'existe pas"})
        }
        return res.status(200).json(updatedStudio)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const deleteStudio = async(req, res) => {
    try {
        const studio = await Studio.findByIdAndDelete(req.params.id)
        if(!studio){
            return res.status(404).json({message: "ce studio n'existe pas"})
        }
        return res.status(200).json({message: "le studio a été supprimé"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

export { createStudio, getAllStudios, getStudioById, updateStudio, deleteStudio }