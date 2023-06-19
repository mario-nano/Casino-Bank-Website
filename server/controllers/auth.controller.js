const db = require("../models");
const Client = db.client;
const Account = db.account;
const Transaction = db.transaction;

exports.login = (req, res) => {
    Client.findOne({
        username: req.body.username
    })
        .exec((err, client) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            // If client is not found in database
            if (!client) {
                return res.status(404).send({ message: "Client not found." });
            }

            // If client password does not match requested password
            if (req.body.password !== client.password) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            res.status(200).send({
                id: client._id,
                username: client.username,
                firstName: client.firstName,
                lastName: client.lastName,
                totalWinnings: client.totalWinnings,
                memberSince: client.createdAt
            });
        });
};
