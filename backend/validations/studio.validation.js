import joi from "joi";

export default function studioValidation(body){
    const studioCreate = joi.object({
      nom: joi.string().required(),
      siteWeb: joi.string().required(),
      pays: joi.string().required()
    })

    const studioUpdate = joi.object({
      nom: joi.string(),
      siteWeb: joi.string(),
      pays: joi.string()
    })

    return {
        studioCreate: studioCreate.validate(body),
        studioUpdate: studioUpdate.validate(body),
    }
}
