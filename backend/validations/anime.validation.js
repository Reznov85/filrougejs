import joi from "joi";

export default function animeValidation(body){
    const animeCreate = joi.object({
      titreOriginal: joi.string().required(),
      titreFr: joi.string().required(),
      auteur: joi.string(),
      synopsis: joi.any().required(),
      nbSaison: joi.any(),
      nbEpisode: joi.any(),
      studios: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      note: joi.any(),
      genres: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      episodes: joi.any()

    })

    const animeUpdate = joi.object({
      titreOriginal: joi.string(),
      titreFr: joi.string(),
      auteur: joi.string(),
      synopsis: joi.any(),
      nbSaison: joi.any(),
      nbEpisode: joi.any(),
      studios: joi.any(),
      note: joi.any(),
      genres: joi.any(),
      episodes: joi.any()
    })

     const animeaddOrRemoveImages = joi.object({
      image: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    })
   

    return {
        animeCreate: animeCreate.validate(body),
        animeUpdate: animeUpdate.validate(body),
        animeAddOrRemoveImages: animeaddOrRemoveImages.validate(body),

    }
}
