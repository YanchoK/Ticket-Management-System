import Joi, { Schema, number } from "joi"
import { UserRole } from '../interfaces/user_interface'
import { TicketPriority, TicketState } from "../interfaces/ticket_interface";

type Payload = Record<string, any>;

const validator = (schema: Schema) => (payload: Payload) =>
    schema.validate(payload, { abortEarly: false });

const schemas = {
    logInSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        // confirmPassword: Joi.ref("password"),
    }),
    idSchema: Joi.object({
        id: Joi.number().required()
    }),
    userSchema: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        role: Joi.string().valid(...Object.values(UserRole)).required()
    }),
    updateUserSchema: Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        passwordHash: Joi.string().min(6).max(30).optional(),
        profileImageName: Joi.string().optional(),
        role: Joi.string().valid(...Object.values(UserRole)).optional()
        // email: Joi.string().email().required(),
    }),
    ticketSchema: Joi.object({
        shortDescription: Joi.string().max(50),
        description: Joi.string(),
        state: Joi.string().valid(...Object.values(TicketState)).optional(),
        priority: Joi.string().valid(...Object.values(TicketPriority)).optional(),
        assignedToId: Joi.number().optional().allow(null),
        JIRA_ID:Joi.string().optional().allow(null)
    }),
}

const validations = {
    validateLogIn: validator(schemas.logInSchema),
    validateId: validator(schemas.idSchema),
    validateUser: validator(schemas.userSchema),
    validateUpdateUser: validator(schemas.updateUserSchema),
    validateTicket: validator(schemas.ticketSchema),

}

export default validations
