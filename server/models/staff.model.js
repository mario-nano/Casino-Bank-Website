module.exports = mongoose => {
    const staffSchema = new mongoose.Schema(
        {
            staffId: Number,
            firstName: String,
            lastName: String,
            address: String,
            city: String,
            username: String,
            password: String
        },
        {
            timestamps: true,
        }
    );

    staffSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });


    return mongoose.model('Staff', staffSchema)
}