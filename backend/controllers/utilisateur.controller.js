
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
const updateMyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
        }

        const userId = req.user?.id
        if (!userId) {
        return res.status(400).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("+password");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Le mot de passe à bien été modifié" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}
const addImages = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Normalisation robuste du payload
    let { image, images } = req.body || {};

    // Accepter 'images' ou 'image'
    if (image == null && Array.isArray(images)) image = images;

    // Si c'est une string unique -> tableau
    if (typeof image === "string") {
      // supporte "id1,id2,id3" ou "id"
      image = image.includes(",")
        ? image.split(",").map(s => s.trim()).filter(Boolean)
        : [image];
    }

    // Si c'est un seul ObjectId envoyé comme objet/quelque chose d'autre
    if (image && !Array.isArray(image)) image = [String(image)];

    // 2) Garde-fou
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({ message: "Le champ 'image' doit être un tableau non vide." });
    }


   // 4) Vérifier l’existence des IDs Image
// On suppose que "image" est un tableau d'identifiants (envoyés par le client)
const found = await Image.find({ _id: { $in: image } }) 
  .select("_id")    // on ne récupère que le champ _id
  .lean();          // .lean() renvoie des objets JS simples (plus léger que des documents Mongoose)

// On crée un Set contenant tous les _id trouvés en BDD (convertis en string)
const foundIds = new Set(found.map(d => String(d._id)));

// On compare la liste envoyée par le client ("image")
// avec celle trouvée en base ("foundIds")
// → tous les IDs qui ne sont pas présents en base seront placés dans "missing"
const missing = image.filter(x => !foundIds.has(String(x)));

// Si certains IDs n'existent pas, on renvoie une erreur 404 avec la liste des IDs manquants
if (missing.length > 0) {
  return res.status(404).json({ 
    message: `Image(s) inexistante(s) : ${missing.join(", ")}` 
  });
}

    // 5) Ajout sans doublons dans le champ 'image' (singulier dans ton modèle)
    const updatedAnime = await Anime.findByIdAndUpdate(
      id,
      { $addToSet: { image: { $each: image } } },
      { new: true }
    ).populate("image");

    if (!updatedAnime) {
      return res.status(404).json({ message: "L'animé n'existe pas." });
    }

    return res.status(200).json(updatedAnime);
  } catch (err) {
    if (err?.name === "CastError") {
      return res.status(400).json({ message: "ID invalide (ObjectId de 24 caractères requis)." });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const removeImages = async (req, res) => {
  try {
    const { body } = req;
    if (!body || !Array.isArray(body.image) || body.image.length === 0) {
      return res.status(400).json({ message: "Pas de données 'images' dans la requête" });
    }

    const { error } = animeValidation(body).animeAddOrRemoveImages;
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Optionnel : vérifier qu'elles existent (sinon on retire juste ce qui est présent)
    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: { $in: body.images } } },
      { new: true }
    ).populate("image");

    if (!updatedAnime) return res.status(404).json({ message: "L'animé n'existe pas" });

    return res.status(200).json(updatedAnime);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};


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
const getMe = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const updateMyAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé" });
    }

    const userId = req.user.id; // récupéré depuis middleware `auth`
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await Utilisateur.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    res.json({
      message: "Avatar mis à jour",
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export { register, login, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur, updateMyPassword, getMe, addImages, removeImages, updateMyAvatar }