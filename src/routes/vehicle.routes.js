const express = require("express");
const VehicleModel = require("../models/Vehicle.model");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted } = req.body;
        const vehicle = new VehicleModel({ customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted });
        await vehicle.save();
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const vehicles = await VehicleModel.find();
        res.json(vehicles);
    } catch (error) {
        res.json({ message: error.message });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, req.body);
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error.message });
    }
});


module.exports = router;