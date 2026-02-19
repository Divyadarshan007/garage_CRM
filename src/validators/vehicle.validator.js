const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createVehicleSchema = Joi.object({
    customerId: objectId.required().messages({
        "any.required": "Customer ID is required",
        "any.invalid": "Customer ID must be a valid MongoDB ObjectId"
    }),
    make: Joi.string().required().messages({
        "any.required": "Make is required",
        "string.empty": "Make cannot be empty"
    }),
    model: Joi.string().required().messages({
        "any.required": "Model is required",
        "string.empty": "Model cannot be empty"
    }),
    year: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
        "any.required": "Year is required"
    }),
    licensePlate: Joi.string().required().messages({
        "any.required": "License Plate is required",
        "string.empty": "License Plate cannot be empty"
    }),
    vin: Joi.string().optional().allow(""),
    color: Joi.string().optional().allow("")
});

const updateVehicleSchema = Joi.object({
    customerId: objectId.optional(),
    make: Joi.string().optional(),
    model: Joi.string().optional(),
    year: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    licensePlate: Joi.string().optional(),
    vin: Joi.string().optional().allow(""),
    color: Joi.string().optional().allow("")
});

module.exports = {
    createVehicleSchema,
    updateVehicleSchema
};
