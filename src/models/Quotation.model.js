const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage"
    },
    jobcardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCard"
    },
    services: {
        type: Array,
        default: [],
        trim: true
    },
    parts: {
        type: Array,
        default: [],
        trim: true
    },
    taxRate: {
        type: Number,
        default: 0,
        trim: true
    },
    discount: {
        type: Number,
        default: 0,
        trim: true
    },
    notes: {
        type: String,
        default: "",
        trim: true
    },
    subTotal: {
        type: Number,
        default: 0,
        trim: true,
        required: true
    },
    taxAmount: {
        type: Number,
        default: 0,
        trim: true,
        required: true
    },
    grandTotal: {
        type: Number,
        default: 0,
        trim: true,
        required: true
    },
    approvalStatus: {
        type: String,
        default: "Pending",
        trim: true
    },
},
    {
        timestamps: true
    })


const Quotation = mongoose.model("Quotation", QuotationSchema);
module.exports = Quotation;