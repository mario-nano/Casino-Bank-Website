const accounts = require("../controllers/account.controller");
const router = require("express").Router();

module.exports = app => {
    // Create a new account for client with id
    router.post("/clients/:clientId", accounts.create);

    // Retrieve all accounts
    router.get("/", accounts.findAll);

    // Retrieve a single account with id
    router.get("/:id", accounts.findOne);

    // Retrieve all accounts for a client id
    router.get("/clients/:id", accounts.findAllByClientId);

    // Retrieve an account by Account id and a Client id
    router.get("/:id/clients/:clientId", accounts.findByIdAndByClientId);

    // Update an account with id
    router.put("/:id", accounts.update);

    // Update an account with id and update only req.params included fields
    router.patch("/:id", accounts.patch);

    // Delete an account with id
    router.delete("/:id", accounts.delete);

    // Delete an account by Account id and a Client id
    router.delete("/:id/clients/:clientId", accounts.deleteByIdAndByClientId);

    // Delete all accounts - Oh no!
    router.delete("/", accounts.deleteAll);

    app.use("/api/accounts", router);
};