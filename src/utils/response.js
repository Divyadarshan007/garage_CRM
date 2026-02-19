const codes = {
    success: 200,
    resourceNotAvailable: 404,
    forbidden: 403,
    unAuthorized: 401,
    badRequest: 400,
    internalServerError: 500
};

exports.success = (data, response) => {
    return response.status(codes.success).json(data);
};

exports.notFound = response => {
    return response.status(codes.resourceNotAvailable).json("Resource not found!");
};

exports.forbidden = (message, response) => {
    return response.status(codes.forbidden).json("Access forbidden!");
};

exports.unauthorized = response => {
    return response.status(codes.unAuthorized).json("Unauthorized access!");
};

exports.serverError = (error, response) => {
    console.error(error);
    return response.status(codes.internalServerError).json("Internal server error");
};

exports.validationError = (message, errors, response) => {
    return response.status(codes.badRequest).json({
        message: message || "Validation failed",
        errors: errors
    });
};
