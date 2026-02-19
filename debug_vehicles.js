const mongoose = require('mongoose');
const fs = require('fs');

// Direct connection string from .env file
const MONGO_URI = "mongodb://localhost:27017/garage";

// Define simplified schemas
const VehicleSchema = new mongoose.Schema({
    garageId: { type: mongoose.Schema.Types.ObjectId, ref: "Garage" },
    brand: String
}, { strict: false });

const GarageSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String
}, { strict: false });

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
const Garage = mongoose.model("Garage", GarageSchema);

const debugSystem = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        let output = "=== VEHICLES ===\n";
        const vehicles = await Vehicle.find({});
        vehicles.forEach(v => {
            output += `Vehicle ID: ${v._id}, Garage ID: ${v.garageId}, Brand: ${v.brand}\n`;
        });

        output += "\n=== GARAGES ===\n";
        const garages = await Garage.find({});
        garages.forEach(g => {
            output += `Garage ID: ${g._id}, Name: ${g.name}, Email: ${g.email}, Mobile: ${g.mobile}\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        console.log("Output written to debug_output.txt");

    } catch (error) {
        fs.writeFileSync('debug_output.txt', `Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
    }
};

debugSystem();
