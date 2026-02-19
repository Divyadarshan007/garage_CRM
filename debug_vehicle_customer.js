const mongoose = require('mongoose');
require('./src/models/Garage.model');
require('./src/models/Customer.model');
require('./src/models/Vehicle.model');

const Vehicle = mongoose.model("Vehicle");
const Customer = mongoose.model("Customer");

const debugVehicleCustomer = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/garage");
        console.log("Connected to MongoDB");

        const vehicleId = "698b2e48e1922fdf62310c3b"; // Maruti from previous logs

        console.log(`\n--- Inspecting Vehicle: ${vehicleId} ---`);
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            console.log("Vehicle not found!");
            return;
        }

        console.log("Raw Vehicle Document:", JSON.stringify(vehicle, null, 2));

        if (!vehicle.customerId) {
            console.log("WARNING: customerId is MISSING or NULL on this vehicle.");
        } else {
            console.log(`\nChecking Customer ID: ${vehicle.customerId}`);
            const customer = await Customer.findById(vehicle.customerId);
            if (customer) {
                console.log("Customer found:", JSON.stringify(customer, null, 2));
            } else {
                console.log("ERROR: Customer NOT FOUND for this ID.");
            }
        }

    } catch (error) {
        console.error("Debug failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugVehicleCustomer();
