const express = require("express");
const router = express.Router();
const Garage = require("../models/Garage.model");
const Customer = require("../models/Customer.model");
const Quotation = require("../models/Quotation.model");
const JobCard = require("../models/JobCard.model");
const Vehicle = require("../models/Vehicle.model");
const Invoice = require("../models/Invoice.model");
router.post("/", async (req, res) => {
    try {
        const { name, ownerName, ownerMobile, ownerEmail, address, logo } = req.body;
        const garage = new Garage({ name, ownerName, ownerMobile, ownerEmail, address, logo });
        await garage.save();
        res.json(garage);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const garages = await Garage.find();
        res.json(garages);
    } catch (error) {
        res.json({ message: error.message });
    }
});



router.get("/:id/summary", async (req, res) => {
    try {
        const garageId = req.params.id;

        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }

        const [
            totalCustomers,
            totalVehicles,
            totalJobCards,
            totalQuotations,
            totalInvoices,
        ] = await Promise.all([
            Customer.countDocuments({ garageId }),
            Vehicle.countDocuments({ garageId }),
            JobCard.countDocuments({ garageId }),
            Quotation.countDocuments({ garageId }),
            Invoice.countDocuments({ garageId }),

        ]);

        res.json({
            garageId,
            totalCustomers,
            totalVehicles,
            totalJobCards,
            totalQuotations,
            totalInvoices,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/:id/customers", async (req, res) => {
    const customers = await Customer.find({ garageId: req.params.id });
    res.json({ customers });
});

router.patch("/:id", async (req, res) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, req.body);
        res.json(garage);
    } catch (error) {
        res.json({ message: error.message });
    }
});




module.exports = router;