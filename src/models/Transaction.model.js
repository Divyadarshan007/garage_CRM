const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    paymentMode: {
        type: String,
        required: true,
        trim: true
    },
    paymentDate: {
        type: Date,
        default: Date.now,
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
    })

module.exports = mongoose.model("Transaction", TransactionSchema);