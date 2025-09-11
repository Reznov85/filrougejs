import joi from "joi";

export default function genreValidation(body){
    const genreCreate = joi.object({
      nom: joi.string().required(),
      description: joi.any().required()
    })

    const genreUpdate = joi.object({
      nom: joi.string(),
      description: joi.any()
    })

    return {
        genreCreate: genreCreate.validate(body),
        genreUpdate: genreUpdate.validate(body),
    }
}
