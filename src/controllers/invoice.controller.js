const Invoice = require("../models/Invoice.model");
const Quotation = require("../models/Quotation.model");
const JobCard = require("../models/JobCard.model");
const { getISTDate } = require("../utils/date.helper");

/**
 * Create an invoice from a quotation
 * @route POST /invoices/:quotationId
 */
const createInvoice = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        const garageId = req.garage._id;

        // Find the quotation
        const quotation = await Quotation.findOne({ _id: quotationId, garageId });
        if (!quotation) {
            const error = new Error("Quotation not found");
            error.statusCode = 404;
            throw error;
        }

        // Find the associated job card to get customer and vehicle details
        const jobCard = await JobCard.findById(quotation.jobcardId);
        if (!jobCard) {
            const error = new Error("Associated JobCard not found");
            error.statusCode = 404;
            throw error;
        }

        // Generate a unique invoice number for this garage
        const lastInvoice = await Invoice.findOne({ garageId }).sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastInvoice && lastInvoice.invoiceNumber) {
            const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        const invoiceNumber = `INV-${nextNumber}`;

        if (jobCard.isInvoiceCreated) {
            const error = new Error("Invoice already created for this JobCard");
            error.statusCode = 400;
            throw error;
        }

        // Create the invoice
        const invoice = new Invoice({
            invoiceNumber,
            garageId,
            jobcardId: jobCard._id,
            customerId: jobCard.customerId,
            vehicleId: jobCard.vehicleId,
            quotationId: quotation._id,
            amountPaid: 0,
            amountDue: quotation.grandTotal,
            status: "Pending"
        });

        await invoice.save();

        // Update Quotation status
        quotation.status = "approved";
        await quotation.save();

        // Update JobCard flag and statusHistory
        jobCard.isInvoiceCreated = true;
        jobCard.status = "invoiceCreated";
        jobCard.statusHistory.push({
            status: "quotationApproved",
            date: getISTDate(),
            notes: "Quotation approved automatically on invoice creation."
        });
        jobCard.statusHistory.push({
            status: "invoiceCreated",
            date: getISTDate(),
            notes: `Invoice ${invoiceNumber} created from Quotation.`
        });
        await jobCard.save();

        // Populate the invoice for the response
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate("customerId")
            .populate("vehicleId")
            .populate("quotationId");

        res.status(201).json(populatedInvoice);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all invoices for the garage
 * @route GET /invoices
 */
const getInvoices = async (req, res, next) => {
    try {
        const garageId = req.garage._id;
        const invoices = await Invoice.find({ garageId })
            .populate("customerId")
            .populate("vehicleId")
            .populate("jobcardId")
            .sort({ createdAt: -1 });

        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

/**
 * Update an invoice
 * @route PATCH /invoices/:id
 */
const updateInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const garageId = req.garage._id;

        const invoice = await Invoice.findOneAndUpdate(
            { _id: id, garageId },
            req.body,
            { new: true }
        );

        if (!invoice) {
            const error = new Error("Invoice not found");
            error.statusCode = 404;
            throw error;
        }

        // Populate the invoice for the response
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate("customerId")
            .populate("vehicleId")
            .populate("quotationId");

        // Log to jobcard statusHistory
        await JobCard.findByIdAndUpdate(invoice.jobcardId, {
            $push: {
                statusHistory: {
                    status: "Invoice Updated",
                    date: getISTDate(),
                    notes: `Invoice ${invoice.invoiceNumber} updated. Status: ${invoice.status}`
                }
            }
        });

        res.status(200).json(populatedInvoice);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    updateInvoice
};
