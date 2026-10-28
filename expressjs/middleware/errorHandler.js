function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    res.status(status).json({
        success: false,
        message: status === 500
            ? "Internal server error"
            : err.message
    });
}

module.exports = errorHandler;