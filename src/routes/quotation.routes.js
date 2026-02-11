const express = require("express");
const QuotationModel = require("../models/Quotation.model");
const router = express.Router();

router.post("/", async (req, res) => {
    const { jobcardId, garageId, services, parts, taxRate, discount, notes } = req.body;
    try {
        const subTotal = services.reduce((acc, service) => acc + Number(service.price), 0) + parts.reduce((acc, part) => acc + Number(part.price), 0);
        const taxAmount = (subTotal * taxRate) / 100;
        const grandTotal = subTotal + taxAmount - discount;
        const quotation = new QuotationModel({ jobcardId, garageId, services, parts, taxRate, discount, notes, subTotal, taxAmount, grandTotal });
        await quotation.save();
        res.json(quotation);
    } catch (error) {
        res.json({ message: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const quotations = await QuotationModel.find().populate("jobcardId");
        res.json(quotations);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const quotation = await QuotationModel.findByIdAndUpdate(req.params.id, req.body);
        res.json(quotation);
    } catch (error) {
        res.json({ message: error.message });
    }
});


module.exports = router;