
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"]
        },

        category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: true
},

        stock: {
            type: Number,
            default: 0,
            min: [0, "Stock cannot be negative"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
