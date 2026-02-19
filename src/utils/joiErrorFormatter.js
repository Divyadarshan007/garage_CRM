/**
 * Format Joi validation errors into a structured object
 * @param {Object} error - Joi validation error object
 * @returns {Object} Formatted errors object with field paths as keys and error messages as arrays
 */
const formatJoiErrors = error => {
    const errors = {};

    error.details.forEach(detail => {
        const path = detail.path
            .map(p => (typeof p === "number" ? `[${p}]` : p))
            .join(".");

        if (!errors[path]) {
            errors[path] = [];
        }

        errors[path].push(detail.message);
    });

    return errors;
};

module.exports = { formatJoiErrors };
