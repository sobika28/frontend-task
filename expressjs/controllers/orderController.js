const pool = require("../db");

async function getOrders(req, res, next) {
    try {
        const [orders] = await pool.query(`
            SELECT
                orders.id,
                orders.user_id,
                users.name AS user_name,
                orders.product_name,
                orders.amount,
                orders.status,
                orders.created_at
            FROM orders
            INNER JOIN users ON orders.user_id = users.id
            ORDER BY orders.id
        `);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}


async function getOrderById(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid order ID");
            error.status = 400;
            return next(error);
        }

        const [orders] = await pool.execute(`
            SELECT orders.*, users.name AS user_name
            FROM orders
            INNER JOIN users ON orders.user_id = users.id
            WHERE orders.id = ?
        `, [id]);

        if (orders.length === 0) {
            const error = new Error("Order not found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json(orders[0]);
    } catch (error) {
        next(error);
    }
}

async function createOrder(req, res, next) {
    
    try {
        const { user_id, product_name, amount, status } = req.body;

        if (
            !Number.isInteger(user_id) ||
            user_id < 1 ||
            typeof product_name !== "string" ||
            !product_name.trim() ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) < 0
        ) {
            const error = new Error(
                "Valid user_id, product_name and non-negative amount are required"
            );
            error.status = 400;
            return next(error);
        }

        if (
            status !== undefined &&
            (typeof status !== "string" || !status.trim())
        ) {
            const error = new Error("Status must be a non-empty string");
            error.status = 400;
            return next(error);
        }

        const orderStatus = status === undefined
            ? "Pending"
            : status.trim();

        const [result] = await pool.execute(
            `INSERT INTO orders
                (user_id, product_name, amount, status)
             VALUES (?, ?, ?, ?)`,
            [user_id, product_name.trim(), Number(amount), orderStatus]
        );

        res.status(201).json({
            message: "Order created successfully",
            id: result.insertId,
            user_id,
            product_name: product_name.trim(),
            amount: Number(amount),
            status: orderStatus
        });
    } catch (error) {
         
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            error.status = 400;
            error.message = "The specified user does not exist";
        }
        next(error);
    }
}

async function updateOrder(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { product_name, amount, status } = req.body;

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid order ID");
            error.status = 400;
            return next(error);
        }

        if (
            typeof product_name !== "string" ||
            !product_name.trim() ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) < 0 ||
            typeof status !== "string" ||
            !status.trim()
        ) {
            const error = new Error(
                "Valid product_name, non-negative amount and status are required"
            );
            error.status = 400;
            return next(error);
        }

        const [result] = await pool.execute(
            `UPDATE orders
             SET product_name = ?, amount = ?, status = ?
             WHERE id = ?`,
            [product_name.trim(), Number(amount), status.trim(), id]
        );

        if (result.affectedRows === 0) {
            const [orders] = await pool.execute(
                "SELECT id FROM orders WHERE id = ?",
                [id]
            );

            if (orders.length === 0) {
                const error = new Error("Order not found");
                error.status = 404;
                return next(error);
            }
        }

        res.status(200).json({
            message: "Order updated successfully"
        });
    } catch (error) {
        next(error);
    }
}


async function deleteOrder(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid order ID");
            error.status = 400;
            return next(error);
        }

        const [result] = await pool.execute(
            "DELETE FROM orders WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            const error = new Error("Order not found");
            error.status = 404;
            return next(error);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
