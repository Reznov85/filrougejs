import joi from "joi";

export default function commentaireValidation(body){
    const commentaireCreate = joi.object({
      titre: joi.string().required(),
      contenu: joi.any().required()
    })

    const commentaireUpdate = joi.object({
      titre: joi.string(),
      contenu: joi.any()
    })

    return {
        commentaireCreate: commentaireCreate.validate(body),
        commentaireUpdate: commentaireUpdate.validate(body),
    }
}
