const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true
    },
    subscriptionId: {
        type: String,
        required: true,
        unique: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true
    },
    durationDays: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active"
    }
}, {
    timestamps: true
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;
