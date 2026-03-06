const QuotationModel = require("../models/Quotation.model");
const JobCardModel = require("../models/JobCard.model");
const { getPaginationParams } = require("../utils/pagination.helper");
const { getISTDate } = require("../utils/date.helper");

const createQuotation = async (req, res, next) => {
    const { jobcardId, services, parts, taxRate, discount, notes, status } = req.body;
    const garageId = req.garage._id;
    try {
        const subTotal = (services || []).reduce((acc, service) => acc + Number(service.price || 0), 0) +
            (parts || []).reduce((acc, part) => acc + Number(part.total || 0), 0);
        const taxAmount = (subTotal * (taxRate || 0)) / 100;
        const grandTotal = subTotal + taxAmount - (discount || 0);

        const jobCard = await JobCardModel.findById(jobcardId);
        if (!jobCard) {
            const error = new Error("Job card not found");
            error.statusCode = 404;
            throw error;
        }

        if (jobCard.isQuotationCreated) {
            const error = new Error("Quotation already created for this JobCard");
            error.statusCode = 400;
            throw error;
        }

        const quotation = new QuotationModel({
            jobcardId,
            garageId,
            customerId: jobCard.customerId,
            vehicleId: jobCard.vehicleId,
            services,
            parts,
            taxRate,
            discount,
            notes,
            subTotal,
            taxAmount,
            grandTotal,
            status: status || "draft"
        });
        await quotation.save();

        // Update JobCard flag and statusHistory
        jobCard.isQuotationCreated = true;
        jobCard.status = "quotationCreated";
        jobCard.statusHistory.push({
            status: "Quotation Created",
            date: getISTDate(),
            notes: `Quotation created with total: ${grandTotal}.`
        });
        await jobCard.save();

        const populatedQuotation = await QuotationModel.findById(quotation._id)
            .populate("customerId")
            .populate("vehicleId");

        res.status(200).json(populatedQuotation);
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
                .populate("customerId")
                .populate("vehicleId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            QuotationModel.countDocuments({ garageId: req.garage._id })
        ]);

        res.status(200).json(data);
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

        // Log to jobcard statusHistory
        await JobCardModel.findByIdAndUpdate(quotation.jobcardId, {
            $push: {
                statusHistory: {
                    status: "Quotation Updated",
                    date: getISTDate(),
                    notes: `Quotation details were modified. Status: ${quotation.status || "Unknown"}`
                }
            }
        });

        const populatedQuotation = await QuotationModel.findById(quotation._id)
            .populate("customerId")
            .populate("vehicleId");

        res.status(200).json(populatedQuotation);
    } catch (error) {
        next(error);
    }
}
module.exports = { createQuotation, getQuotations, updateQuotation };