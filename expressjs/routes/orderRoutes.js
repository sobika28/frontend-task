
const express = require("express");
const router = express.Router();

const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const {
    validateOrderId,
    validateOrderData,
    validateOrderUpdate,
    checkValidation
} = require("../validators/orderValidator");

// GET all orders
router.get("/", getOrders);

// GET one order
router.get("/:id", validateOrderId, checkValidation, getOrderById);

// CREATE an order
router.post("/", validateOrderData, checkValidation, createOrder);

// UPDATE an order
router.put(
    "/:id",
    validateOrderId,
    validateOrderUpdate,
    checkValidation,
    updateOrder
);

// DELETE an order
router.delete("/:id", validateOrderId, checkValidation, deleteOrder);

module.exports = router;
