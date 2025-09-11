import joi from "joi";

export default function imageValidation(body){
    const imageCreate = joi.object({
      alt: joi.string()
    })

    const imageUpdate = joi.object({
      alt: joi.string()
    })

    return {
        imageCreate: imageCreate.validate(body),
        imageUpdate: imageUpdate.validate(body),
    }
}
