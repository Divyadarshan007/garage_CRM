const Joi = require("joi");

const createPlanSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Plan name is required",
        "string.empty": "Plan name cannot be empty"
    }),
    price: Joi.number().min(0).required().messages({
        "any.required": "Price is required",
        "number.min": "Price cannot be negative"
    }),
    currency: Joi.string().default("INR").optional(),
    durationDays: Joi.number().integer().min(0).required().messages({
        "any.required": "Duration is required",
        "number.min": "Duration cannot be negative"
    }),
    features: Joi.array().items(Joi.string()).optional(),
    type: Joi.string().valid("basic", "standard", "premium").optional(),
    isActive: Joi.boolean().optional()
});

const updatePlanSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().optional(),
    durationDays: Joi.number().integer().min(0).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    type: Joi.string().valid("basic", "standard", "premium").optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    createPlanSchema,
    updatePlanSchema
};
