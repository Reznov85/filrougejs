
import Utilisateur from "../models/utilisateur.model.js"
import utilisateurValidation from "../validations/utilisateur.validation.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Aucune donnée dans la requête"})
        }
        const {error} = utilisateurValidation(body).utilisateurCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const searchUtilisateur = await Utilisateur.findOne({email: body.email})
        if(searchUtilisateur){
            return res.status(401).json({message: "L'utilisateur existe déjà"})
        }
        const utilisateur = new Utilisateur(body)
        const newUtilisateur = await utilisateur.save()
        return res.status(201).json(newUtilisateur)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const { error } = utilisateurValidation(req.body).utilisateurLogin
    if (error) {
      return res.status(400).json({
        message: "Données invalides",
        details: error.details.map(d => ({
          message: d.message, path: d.path, type: d.type, context: d.context
        })),
      })
    }

    const utilisateur = await Utilisateur.findOne({ email })
    if (!utilisateur) {
      return res.status(401).json({ message: "Identifiant ou mot de passe invalides" })
    }

    const ok = await bcrypt.compare(password, utilisateur.password)
    if (!ok) {
      return res.status(401).json({ message: "Identifiant ou mot de passe invalides" })
    }

    const payload = { id: utilisateur._id, email: utilisateur.email, role: utilisateur.role }
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "12h" })

    return res.status(200).json({
      message: `${utilisateur.email} est connecté`,
      token,
      user: { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}

const getAllUtilisateurs = async(req, res) => {
    try {
        const utilisateurs = await Utilisateur.find()
        return res.status(200).json(utilisateurs)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const getUtilisateurById = async(req,res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id)
        if(!utilisateur){
            return res.status(404).json({message: "L'utilisateur n'existe pas"})
        }
        return res.status(200).json(utilisateur)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const updateUtilisateur = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Aucune donnée dans la requête"})
        }

        const {error} = utilisateurValidation(body).utilisateurUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedUtilisateur){
            res.status(404).json({message: "L'utilisateur n'existe pas"})
        }
        return res.status(200).json(updatedUtilisateur)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

const deleteUtilisateur = async(req, res) => {
    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id)
        if(!utilisateur){
            return res.status(404).json({message: "L'utilisateur n'existe pas"})
        }
        return res.status(200).json({message: "utilisateur a été supprimé"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erreur serveur", error: error})
    }
}

export { register, login, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur }