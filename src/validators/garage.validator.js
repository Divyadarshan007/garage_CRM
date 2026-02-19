const Joi = require("joi");
const mongoose = require("mongoose");

const createGarageSchema = Joi.object({
    ownerName: Joi.string().required().messages({
        "any.required": "Owner name is required",
        "string.empty": "Owner name cannot be empty"
    }),
    garageName: Joi.string().required().messages({
        "any.required": "Garage name is required",
        "string.empty": "Garage name cannot be empty"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email cannot be empty"
    }),
    mobile: Joi.string().required().messages({
        "any.required": "Mobile number is required",
        "string.empty": "Mobile number cannot be empty"
    }),
    address: Joi.string().optional().allow(""),
    city: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    pincode: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow(""),
    currency: Joi.string().optional().allow(""),
    logo: Joi.string().optional().allow("")
});

const updateGarageSchema = Joi.object({
    ownerName: Joi.string().optional(),
    garageName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    mobile: Joi.string().optional(),
    address: Joi.string().optional().allow(""),
    city: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    pincode: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow(""),
    currency: Joi.string().optional().allow(""),
    logo: Joi.string().optional().allow("")
});

module.exports = {
    createGarageSchema,
    updateGarageSchema
};
