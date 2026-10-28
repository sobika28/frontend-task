
const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const {
    validateUserId,
    validateUserData,
    checkValidation
} = require("../validators/userValidator");

// GET all users
router.get("/", getUsers);

// GET one user
router.get("/:id", validateUserId, checkValidation, getUserById);

// CREATE a user
router.post("/", validateUserData, checkValidation, createUser);

// UPDATE a user
router.put("/:id", validateUserId, validateUserData, checkValidation, updateUser);

// DELETE a user
router.delete("/:id", validateUserId, checkValidation, deleteUser);

module.exports = router;
