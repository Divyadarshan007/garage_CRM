const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createJobCardSchema = Joi.object({
    customerId: objectId.required().messages({
        "any.required": "Customer ID is required",
        "any.invalid": "Customer ID must be a valid MongoDB ObjectId"
    }),
    vehicleId: objectId.required().messages({
        "any.required": "Vehicle ID is required",
        "any.invalid": "Vehicle ID must be a valid MongoDB ObjectId"
    }),
    jobCardNumber: Joi.string().required().messages({
        "any.required": "Job Card Number is required",
        "string.empty": "Job Card Number cannot be empty"
    }),
    status: Joi.string().valid("open", "in_progress", "completed", "cancelled").optional(),
    description: Joi.string().optional().allow(""),
    estimatedCost: Joi.number().optional(),
    deliveryDate: Joi.date().optional()
});

const updateJobCardSchema = Joi.object({
    customerId: objectId.optional(),
    vehicleId: objectId.optional(),
    jobCardNumber: Joi.string().optional(),
    status: Joi.string().valid("open", "in_progress", "completed", "cancelled").optional(),
    description: Joi.string().optional().allow(""),
    estimatedCost: Joi.number().optional(),
    deliveryDate: Joi.date().optional()
});

module.exports = {
    createJobCardSchema,
    updateJobCardSchema
};
