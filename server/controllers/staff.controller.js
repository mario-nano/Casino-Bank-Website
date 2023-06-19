const db = require("../models")
const Staff = db.staff;

//CREATE
exports.create = (req, res) => {
    // Create a new Staff
    const staff = new Staff(
        {
            _id: req.body._id,
            staffId: req.body.staffId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            city: req.body.city,
            username: req.body.username,
            password: req.body.password
        }
    );

    // Save staff into db
    staff
        .save(staff)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    "Some error occurred while creating a new Staff."
            });
        });
};

// Find all Staffs
exports.findAll = (req, res) => {
    Staff.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving staffs."
            });
        });
};

// Find a single Staff with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Staff.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Staff with id " + id + " not found. Maybe staff does not exist." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Staff with id=" + id });
        });
};

// Update a Staff by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Staff.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Staff with id=${id}. Maybe staff does not exist!`
                });
            } else res.send({ message: "Staff was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Staff with id=" + id
            });
        });
};

// Update a Staff by the id in the request
exports.patch = async (req, res) => {
    const id = req.params.id;
    const staff = await Staff.findById(req.params.id).exec();
    if (!staff) return res.status(404).send(`Cannot patch Staff with id=${id}. Maybe staff does not exist!`);

    let query = {
        _id: staff.id,
        staffId: staff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        address: staff.address,
        city: staff.city,
        username: staff.username,
        password: staff.password
    };
    let isFound = false;

    for (let key in req.body) {
        if (staff[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedStaff = await Staff.updateOne({_id: id}, query).exec();
        res.send('Staff was updated successfully!');
    } else
        res.status(404).send(`Cannot patch Staff with id=${id}. All values are same.`);
};

// Delete a Staff with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Staff.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Staff with id=${id}. Maybe staff does not exist!`
                });
            } else {
                res.send({
                    message: "Staff was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Staff with id=" + id
            });
        });
};

// Delete all Staffs from the database.
exports.deleteAll = (req, res) => {
    Staff.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} staffs were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all staffs."
            });
        });
};