
function errorHandler(err, req, res, next) {
    console.error(err.message);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: Object.values(err.errors).map(error => error.message)
        });
    }

    // Invalid MongoDB ID format
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }

    // Duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists"
        });
    }

    // Other errors
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}

module.exports = errorHandler;
