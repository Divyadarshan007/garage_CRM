const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config();

// Import Models
const Garage = require("../src/models/Garage.model");
const Customer = require("../src/models/Customer.model");
const Vehicle = require("../src/models/Vehicle.model");
const JobCard = require("../src/models/JobCard.model");
const Quotation = require("../src/models/Quotation.model");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected for seeding...");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // 1. Clear existing data
        console.log("Clearing existing data...");
        await Garage.deleteMany({});
        await Customer.deleteMany({});
        await Vehicle.deleteMany({});
        await JobCard.deleteMany({});
        await Quotation.deleteMany({});
        console.log("Data cleared.");

        // 2. Create Garages loop
        const garageCount = 3;
        console.log(`Creating ${garageCount} Garages with related data...`);

        for (let g = 1; g <= garageCount; g++) {
            console.log(`\n--- Seeding Garage ${g} ---`);

            // Create Garage
            const garage = await Garage.create({
                name: `Garage ${g}`,
                owner: `Owner ${g}`,
                email: `garage${g}@test.com`,
                mobile: `987654321${g}`,
                password: "password123", // Will be hashed by pre-save hook
                address: {
                    street: `${g * 10} Garage St`,
                    city: `Moto City ${g}`,
                    state: "MH",
                    zipCode: `40000${g}`
                }
            });
            console.log(`Created Garage: ${garage.name} (${garage.email})`);

            // Create Customers for this Garage
            const customers = [];
            const customerCount = 5;
            for (let i = 1; i <= customerCount; i++) {
                customers.push({
                    garageId: garage._id,
                    name: `G${g} Customer ${i}`,
                    mobile: `90${g}000000${i}`, // Ensure unique mobile
                    address: `Address ${i}, City ${g}`
                });
            }
            const createdCustomers = await Customer.insertMany(customers);
            console.log(`${createdCustomers.length} Customers created for ${garage.name}.`);

            // Create Vehicles for these Customers
            const vehicles = [];
            const vehicleTypes = ["Car", "Bike"];
            const brands = ["Toyota", "Honda", "Maruti", "Hyundai", "Tata"];

            for (let k = 0; k < createdCustomers.length; k++) {
                const customer = createdCustomers[k];
                // Create 1-2 vehicles per customer
                const numVehicles = Math.floor(Math.random() * 2) + 1;
                for (let j = 0; j < numVehicles; j++) {
                    vehicles.push({
                        garageId: garage._id,
                        customerId: customer._id,
                        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
                        brand: brands[Math.floor(Math.random() * brands.length)],
                        model: `Model ${Math.floor(Math.random() * 100)}`,
                        vehicleNumber: `MH0${g}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}-${k}${j}`, // Ensure unique
                        fuelType: "Petrol"
                    });
                }
            }
            const createdVehicles = await Vehicle.insertMany(vehicles);
            console.log(`${createdVehicles.length} Vehicles created for ${garage.name}.`);

            // Create JobCards
            const jobCards = [];
            let jobCardCounter = 100 * g; // Start from different number for each garage

            // Create job cards for the first few vehicles
            const jobCardCount = Math.min(5, createdVehicles.length);
            for (let i = 0; i < jobCardCount; i++) {
                const vehicle = createdVehicles[i];
                const customer = createdCustomers.find(c => c._id.equals(vehicle.customerId));

                jobCards.push({
                    garageId: garage._id,
                    jobCardNumber: `JC-G${g}-${jobCardCounter++}`,
                    customerId: customer._id,
                    vehicleId: vehicle._id,
                    currentkm: 10000 + i * 500,
                    vehiclePhotos: ["photo1.jpg", "photo2.jpg"],
                    serviceRequested: "General Service",
                    specificIssue: "Checkup",
                    status: "Pending",
                    statusHistory: [{ status: "Pending", date: new Date(), notes: "Created" }]
                });
            }
            const createdJobCards = await JobCard.insertMany(jobCards);
            console.log(`${createdJobCards.length} JobCards created for ${garage.name}.`);

            // Create Quotations
            const quotations = [];

            for (const jobCard of createdJobCards) {
                quotations.push({
                    garageId: garage._id,
                    jobcardId: jobCard._id,
                    services: [
                        { name: "Oil Change", price: 500, qty: 1 },
                        { name: "General Checkup", price: 300, qty: 1 }
                    ],
                    parts: [
                        { name: "Engine Oil", price: 1200, qty: 1, partNumber: "OIL-001" },
                        { name: "Oil Filter", price: 200, qty: 1, partNumber: "FIL-001" }
                    ],
                    subTotal: 2200,
                    taxRate: 18,
                    taxAmount: 396,
                    grandTotal: 2596,
                    notes: "Standard service quotation"
                });
            }
            await Quotation.insertMany(quotations);
            console.log(`${quotations.length} Quotations created for ${garage.name}.`);
        }

        console.log("\nDatabase seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
