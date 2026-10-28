const helmet = require("helmet");
const express = require("express");
const app = express();


const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(helmet());
app.get("/", (req, res) => {
    res.send("My Express API is running!");
});

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
