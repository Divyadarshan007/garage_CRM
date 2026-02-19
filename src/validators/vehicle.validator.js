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
    vehicleType: Joi.string().required().messages({
        "any.required": "Vehicle Type is required",
        "string.empty": "Vehicle Type cannot be empty"
    }),
    brand: Joi.string().required().messages({
        "any.required": "Brand is required",
        "string.empty": "Brand cannot be empty"
    }),
    model: Joi.string().required().messages({
        "any.required": "Model is required",
        "string.empty": "Model cannot be empty"
    }),
    vehicleNumber: Joi.string().required().messages({
        "any.required": "Vehicle Number is required",
        "string.empty": "Vehicle Number cannot be empty"
    }),
    fuelType: Joi.string().required().messages({
        "any.required": "Fuel Type is required",
        "string.empty": "Fuel Type cannot be empty"
    })
});

const updateVehicleSchema = Joi.object({
    customerId: objectId.optional(),
    vehicleType: Joi.string().optional(),
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    vehicleNumber: Joi.string().optional(),
    fuelType: Joi.string().optional()
});

module.exports = {
    createVehicleSchema,
    updateVehicleSchema
};
