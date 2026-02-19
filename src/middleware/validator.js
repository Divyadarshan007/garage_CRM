const { formatJoiErrors } = require("../utils/joiErrorFormatter");
const response = require("../utils/response");

/**
 * Validation middleware for Joi schemas
 * @param {Object} schema - Joi validation schema
 * @param {Object} options - Validation options
 * @param {string} options.source - Source of data to validate: 'body', 'params', 'query', or 'all'
 * @param {Object} options.joiOptions - Options to pass to Joi validate method
 * @returns {Function} Express middleware function
 */
const validate = (schema, options = {}) => {
    const { source = "body", joiOptions = {} } = options;

    // Default Joi options
    const defaultJoiOptions = {
        abortEarly: false,
        errors: { wrap: { label: "" } },
        ...joiOptions
    };

    return (req, res, next) => {
        try {
            let dataToValidate = {};

            // Get data from appropriate source(s)
            if (source === "body") {
                dataToValidate = req.body;
            } else if (source === "params") {
                dataToValidate = req.params;
            } else if (source === "query") {
                dataToValidate = req.query;
            } else if (source === "all") {
                dataToValidate = {
                    ...req.body,
                    ...req.params,
                    ...req.query
                };
            }

            // Handle data field if it's a JSON string
            if (dataToValidate.data && typeof dataToValidate.data === "string") {
                try {
                    dataToValidate.data = JSON.parse(dataToValidate.data);
                } catch (parseError) {
                    return response.validationError(
                        "Validation failed",
                        { data: ["data must be a valid JSON string"] },
                        res
                    );
                }
            }

            // Validate the data
            const { error, value } = schema.validate(dataToValidate, defaultJoiOptions);

            if (error) {
                const formattedErrors = formatJoiErrors(error);
                return response.validationError("Validation failed", formattedErrors, res);
            }

            // Attach validated data to request
            req.validated = value;

            // If data was parsed from JSON string, merge it back to req.body for backward compatibility
            if (value.data && typeof value.data === "object") {
                req.body = { ...req.body, ...value.data };
            } else {
                req.body = value;
            }

            next();
        } catch (err) {
            console.error("Validation middleware error:", err);
            return response.serverError(err, res);
        }
    };
};

module.exports = { validate };
