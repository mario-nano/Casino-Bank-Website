const db = require("../models");
const Client = db.client;

checkDuplicateUsername = (req, res, next) => {
    //checking username exists
    const existUsername = Client.findOne({ username: req.body.username});
    if (existUsername) {
        res.status(400).send({ message: "Username already exists!" });
        return;
    } else {
        next();
    }
};

const checkUsername = {
    checkDuplicateUsername
};

module.exports = checkUsername;
