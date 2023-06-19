const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.account = require('./account.model')(mongoose);
db.client = require('./client.model')(mongoose);
db.staff = require('./staff.model')(mongoose);
db.transaction = require('./transaction.model')(mongoose);

module.exports = db;