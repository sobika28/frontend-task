// let users = [
//     { id: 1, name: "Arun", email: "arun@example.com" },
//     { id: 2, name: "Priya", email: "priya@example.com" }
// ];

// let nextId = 3;

// function getUsers(req, res) {
//     res.status(200).json(users);
// }
// function getUserById(req, res, next) {
//     const id = Number(req.params.id);
//     const user = users.find((u) => u.id === id);

//     if (!user) {
//         const error = new Error("User not found");
//         error.status = 404;
//         return next(error);
//     }

//     res.status(200).json(user);
// }

// function createUser(req, res, next) {
//     const { name, email } = req.body;

//     if (
//         typeof name !== "string" || !name.trim() ||
//         typeof email !== "string" || !email.trim()
//     ) {
//         const error = new Error("Name and email are required");
//         error.status = 400;
//         return next(error);
//     }

//     const newUser = {
//         id: nextId++,
//         name: name.trim(),
//         email: email.trim()
//     };

//     users.push(newUser);

//     res.status(201).json(newUser);
// }


// function updateUser(req, res, next) {
//     const id = Number(req.params.id);
//     const user = users.find((u) => u.id === id);

//     if (!user) {
//         const error = new Error("User not found");
//         error.status = 404;
//         return next(error);
//     }

//     const { name, email } = req.body;

//     if (
//         typeof name !== "string" || !name.trim() ||
//         typeof email !== "string" || !email.trim()
//     ) {
//         const error = new Error("Name and email are required");
//         error.status = 400;
//         return next(error);
//     }

//     user.name = name.trim();
//     user.email = email.trim();

//     res.status(200).json(user);
// }

// function deleteUser(req, res, next) {
//     const id = Number(req.params.id);
//     const index = users.findIndex((u) => u.id === id);

//     if (index === -1) {
//         const error = new Error("User not found");
//         error.status = 404;
//         return next(error);
//     }

//     users.splice(index, 1);

//     res.status(204).send();
// }

// module.exports = {
//     getUsers,
//     getUserById,
//     createUser,
//     updateUser,
//     deleteUser
// };


const pool = require("../db");

async function getUsers(req, res, next) {
    try {
        const [users] = await pool.query(
            "SELECT * FROM users ORDER BY id"
        );

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid user ID");
            error.status = 400;
            return next(error);
        }

        const [users] = await pool.execute(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json(users[0]);
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const { name, email } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim()
        ) {
            const error = new Error("Name and email are required");
            error.status = 400;
            return next(error);
        }

        const [result] = await pool.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name.trim(), email.trim()]
        );

        res.status(201).json({
            id: result.insertId,
            name: name.trim(),
            email: email.trim()
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Email already exists");
            duplicateError.status = 409;
            return next(duplicateError);
        }

        next(error);
    }
}


async function updateUser(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid user ID");
            error.status = 400;
            return next(error);
        }

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim()
        ) {
            const error = new Error("Name and email are required");
            error.status = 400;
            return next(error);
        }

        const [result] = await pool.execute(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [name.trim(), email.trim(), id]
        );

        if (result.affectedRows === 0) {
            const [users] = await pool.execute(
                "SELECT id FROM users WHERE id = ?",
                [id]
            );

            if (users.length === 0) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
        }

        res.status(200).json({
            message: "User updated successfully"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Email already exists");
            duplicateError.status = 409;
            return next(duplicateError);
        }

        next(error);
    }
}

// DELETE a user
async function deleteUser(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            const error = new Error("Invalid user ID");
            error.status = 400;
            return next(error);
        }

        const [result] = await pool.execute(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        res.status(204).send();
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            const orderError = new Error(
                "Cannot delete a user who has existing orders"
            );
            orderError.status = 409;
            return next(orderError);
        }

        next(error);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
