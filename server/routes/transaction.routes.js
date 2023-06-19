const transactions = require("../controllers/transaction.controller");
const accounts = require("../controllers/account.controller");
module.exports = app => {
    const transactions = require("../controllers/transaction.controller");
    const router = require("express").Router();

    // Create a new transaction
    router.post("/", transactions.create);

    // Retrieve all transactions
    router.get("/", transactions.findAll);

    // Retrieve a single transaction with id
    router.get("/:id", transactions.findOne);

    // Retrieve all transactions for a client id
    router.get("/clients/:id", transactions.findAllByClientId);

    // Update a transaction with id
    router.put("/:id", transactions.update);

    // Update a transaction with id and update only req.params included fields
    router.patch("/:id", transactions.patch);

    // Delete a transaction with id
    router.delete("/:id", transactions.delete);

    // Delete all transactions - Oh no!
    router.delete("/", transactions.deleteAll);

    app.use("/api/transactions", router);
};
