const {Schema} = require("mongoose");
module.exports = mongoose => {
    const transactionSchema = new mongoose.Schema(
        {
            clientId: {
                type: Schema.Types.ObjectId,
                ref: 'Client'
            },
            transactionType: String,
            amount: Number,
            accountId: {
                type: Schema.Types.ObjectId,
                ref: 'Account'
            },
            recipientAccountId: {
                type: Schema.Types.ObjectId,
                ref: 'Account'
            },
            state: String
        },
        {
            timestamps: true,
        }
    );

    transactionSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model('Transaction', transactionSchema)
}
