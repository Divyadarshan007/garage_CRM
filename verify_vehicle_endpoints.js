const mongoose = require('mongoose');
require('./src/models/Garage.model');
require('./src/models/Customer.model');
require('./src/models/Vehicle.model');
require('./src/models/JobCard.model');
const { getAllVehicles, getVehicleDetail, getVehicleJobCards } = require('./src/controllers/vehicle.controller');

// Mock Express objects
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        console.log(`\n[${res.statusCode}] Response Body:`);
        console.log(JSON.stringify(data, null, 2));
        return res;
    };
    return res;
};

const mockNext = (error) => {
    console.error("\n[Error] Next called with:", error);
};

const JobCard = mongoose.model("JobCard");

const runVerification = async () => {
    let tempJobCardId;
    try {
        // Connect to DB
        await mongoose.connect("mongodb://localhost:27017/garage");
        console.log("Connected to MongoDB");

        const garageId = "698b2a87cbb1f292706501aa"; // Super Garage
        const vehicleId = "698b2e48e1922fdf62310c3b"; // Maruti

        // 1. Verify getAllVehicles with pageId 1
        console.log("\n--- Testing getAllVehicles (Page 1) ---");
        const req1 = {
            params: { pageId: 1 },
            query: {},
            garage: { _id: garageId }
        };
        await getAllVehicles(req1, mockRes(), mockNext);

        // 1b. Verify getAllVehicles with pageId 2 (should be empty or less)
        console.log("\n--- Testing getAllVehicles (Page 2) ---");
        const req1b = {
            params: { pageId: 2 },
            query: {},
            garage: { _id: garageId }
        };
        await getAllVehicles(req1b, mockRes(), mockNext);

        // 2. Verify getVehicleDetail
        console.log("\n--- Testing getVehicleDetail ---");
        const req2 = {
            params: { id: vehicleId },
            garage: { _id: garageId }
        };
        await getVehicleDetail(req2, mockRes(), mockNext);

        // Create a temp JobCard
        const tempJobCard = new JobCard({
            garageId,
            vehicleId,
            jobCardNumber: "TEST-JC-001",
            currentkm: 10000,
            vehiclePhotos: [],
            serviceRequested: "Test Service",
            specificIssue: "Test Issue",
            status: "Pending"
        });
        await tempJobCard.save();
        tempJobCardId = tempJobCard._id;
        console.log(`\nCreated temp JobCard: ${tempJobCardId}`);

        // 3. Verify getVehicleJobCards
        console.log("\n--- Testing getVehicleJobCards ---");
        const req3 = {
            params: { id: vehicleId, pageId: 1 },
            garage: { _id: garageId }
        };
        await getVehicleJobCards(req3, mockRes(), mockNext);

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        // Cleanup
        if (tempJobCardId) {
            await JobCard.findByIdAndDelete(tempJobCardId);
            console.log("Deleted temp JobCard");
        }
        await mongoose.disconnect();
    }
};

runVerification();
