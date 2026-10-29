const helmet = require("helmet");
const express = require("express");
const app = express();


const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectMongoDB = require("./config/mongodb");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
app.use(express.json());
app.use(helmet());
app.get("/", (req, res) => {
    res.send("My Express API is running!");
});

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use(errorHandler);

const PORT = 3000;

async function startServer() {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();