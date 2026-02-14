const mongoose = require("mongoose");
const GarageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    ownerMobile: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    ownerEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    currentSubscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null
    }
}, {
    timestamps: true
})

const Garage = mongoose.model("Garage", GarageSchema);
module.exports = Garage;