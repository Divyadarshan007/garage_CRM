const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email cannot be empty"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty"
    }),
    garageId: Joi.string().optional()
});

const firebaseLoginSchema = Joi.object({
    idToken: Joi.string().required().messages({
        "any.required": "ID Token is required",
        "string.empty": "ID Token cannot be empty"
    })
});

module.exports = {
    loginSchema,
    firebaseLoginSchema
};
