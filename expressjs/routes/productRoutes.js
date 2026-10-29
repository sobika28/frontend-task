
const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    validateProductId,
    validateProductData,
    checkValidation
} = require("../validators/productValidator");

// GET all products
router.get("/", getProducts);

// GET one product
router.get("/:id", validateProductId, checkValidation, getProductById);

// CREATE a product
router.post("/", validateProductData, checkValidation, createProduct);

// UPDATE a product
router.put(
    "/:id",
    validateProductId,
    validateProductData,
    checkValidation,
    updateProduct
);

// DELETE a product
router.delete("/:id", validateProductId, checkValidation, deleteProduct);

module.exports = router;
