const { Router } = require("express");
const { readDB } = require("../services/database");

const router = Router();

router.get("/", (_req, res) => {
    const db = readDB();

    res.json(
        db.users.map(({ password, ...user }) => user)
    );
});

module.exports = router;
