const clients = require("../controllers/client.controller");
const router = require("express").Router();

module.exports = app => {
    // Create a new client
    router.post("/", clients.create);

    // Retrieve all clients
    router.get("/", clients.findAll);

    // Retrieve a single client with id
    router.get("/:id", clients.findOne);

    // Update a client with id
    router.put("/:id", clients.update);

    // Update a client with id and update only req.params included fields
    router.patch("/:id", clients.patch);

    // Delete a client with id
    router.delete("/:id", clients.delete);

    // Delete all clients - Oh no!
    router.delete("/", clients.deleteAll);

    app.use("/api/clients", router);
};
