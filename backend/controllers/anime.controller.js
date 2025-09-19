// controllers/anime.controller.js
import Anime from "../models/anime.model.js";
import Image from "../models/image.model.js";
import animeValidation from "../validations/anime.validation.js";

const createAnime = async (req, res) => {
  try {
    const { body } = req;
    if (!body) return res.status(400).json({ message: "Pas de données dans la requête" });

    const { error } = animeValidation(body).animeCreate;
    if (error) return res.status(400).json({ message: error.details[0].message });

    const anime = new Anime(body);
    const newAnime = await anime.save();
    return res.status(201).json(newAnime);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllAnimes = async (req, res) => {
  try {
    const animes = await Anime.find().populate("image").lean();
    return res.status(200).json(animes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).populate("image");
    if (!anime) return res.status(404).json({ message: "L'animé n'existe pas" });
    return res.status(200).json(anime);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateAnime = async (req, res) => {
  try {
    const { body } = req;
    if (!body) return res.status(400).json({ message: "Pas de données dans la requête" });

    const { error } = animeValidation(body).animeUpdate;
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updatedAnime) return res.status(404).json({ message: "L'animé n'existe pas" });

    return res.status(200).json(updatedAnime);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime) return res.status(404).json({ message: "L'animé n'existe pas" });
    return res.status(200).json({ message: "L'animé a été supprimé" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

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

    // 3) (Optionnel) Validation Joi si tu l’as
    // const { error } = animeValidation({ image }).animeAddOrRemoveImages;
    // if (error) return res.status(400).json({ message: error.details?.[0]?.message });

    // 4) Vérifier l’existence des IDs Image
    const found = await Image.find({ _id: { $in: image } }).select("_id").lean();
    const foundIds = new Set(found.map(d => String(d._id)));
    const missing = image.filter(x => !foundIds.has(String(x)));
    if (missing.length > 0) {
      return res.status(404).json({ message: `Image(s) inexistante(s) : ${missing.join(", ")}` });
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

export {
  createAnime,
  getAllAnimes,
  getAnimeById,
  updateAnime,
  deleteAnime,
  addImages,
  removeImages,
};
