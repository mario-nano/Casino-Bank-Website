const db = require("../models")
const Client = db.client;
const Account = db.account;

//CREATE
exports.create = (req, res) => {
    // Validate Client model
    if (
        !req.body.firstName || req.body.firstName === '' || req.body.firstName === undefined ||
        !req.body.lastName || req.body.lastName === '' || req.body.lastName === undefined ||
        !req.body.address || req.body.address === '' || req.body.address === undefined ||
        !req.body.city || req.body.city === '' || req.body.city === undefined ||
        !req.body.username || req.body.username === '' || req.body.username === undefined ||
        !req.body.password || req.body.password === '' || req.body.password === undefined
    ) {
        res.status(400).send({ message: "Client information not complete! Please check all fields." });
        return;
    }

    Client.exists({ username: req.body.username}, function (err, client) {
        if (err){
            console.log(err)
        } else if (client) {
            res.status(400).send({ message: "Username already exists!" });
        } else {
            // Create a new client
            const client = new Client(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    address: req.body.address,
                    city: req.body.city,
                    username: req.body.username,
                    password: req.body.password,
                    totalWinnings: 0
                }
            );

            // Save client into db
            client
                .save(client)
                .then(data => {
                    res.status(200).send({
                        message:
                            "A new client successfully created."
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            "Some error occurred while creating a new Client."
                    });
                });
        }
    })
};

// Find all Clients
exports.findAll = (req, res) => {
    let sortFields = {}
    let limit = 0;
    if (req.query.sort !== undefined) {
        const sort = JSON.parse(req.query.sort);
        const fields = Object.keys(sort);
        fields.forEach(field =>
            sortFields[field] = sort[field] === '1' ? 1: -1
        );
    }

    if (req.query.limit !== undefined) {
        limit = parseInt(req.query.limit);
    }
    Client
        .find()
        .sort(sortFields)
        .limit(limit)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving clients."
            });
        });
};

// Find a single Client with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Client.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Client with id " + id + " not found. Maybe client does not exist." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Client with id=" + id });
        });
};

// Update a Client by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Client with id=${id}. Maybe Client does not exist!`
                });
            } else res.send({ message: "Client was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Client with id=" + id
            });
        });
};

// Update a Client by the id in the request
exports.patch = async (req, res) => {
    const id = req.params.id;
    const client = await Client.findById(req.params.id).exec();
    if (!client) return res.status(404).send(`Cannot patch Client with id=${id}. Maybe client does not exist!`);

    let query = {
        firstName: client.firstName,
        lastName: client.lastName,
        address: client.address,
        city: client.city,
        username: client.username,
        password: client.password
    };
    let isFound = false;

    for (let key in req.body) {
        if (client[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedClient = await Client.updateOne({_id: id}, query).exec();
        res.send('Client was updated successfully!');
    } else
        res.status(404).send(`Cannot patch Client with id=${id}. All values are same.`);
};

// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Client.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Client with id=${id}. Maybe client does not exist!`
                });
            } else {
                res.send({
                    message: "Client was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Client with id=" + id
            });
        });
};

// Delete all Clients from the database.
exports.deleteAll = (req, res) => {
    Client.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} clients were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all clients."
            });
        });
};
