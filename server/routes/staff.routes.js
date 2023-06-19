const staffs = require("../controllers/staff.controller");
module.exports = app => {
    const staffs = require("../controllers/staff.controller");
    const router = require("express").Router();

    // Create a new staff
    router.post("/", staffs.create);

    // Retrieve all staffs
    router.get("/", staffs.findAll);

    // Retrieve a single staff with id
    router.get("/:id", staffs.findOne);

    // Update a staff with id
    router.put("/:id", staffs.update);

    // Update a staff with id and update only req.params included fields
    router.patch("/:id", staffs.patch);

    // Delete a staff with id
    router.delete("/:id", staffs.delete);

    // Delete all staffs - Oh no!
    router.delete("/", staffs.deleteAll);

    app.use("/api/staffs", router);
};