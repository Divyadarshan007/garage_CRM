const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    mobile: {
        type: Number,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    })


const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
