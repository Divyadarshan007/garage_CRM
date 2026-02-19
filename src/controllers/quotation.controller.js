const QuotationModel = require("../models/Quotation.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createQuotation = async (req, res, next) => {
    const { jobcardId, services, parts, taxRate, discount, notes } = req.body;
    const garageId = req.garage._id;
    try {
        const subTotal = services.reduce((acc, service) => acc + Number(service.price), 0) + parts.reduce((acc, part) => acc + Number(part.price), 0);
        const taxAmount = (subTotal * taxRate) / 100;
        const grandTotal = subTotal + taxAmount - discount;
        const quotation = new QuotationModel({ jobcardId, garageId, services, parts, taxRate, discount, notes, subTotal, taxAmount, grandTotal });
        await quotation.save();
        res.status(200).json(quotation);
    } catch (error) {
        next(error);
    }
}

const getQuotations = async (req, res, next) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);

        const [data, total] = await Promise.all([
            QuotationModel.find({ garageId: req.garage._id })
                .populate("jobcardId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            QuotationModel.countDocuments({ garageId: req.garage._id })
        ]);

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}

const updateQuotation = async (req, res, next) => {
    try {
        const quotation = await QuotationModel.findOneAndUpdate(
            { _id: req.params.id, garageId: req.garage._id },
            req.body,
            { new: true }
        );
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found or unauthorized" });
        }
        res.status(200).json(quotation);
    } catch (error) {
        next(error);
    }
}
module.exports = { createQuotation, getQuotations, updateQuotation };