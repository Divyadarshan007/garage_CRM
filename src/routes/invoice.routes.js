const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { updateInvoiceSchema } = require("../validators/invoice.validator");
const invoiceController = require("../controllers/invoice.controller");

router.use(protectGarage);

// Create invoice from quotation
router.post("/:quotationId", invoiceController.createInvoice);

// Get all invoices
router.get("/", invoiceController.getInvoices);

// Update invoice
router.patch("/:id", validate(updateInvoiceSchema), invoiceController.updateInvoice);

module.exports = router;
