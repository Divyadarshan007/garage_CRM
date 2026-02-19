const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createInvoiceSchema, updateInvoiceSchema } = require("../validators/invoice.validator");
const Invoice = require("../models/Invoice.model");
const { getPaginationParams } = require("../utils/pagination.helper");

router.use(protectGarage);

router.post("/", validate(createInvoiceSchema), async (req, res, next) => {
    try {
        const { invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status } = req.body;
        const invoice = new Invoice({ invoiceNumber, jobcardId, customerId, vehicleId, quotationId, garageId, amountPaid, amountDue, status });
        await invoice.save();
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
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

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
});


router.patch("/:id", validate(updateInvoiceSchema), async (req, res, next) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
});


module.exports = router;