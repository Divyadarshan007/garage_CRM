const Joi = require("joi");

const uploadSchema = Joi.object({
    // No body validation needed for file upload as it uses multer
    // but we can validate other fields if necessary
});

const deleteFileSchema = Joi.object({
    fileUrl: Joi.string().uri().required().messages({
        "any.required": "File URL is required",
        "string.uri": "File URL must be a valid URI",
        "string.empty": "File URL cannot be empty"
    })
});

module.exports = {
    uploadSchema,
    deleteFileSchema
};
