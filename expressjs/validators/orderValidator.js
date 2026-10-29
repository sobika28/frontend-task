
const { body, param, validationResult } = require("express-validator");

const validateOrderId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
];

const validateOrderData = [
    body("user_id")
        .notEmpty()
        .withMessage("User ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),

    body("product_name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 100 })
        .withMessage("Product name must not exceed 100 characters"),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Amount must be a non-negative number"),

    body("status")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Status cannot be empty")
        .isLength({ max: 30 })
        .withMessage("Status must not exceed 30 characters")
];

const validateOrderUpdate = [
    body("product_name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 100 })
        .withMessage("Product name must not exceed 100 characters"),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Amount must be a non-negative number"),

    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isLength({ max: 30 })
        .withMessage("Status must not exceed 30 characters")
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
    validateOrderId,
    validateOrderData,
    validateOrderUpdate,
    checkValidation
};
