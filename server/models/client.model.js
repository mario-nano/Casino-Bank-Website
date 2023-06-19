const {Schema} = require("mongoose");
module.exports = mongoose => {
    const clientSchema = new mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            address: String,
            city: String,
            username: String,
            password: String,
            totalWinnings: Number
        },
        {
            timestamps: true,
        }
    );

    clientSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model('Client', clientSchema);
}
