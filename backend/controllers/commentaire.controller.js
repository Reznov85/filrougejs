import Commentaire from "../models/commentaire.model.js"
import commentaireValidation from "../validations/commentaire.validation.js"

const createCommentaire = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "no data in the request"})
        }
        const {error} = commentaireValidation(body).commentaireCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const commentaire = new Commentaire(body)
        const newCommentaire = await commentaire.save()
        return res.status(201).json(newCommentaire)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllCommentaires = async(req, res) => {
    try {
        const commentaires = await Commentaire.find()
        return res.status(200).json(commentaires)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getCommentaireById = async(req,res) => {
    try {
        const commentaire = await Commentaire.findById(req.params.id)
        if(!commentaire){
            return res.status(404).json({message: "commentaire doesn't exist"})
        }
        return res.status(200).json(commentaire)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateCommentaire = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = commentaireValidation(body).commentaireUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedCommentaire = await Commentaire.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedCommentaire){
            res.status(404).json({message: "commentaire doesn't exist"})
        }
        return res.status(200).json(updatedCommentaire)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteCommentaire = async(req, res) => {
    try {
        const commentaire = await Commentaire.findByIdAndDelete(req.params.id)
        if(!commentaire){
            return res.status(404).json({message: "commentaire doesn't exist"})
        }
        return res.status(200).json({message: "commentaire has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createCommentaire, getAllCommentaires, getCommentaireById, updateCommentaire, deleteCommentaire }