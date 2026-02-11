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
        unique: true
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
        type: String,
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
        default: "Pending",
        trim: true
    },
    statusHistory: {
        type: Array,
        default: [],
        trim: true
    },

},
    {
        timestamps: true
    })

const JobCard = mongoose.model("JobCard", JobCardSchema);
module.exports = JobCard;