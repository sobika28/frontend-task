
const mongoose = require("mongoose");

async function connectMongoDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/products_db");
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;
