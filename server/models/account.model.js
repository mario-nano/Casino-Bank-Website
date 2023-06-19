const {Schema} = require("mongoose");
module.exports = mongoose => {
    const accountSchema = new mongoose.Schema(
        {
            name: String,
            accountType: String,
            balance: Number,
            interest: Number,
            overdraft: Number,
            clientId: {
                type: Schema.Types.ObjectId,
                ref: 'Client'
            }
        },
        {
            timestamps: true,
        }
    );

    accountSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Account", accountSchema);
}
