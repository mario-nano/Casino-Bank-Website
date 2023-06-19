const db = require("../models");
const Transaction = db.transaction;

//CREATE
exports.create = (req, res) => {
  // Create a new transaction
  const transaction = new Transaction({
    clientId: req.body.clientId,
    transactionType: req.body.transactionType,
    amount: req.body.amount,
    accountId: req.body.accountId,
    recipientAccountId: req.body.recipientAccountId,
    state: req.body.state
  });

  // Save transaction into db
  transaction
    .save(transaction)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while creating a new Transaction: " + err.message,
      });
    });
};

// Find all Transactions and sort by criteria
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

  Transaction
      .find({})
      .sort(sortFields)
      .limit(limit)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while sorting transactions."
        });
      });
};

// Find a single Transaction with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Transaction.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message:
              "Transaction with id " +
              id +
              " not found. Maybe transaction does not exist.",
          });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Transaction with id=" + id });
    });
};

// Find all accounts for a Client
exports.findAllByClientId = (req, res) => {
  const id = req.params.id;
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

  Transaction
      .find({ clientId: id })
      .sort(sortFields)
      .limit(limit)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "No transactions found for a Client with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving transactions for a Client with id = " + id });
      });
};

// Update a Transaction by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Transaction.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Transaction with id=${id}. Maybe transaction does not exist!`,
        });
      } else res.send({ message: "Transaction was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Transaction with id=" + id,
      });
    });
};

// Update a Transaction by the id in the request
exports.patch = async (req, res) => {
  const id = req.params.id;
  const transaction = await Transaction.findById(req.params.id).exec();
  if (!transaction)
    return res
      .status(404)
      .send(
        `Cannot patch Transaction with id=${id}. Maybe transaction does not exist!`
      );

  let query = {
    _id: transaction._id,
    transactionId: transaction.transactionId,
    transactionType: transaction.transactionType,
    amount: transaction.amount,
    clientId: transaction.clientId,
    recipientId: transaction.recipientId,
    state: transaction.state,
  };
  let isFound = false;

  for (let key in req.body) {
    if (transaction[key] !== req.body[key]) {
      // Check if field exists
      isFound = true;
      query[key] = req.body[key];
    }
  }

  if (isFound) {
    const updatedTransaction = await Transaction.updateOne(
      { _id: id },
      query
    ).exec();
    res.send("Transaction was updated successfully!");
  } else
    res
      .status(404)
      .send(`Cannot patch Transaction with id=${id}. All values are same.`);
};

// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Transaction.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Transaction with id=${id}. Maybe transaction does not exist!`,
        });
      } else {
        res.send({
          message: "Transaction was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Transaction with id=" + id,
      });
    });
};

// Delete all Transaction from the database.
exports.deleteAll = (req, res) => {
  Transaction.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} transactions were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all transactions.",
      });
    });
};
