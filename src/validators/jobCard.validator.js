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
    garageId: objectId.optional(),
    customerId: objectId.required().messages({
        "any.required": "Customer ID is required",
        "any.invalid": "Customer ID must be a valid MongoDB ObjectId"
    }),
    vehicleId: objectId.required().messages({
        "any.required": "Vehicle ID is required",
        "any.invalid": "Vehicle ID must be a valid MongoDB ObjectId"
    }),
    jobCardNumber: Joi.string().optional().allow("").messages({
        "string.empty": "Job Card Number cannot be empty"
    }),
    status: Joi.string().valid("pending", "quotationCreated", "quotationApproved", "inProgress", "completed", "invoiceCreated", "paid").default("pending"),
    currentkm: Joi.number().required().messages({
        "any.required": "Current KM is required"
    }),
    vehiclePhotos: Joi.array().items(Joi.string()).optional(),
    serviceRequested: Joi.array().items(Joi.string()).required().messages({
        "any.required": "Service Requested is required"
    }),
    specificIssue: Joi.string().optional().allow(""),
    statusHistory: Joi.array().items(Joi.object()).optional(),
    isQuotationCreated: Joi.boolean().optional(),
    isInvoiceCreated: Joi.boolean().optional()
});

const updateJobCardSchema = Joi.object({
    garageId: objectId.optional(),
    customerId: objectId.optional(),
    vehicleId: objectId.optional(),
    jobCardNumber: Joi.string().optional(),
    status: Joi.string().valid("pending", "quotationCreated", "quotationApproved", "inProgress", "completed", "invoiceCreated", "paid").optional(),
    currentkm: Joi.number().optional(),
    vehiclePhotos: Joi.array().items(Joi.string()).optional(),
    serviceRequested: Joi.array().items(Joi.string()).optional(),
    specificIssue: Joi.string().optional().allow(""),
    statusHistory: Joi.array().items(Joi.object()).optional(),
    isQuotationCreated: Joi.boolean().optional(),
    isInvoiceCreated: Joi.boolean().optional()
});

const updateJobCardStatusSchema = Joi.object({
    status: Joi.string().valid("pending", "quotationCreated", "quotationApproved", "inProgress", "completed", "invoiceCreated", "paid").required().messages({
        "any.required": "Status is required",
        "any.only": "Status must be one of: pending, quotationCreated, quotationApproved, inProgress, completed, invoiceCreated, paid"
    }),
    notes: Joi.string().optional().allow("").messages({
        "string.base": "Notes must be a string"
    })
});

module.exports = {
    createJobCardSchema,
    updateJobCardSchema,
    updateJobCardStatusSchema
};
