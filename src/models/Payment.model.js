const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },
    jobcardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCard",
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["cash", "upi", "card", "bank_transfer"],
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    discountAmount: {
        type: Number,
        default: 0,
        trim: true
    },
    notes: {
        type: String,
        default: "",
        trim: true
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Payment", PaymentSchema);
