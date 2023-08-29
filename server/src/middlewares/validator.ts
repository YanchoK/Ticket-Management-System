import Joi, { Schema} from "joi"

type Payload = Record<string, any>;

const validator = (schema: Schema) => (payload:Payload) =>
    schema.validate(payload, { abortEarly: false });

const shemas = {
    signupSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(10).required(),
        confirmPassword: Joi.ref("password"),
    })
}

const validations = {
    validateSignup: validator(shemas.signupSchema)

}

export default validations
