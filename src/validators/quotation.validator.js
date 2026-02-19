const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createQuotationSchema = Joi.object({
    customerId: objectId.required().messages({
        "any.required": "Customer ID is required",
        "any.invalid": "Customer ID must be a valid MongoDB ObjectId"
    }),
    vehicleId: objectId.required().messages({
        "any.required": "Vehicle ID is required",
        "any.invalid": "Vehicle ID must be a valid MongoDB ObjectId"
    }),
    jobCardId: objectId.optional().allow(null).messages({
        "any.invalid": "Job Card ID must be a valid MongoDB ObjectId"
    }),
    status: Joi.string().valid("draft", "pending", "approved", "rejected").optional(),
    items: Joi.array().items(
        Joi.object({
            description: Joi.string().required(),
            quantity: Joi.number().required(),
            unitPrice: Joi.number().required(),
            amount: Joi.number().required(),
            type: Joi.string().valid("service", "part").optional()
        })
    ).min(1).required().messages({
        "any.required": "Items are required",
        "array.min": "At least one item is required"
    }),
    totalAmount: Joi.number().required(),
    tax: Joi.number().optional(),
    discount: Joi.number().optional(),
    grandTotal: Joi.number().required(),
    notes: Joi.string().optional().allow("")
});

const updateQuotationSchema = Joi.object({
    customerId: objectId.optional(),
    vehicleId: objectId.optional(),
    jobCardId: objectId.optional().allow(null),
    status: Joi.string().valid("draft", "pending", "approved", "rejected").optional(),
    items: Joi.array().items(
        Joi.object({
            description: Joi.string().optional(),
            quantity: Joi.number().optional(),
            unitPrice: Joi.number().optional(),
            amount: Joi.number().optional(),
            type: Joi.string().valid("service", "part").optional()
        })
    ).min(1).optional(),
    totalAmount: Joi.number().optional(),
    tax: Joi.number().optional(),
    discount: Joi.number().optional(),
    grandTotal: Joi.number().optional(),
    notes: Joi.string().optional().allow("")
});

module.exports = {
    createQuotationSchema,
    updateQuotationSchema
};
