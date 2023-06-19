const { checkUsername } = require("../middlewares");
const auth = require("../controllers/auth.controller");
const clients = require("../controllers/client.controller");
const router = require("express").Router();


module.exports = app => {
    router.post(
        "/register",
        [
            checkUsername.checkDuplicateUsername
        ],
        clients.create
    );

    router.post("/login", auth.login);

    app.use("/api/auth", router)
};
