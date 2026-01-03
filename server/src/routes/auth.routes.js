const { Router } = require("express");
const { findUserByLogin } = require("../services/database");
const { comparePassword } = require("../utils/hash");

const router = Router();

router.post("/login", (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: "Нет данных" });
    }

    const user = findUserByLogin(login);

    if (!user) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const valid = comparePassword(password, user.password);

    if (!valid) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const { password: _, ...safeUser } = user;

    res.json({
        token: `fake-token-${user.id}`,
        user: safeUser
    });
});

module.exports = router;
