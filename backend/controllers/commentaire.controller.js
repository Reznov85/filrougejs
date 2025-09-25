import Commentaire from "../models/commentaire.model.js"
import commentaireValidation from "../validations/commentaire.validation.js"
import Anime from "../models/anime.model.js"; // chemin à adapter
import mongoose from "mongoose";

const { isValidObjectId } = mongoose;

const createCommentaire = async(req,res)=>{
    try {
    const userId = req.user?.id; // injecté par ton middleware auth
    const { titre, contenu , animeId } = req.body;

    // 1) Validation basique
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }
    if (!animeId || !isValidObjectId(animeId)) {
      return res.status(400).json({ message: "animeId invalide." });
    }
    if (!contenu || typeof contenu !== "string" || !contenu.trim()) {
      return res.status(400).json({ message: "Le champ 'contenu' est requis." });
    }
    const cleanTitre = typeof titre === "string" ? titre.trim() : undefined;
    const cleanTexte = contenu.trim();

    // 2) L’anime doit exister
    const anime = await Anime.findById(animeId).select("_id commentaires");
    if (!anime) {
      return res.status(404).json({ message: "Animé introuvable." });
    }

    // 3) Création du commentaire
    const created = await Commentaire.create({
      titre: cleanTitre,
      contenu: cleanTexte,
      auteur: userId,
      anime: animeId,
    });

    // 4) Lier à l’anime
    //  - évite les doublons
    if (!anime.commentaires?.some((id) => String(id) === String(created._id))) {
      anime.commentaires.push(created._id);
      await anime.save();
    }

    // 5) Relecture populée (auteur)
    const populated = await Commentaire.findById(created._id)
      .populate("auteur", "prenom nom")
      .lean();

    return res.status(201).json(populated);
  } catch (e) {
    console.error("createComment error:", e);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

/**
 * GET /commentaire/:animeId
 * Retourne la liste des commentaires d’un animé (du plus récent au plus ancien)
 */


const getAllCommentaires = async(req, res) => {
    try {
        const commentaires = await Commentaire.find().populate("auteur", "prenom nom")
        return res.status(200).json(commentaires)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}
export async function getCommentsByAnime(req, res) {
  try {
    const { animeId } = req.params;
    if (!animeId || !isValidObjectId(animeId)) {
      return res.status(400).json({ message: "animeId invalide." });
    }

    const comments = await Commentaire.find({ anime: animeId }).populate("auteur", "prenom nom")
      .sort({ createdAt: -1 })
      .populate("auteur", "pseudo _id")
      .lean();

    return res.json(comments); // ton front gère un tableau direct
  } catch (e) {
    console.error("getCommentsByAnime error:", e);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

const getCommentaireById = async(req,res) => {
    try {
        const commentaire = await Commentaire.findById(req.params.id).populate("auteur", "prenom nom")
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