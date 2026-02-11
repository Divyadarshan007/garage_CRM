const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice.model");
router.post("/", async (req, res) => {
    try {
        const { invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status } = req.body;
        const invoice = new Invoice({ invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status });
        await invoice.save();
        res.json(invoice);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("jobcardId").populate("customerId").populate("vehicleId").populate("quotationId");
        res.json(invoices);
    } catch (error) {
        res.json({ message: error.message });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body);
        res.json(invoice);
    } catch (error) {
        res.json({ message: error.message });
    }
});


module.exports = router;