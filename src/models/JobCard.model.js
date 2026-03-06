const mongoose = require("mongoose");

const JobCardSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage"
    },
    jobCardNumber: {
        type: String,
        required: true,
        trim: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    currentkm: {
        type: Number,
        required: true,
        trim: true
    },
    vehiclePhotos: {
        type: Array,
        required: true,
        trim: true
    },
    serviceRequested: {
        type: Array,
        required: true,
        trim: true
    },
    specificIssue: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "pending",
        trim: true
    },
    statusHistory: {
        type: Array,
        default: [],
        trim: true
    },
    isQuotationCreated: {
        type: Boolean,
        default: false
    },
    isInvoiceCreated: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    })

JobCardSchema.index({ garageId: 1, jobCardNumber: 1 }, { unique: true });

const JobCard = mongoose.model("JobCard", JobCardSchema);
module.exports = JobCard;