const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    vehicleType: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    fuelType: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    }
},
    {
        timestamps: true
    })

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;
