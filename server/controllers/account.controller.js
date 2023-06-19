const db = require("../models")
const Account = db.account;
const Client = db.client;

//CREATE
exports.create = async (req, res) => {
    const clientId = req.params.clientId;
    console.log('Client searching ' + clientId)
    const client = await Client.findById(clientId);
    console.log('Client found')
    if (!client) return res.status(404).send(`Cannot patch Client with id=${clientId}. Maybe client does not exist!`);
    // Create a new account
    const account = new Account(
        {
            name: req.body.name,
            accountType: req.body.accountType,
            balance: req.body.balance,
            interest: req.body.interest,
            overdraft: req.body.overdraft,
            clientId: client._id
        }
    );
    console.log('Creating a new account')
    account
        .save(account)
        .then(newAccount => {
            res.send(newAccount);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    "Some error occurred while creating a new account."
            });
        });
};

// Find all Accounts and sort by criteria
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

    Account
        .find({})
        .sort(sortFields)
        .limit(limit)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while sorting accounts by amount."
            });
        });
};

// Find a single Account with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Account.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Account with id " + id + " not found. Maybe account does not exist." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Account with id=" + id });
        });
};

// Find all accounts for a Client
exports.findAllByClientId = (req, res) => {
    const id = req.params.id;
    Account.find({ clientId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No accounts found for a Client with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving for a Client with id = " + id });
        });
};

// Find an account with id for a Client
exports.findByIdAndByClientId = (req, res) => {
    const id = req.params.id;
    const clientId = req.params.clientId;
    Account.find({ _id: id, client: clientId })
        .then(data => {
            if (!data || data.length === 0)
                res.status(404).send({ message: "No account with id " + id + " found for a Client with id " + clientId });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving for a Client with id = " + clientId });
        });
};

// Update an Account by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Account.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Account with id=${id}. Maybe account does not exist!`
                });
            } else res.send({ message: "Account was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Account with id=" + id
            });
        });
};

// Update an Account by the id in the request
exports.patch = async (req, res) => {
    const id = req.params.id;
    const account = await Account.findById(req.params.id).exec();
    if (!account) return res.status(404).send(`Cannot patch Account with id=${id}. Maybe account does not exist!`);

    let query = {
        accountType: account.accountType,
        balance: account.balance,
        interest: account.interest,
        overdraft: account.overdraft
    };
    let isFound = false;

    for (let key in req.body) {
        if (account[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedAccount = await Account.updateOne({_id: id}, query).exec();
        res.send('Account was updated successfully!');
    } else
        res.status(404).send(`Cannot patch Account with id=${id}. All values are same.`);
};

// Delete an Account with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Account.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Account with id=${id}. Maybe account does not exist!`
                });
            } else {
                res.send({
                    message: "Account was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Account with id=" + id
            });
        });
};

// Delete an Account with the specified id in the request
exports.deleteByIdAndByClientId = (req, res) => {
    const id = req.params.id;
    const clientId = req.params.clientId;
    Account.findByIdAndDelete({ _id: id, client: clientId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Account with id=${id} for a Client. Maybe account does not exist!`
                });
            } else {
                res.send({
                    message: "Account was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Account with id=" + id
            });
        });
};

// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
    Account.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} accounts were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all accounts."
            });
        });
};
