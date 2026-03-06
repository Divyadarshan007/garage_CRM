const Payment = require("../models/Payment.model");
const Invoice = require("../models/Invoice.model");
const JobCard = require("../models/JobCard.model");
const { getPaginationParams } = require("../utils/pagination.helper");
const { getISTDate } = require("../utils/date.helper");

const createPayment = async (req, res, next) => {
    try {
        const { invoiceId, jobcardId, paymentMode, amount, discountAmount, notes } = req.body;
        const garageId = req.garage._id;

        const payment = new Payment({
            garageId,
            invoiceId,
            jobcardId,
            paymentMode,
            amount,
            discountAmount,
            notes
        });

        await payment.save();

        // Update Invoice (include discount in the effective payment)
        const invoice = await Invoice.findById(invoiceId);
        if (invoice) {
            const discount = discountAmount || 0;
            const effectivePayment = amount + discount;

            invoice.amountPaid += amount;
            invoice.discountAmount = (invoice.discountAmount || 0) + discount;
            invoice.amountDue = Math.max(0, invoice.amountDue - effectivePayment);

            if (invoice.amountDue === 0) {
                invoice.status = "Paid";
            } else if (invoice.amountPaid > 0) {
                invoice.status = "Partially Paid";
            }
            await invoice.save();

            // Update JobCard Status History
            const jobCard = await JobCard.findById(jobcardId);
            if (jobCard) {
                const statusHistoryEntry = {
                    status: invoice.amountDue === 0 ? "Payment Received" : "Partial Payment Received",
                    date: getISTDate(),
                    notes: `Payment of ₹${amount} received via ${paymentMode}${discount > 0 ? `, Discount: ₹${discount}` : ""}. Remaining due: ₹${invoice.amountDue}`
                };

                const updateData = {
                    $push: { statusHistory: statusHistoryEntry }
                };

                if (invoice.amountDue === 0) {
                    updateData.status = "paid";
                }

                await JobCard.findByIdAndUpdate(jobcardId, updateData);
            }
        }

        const populatedPayment = await Payment.findById(payment._id)

        res.status(201).json(populatedPayment);
    } catch (error) {
        next(error);
    }
};

const getPayments = async (req, res, next) => {
    try {
        const { limit, skip, sortBy, sortOrder } = getPaginationParams(req);
        const garageId = req.garage._id;

        const [data, total] = await Promise.all([
            Payment.find({ garageId })
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Payment.countDocuments({ garageId })
        ]);

        res.status(200).json({
            data,
            total,
            limit
        });
    } catch (error) {
        next(error);
    }
};

const getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, garageId: req.garage._id })

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

const updatePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            { _id: req.params.id, garageId: req.garage._id },
            req.body,
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const populatedPayment = await Payment.findById(payment._id)

        res.status(200).json(populatedPayment);
    } catch (error) {
        next(error);
    }
};

const deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOneAndDelete({ _id: req.params.id, garageId: req.garage._id });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
