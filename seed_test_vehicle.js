const mongoose = require('mongoose');
const Vehicle = require('./src/models/Vehicle.model');

const MONGO_URI = "mongodb://localhost:27017/garage";

// ID from debug_output.txt for "test garage" (email: test@garage.com)
const TARGET_GARAGE_ID = "6990733b2ae4477feddb0b69";

const seedVehicle = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const newVehicle = new Vehicle({
            garageId: TARGET_GARAGE_ID,
            customerId: new mongoose.Types.ObjectId(), // Creating a dummy customer ID for now
            vehicleType: "Car",
            brand: "Hyundai",
            model: "Creta",
            vehicleNumber: "KA-01-AB-1234",
            fuelType: "Petrol",
            isDeleted: false
        });

        await newVehicle.save();
        console.log(`Successfully created a vehicle for garage ID: ${TARGET_GARAGE_ID}`);
        console.log("You should now see details when calling getAllVehicles!");

    } catch (error) {
        console.error("Error creating vehicle:", error);
    } finally {
        await mongoose.disconnect();
    }
};

seedVehicle();
