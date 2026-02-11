const mongoose = require("mongoose");
const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
}

module.exports = connectDB;