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
    jobcardId: objectId.required().messages({
        "any.required": "Job Card ID is required",
        "any.invalid": "Job Card ID must be a valid MongoDB ObjectId"
    }),
    garageId: objectId.optional(),
    services: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required()
        })
    ).min(1).required().messages({
        "any.required": "Services are required",
        "array.min": "At least one service is required"
    }),
    parts: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            total: Joi.number().required()
        })
    ).optional().default([]),
    subtotal: Joi.number().optional(),
    taxRate: Joi.number().required().messages({
        "any.required": "Tax Rate is required"
    }),
    taxAmount: Joi.number().optional(),
    discount: Joi.number().optional().default(0),
    grandTotal: Joi.number().optional(),
    notes: Joi.string().optional().allow(""),
    status: Joi.string().valid("draft", "approved", "rejected").optional().default("draft")
});

const updateQuotationSchema = Joi.object({
    jobcardId: objectId.optional(),
    garageId: objectId.optional(),
    services: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            price: Joi.number().optional()
        })
    ).min(1).optional(),
    parts: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            price: Joi.number().optional(),
            quantity: Joi.number().optional(),
            total: Joi.number().optional()
        })
    ).optional(),
    subtotal: Joi.number().optional(),
    taxRate: Joi.number().optional(),
    taxAmount: Joi.number().optional(),
    discount: Joi.number().optional(),
    grandTotal: Joi.number().optional(),
    notes: Joi.string().optional().allow(""),
    status: Joi.string().valid("draft", "approved", "rejected").optional()
});

module.exports = {
    createQuotationSchema,
    updateQuotationSchema
};
