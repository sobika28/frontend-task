
const { body, param, validationResult } = require("express-validator");

const validateProductId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID")
];

const validateProductData = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
];

function checkValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
}

module.exports = {
    validateProductId,
    validateProductData,
    checkValidation
};
