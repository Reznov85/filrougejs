import joi from "joi";

export default function episodeValidation(body){
    const episodeCreate = joi.object({
      numero: joi.any().required(),
      saison: joi.any().required(),
      titre: joi.string().required(),
      synopsis: joi.any().required(),
      duree: joi.any().required()
    })

    const episodeUpdate = joi.object({
      numero: joi.any(),
      saison: joi.any(),
      titre: joi.string(),
      synopsis: joi.any(),
      duree: joi.any()
    })

    return {
        episodeCreate: episodeCreate.validate(body),
        episodeUpdate: episodeUpdate.validate(body),
    }
}
