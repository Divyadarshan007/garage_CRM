const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage"
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true
    },
    jobcardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCard"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    quotationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quotation",
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0,
        trim: true
    },
    amountDue: {
        type: Number,
        default: 0,
        trim: true
    },
    status: {
        type: String,
        default: "Pending",
        trim: true
    },
},
    {
        timestamps: true
    })
const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;
