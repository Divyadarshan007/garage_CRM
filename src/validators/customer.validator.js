const Joi = require("joi");
const mongoose = require("mongoose");

const createCustomerSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty"
    }),
    mobile: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
        "any.required": "Mobile number is required",
        "string.empty": "Mobile number cannot be empty"
    }),
    email: Joi.string().email().optional().allow(""),
    address: Joi.string().optional().allow(""),
    vehicleNo: Joi.string().optional().allow(""),
    model: Joi.string().optional().allow(""),
    make: Joi.string().optional().allow(""),
    year: Joi.alternatives().try(Joi.string(), Joi.number()).optional().allow(""),
    garageId: Joi.string().optional().custom((value, helpers) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
});

const updateCustomerSchema = Joi.object({
    name: Joi.string().optional(),
    mobile: Joi.string().optional(),
    email: Joi.string().email().optional().allow(""),
    address: Joi.string().optional().allow("")
});

module.exports = {
    createCustomerSchema,
    updateCustomerSchema
};
