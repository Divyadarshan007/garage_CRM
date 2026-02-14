const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const SubscriptionPlan = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
module.exports = SubscriptionPlan;
