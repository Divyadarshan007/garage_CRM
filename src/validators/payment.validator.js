const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createPaymentSchema = Joi.object({
    invoiceId: objectId.required().messages({
        "any.required": "Invoice ID is required",
        "any.invalid": "Invoice ID must be a valid MongoDB ObjectId"
    }),
    jobcardId: objectId.required().messages({
        "any.required": "Job Card ID is required",
        "any.invalid": "Job Card ID must be a valid MongoDB ObjectId"
    }),
    paymentMode: Joi.string().valid("cash", "upi", "card", "bank_transfer").required().messages({
        "any.required": "Payment mode is required",
        "any.only": "Payment mode must be one of: cash, upi, card, bank_transfer"
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required"
    }),
    discountAmount: Joi.number().optional().default(0),
    notes: Joi.string().optional().allow(""),
    date: Joi.date().optional()
});

const updatePaymentSchema = Joi.object({
    paymentMode: Joi.string().valid("cash", "upi", "card", "bank_transfer").optional(),
    amount: Joi.number().optional(),
    discountAmount: Joi.number().optional(),
    notes: Joi.string().optional().allow(""),
    date: Joi.date().optional()
});

module.exports = {
    createPaymentSchema,
    updatePaymentSchema
};
