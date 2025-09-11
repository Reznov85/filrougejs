import joi from "joi";

export default function utilisateurValidation(body){
    const utilisateurCreate = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
      nom: joi.string().required(),
      prenom: joi.string().required(),
      email: joi.string().required(),
      role: joi.string(),
      password: joi.string().required(),
      avatar: joi.string()
    })

    const utilisateurUpdate = joi.object({
      email: joi.string().email(),
      password: joi.string(),
      nom: joi.string(),
      prenom: joi.string(),
      email: joi.string(),
      role: joi.string(),
      password: joi.string(),
      avatar: joi.string()
    })

    const utilisateurLogin = joi.object({
      email: joi.string().email(),
      password: joi.string(),
    })

    return {
        utilisateurCreate: utilisateurCreate.validate(body),
        utilisateurUpdate: utilisateurUpdate.validate(body),
        utilisateurLogin: utilisateurLogin.validate(body),
    }
}
