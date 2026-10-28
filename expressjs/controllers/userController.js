let users = [
    { id: 1, name: "Arun", email: "arun@example.com" },
    { id: 2, name: "Priya", email: "priya@example.com" }
];

let nextId = 3;

function getUsers(req, res) {
    res.status(200).json(users);
}
function getUserById(req, res, next) {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
    }

    res.status(200).json(user);
}

function createUser(req, res, next) {
    const { name, email } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !email.trim()
    ) {
        const error = new Error("Name and email are required");
        error.status = 400;
        return next(error);
    }

    const newUser = {
        id: nextId++,
        name: name.trim(),
        email: email.trim()
    };

    users.push(newUser);

    res.status(201).json(newUser);
}


function updateUser(req, res, next) {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
    }

    const { name, email } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !email.trim()
    ) {
        const error = new Error("Name and email are required");
        error.status = 400;
        return next(error);
    }

    user.name = name.trim();
    user.email = email.trim();

    res.status(200).json(user);
}

function deleteUser(req, res, next) {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
    }

    users.splice(index, 1);

    res.status(204).send();
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};