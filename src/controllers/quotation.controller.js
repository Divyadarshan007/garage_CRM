const QuotationModel = require("../models/Quotation.model");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

const createQuotation = async (req, res) => {
    const { jobcardId, garageId, services, parts, taxRate, discount, notes } = req.body;
    try {
        const subTotal = services.reduce((acc, service) => acc + Number(service.price), 0) + parts.reduce((acc, part) => acc + Number(part.price), 0);
        const taxAmount = (subTotal * taxRate) / 100;
        const grandTotal = subTotal + taxAmount - discount;
        const quotation = new QuotationModel({ jobcardId, garageId, services, parts, taxRate, discount, notes, subTotal, taxAmount, grandTotal });
        await quotation.save();
        res.status(200).json({ message: "Quotation created successfully", quotation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getQuotations = async (req, res) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);

        const [data, total] = await Promise.all([
            QuotationModel.find()
                .populate("jobcardId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            QuotationModel.countDocuments()
        ]);

        res.status(200).json({
            message: "Quotations fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateQuotation = async (req, res) => {
    try {
        const quotation = await QuotationModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Quotation updated successfully", quotation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { createQuotation, getQuotations, updateQuotation };