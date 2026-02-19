const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "MongoDB ObjectId validation");

const createTransactionSchema = Joi.object({
    customerId: objectId.required().messages({
        "any.required": "Customer ID is required",
        "any.invalid": "Customer ID must be a valid MongoDB ObjectId"
    }),
    vehicleId: objectId.optional().allow(null).messages({
        "any.invalid": "Vehicle ID must be a valid MongoDB ObjectId"
    }),
    jobCardId: objectId.optional().allow(null).messages({
        "any.invalid": "Job Card ID must be a valid MongoDB ObjectId"
    }),
    invoiceId: objectId.optional().allow(null).messages({
        "any.invalid": "Invoice ID must be a valid MongoDB ObjectId"
    }),
    expenseId: objectId.optional().allow(null).messages({
        "any.invalid": "Expense ID must be a valid MongoDB ObjectId"
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required"
    }),
    type: Joi.string().valid("income", "expense").required(),
    category: Joi.string().optional(),
    paymentMethod: Joi.string().valid("cash", "card", "online", "cheque").optional(),
    description: Joi.string().optional().allow(""),
    date: Joi.date().optional()
});

const updateTransactionSchema = Joi.object({
    amount: Joi.number().optional(),
    type: Joi.string().valid("income", "expense").optional(),
    category: Joi.string().optional(),
    paymentMethod: Joi.string().valid("cash", "card", "online", "cheque").optional(),
    description: Joi.string().optional().allow(""),
    date: Joi.date().optional()
});

module.exports = {
    createTransactionSchema,
    updateTransactionSchema
};
