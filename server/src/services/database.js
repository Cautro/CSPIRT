const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../data/database.json");

function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function findUserByLogin(login) {
    const db = readDB();
    return db.users.find(u => u.login === login) || null;
}

module.exports = {
    readDB,
    writeDB,
    findUserByLogin
};
