const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createAdminSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email cannot be empty"
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password cannot be empty"
    }),
    role: Joi.string().valid("super_admin", "admin", "moderator").optional()
});

const loginAdminSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email cannot be empty"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty"
    })
});

const updateAdminSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid("super_admin", "admin", "moderator").optional()
});

module.exports = {
    createAdminSchema,
    loginAdminSchema,
    updateAdminSchema
};
