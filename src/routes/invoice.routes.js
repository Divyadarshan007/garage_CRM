const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const Invoice = require("../models/Invoice.model");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

router.use(protectGarage);

router.post("/", async (req, res) => {
    try {
        const { invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status } = req.body;
        const invoice = new Invoice({ invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status });
        await invoice.save();
        res.status(200).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);

        const [data, total] = await Promise.all([
            Invoice.find()
                .populate("jobcardId")
                .populate("customerId")
                .populate("vehicleId")
                .populate("quotationId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Invoice.countDocuments()
        ]);

        res.status(200).json({
            message: "Invoices fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;