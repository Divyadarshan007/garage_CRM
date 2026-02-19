const JobCardModel = require("../models/JobCard.model");
const VehicleModel = require("../models/Vehicle.model");
const QuotationModel = require("../models/Quotation.model");
const InvoiceModel = require("../models/Invoice.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createJobCard = async (req, res, next) => {
    try {
        console.log("adding data", req.body);
        let { jobCardNumber, customerId, vehicleId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory, vehicleNumber } = req.body;

        if (vehicleNumber) {
            const vehicle = await VehicleModel.findOne({
                vehicleNumber: vehicleNumber,
                garageId: req.garage._id
            });

            if (!vehicle) {
                const error = new Error("Vehicle not found with this number");
                error.statusCode = 404;
                throw error;
            }

            if (!vehicle.customerId) {
                const error = new Error("Vehicle does not have a linked customer");
                error.statusCode = 400;
                throw error;
            }

            vehicleId = vehicle._id;
            customerId = vehicle.customerId;
        } else {
            if (!customerId || !vehicleId) {
                const error = new Error("Either vehicleNumber or both customerId and vehicleId are required");
                error.statusCode = 400;
                throw error;
            }
        }

        const jobCard = new JobCardModel({
            jobCardNumber,
            customerId,
            vehicleId,
            garageId: req.garage._id,
            currentkm,
            vehiclePhotos,
            serviceRequested,
            specificIssue,
            status,
            statusHistory
        });
        await jobCard.save();
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}

const getJobCardsByCustomer = async (req, res, next) => {
    try {
        const { id, pageId } = req.params;
        const page = Math.max(parseInt(pageId) || 1, 1);
        const limit = 10;
        const skip = (page - 1) * limit;
        const garageId = req.garage._id;

        const [jobCards, total] = await Promise.all([
            JobCardModel.find({ customerId: id, garageId, isDeleted: { $ne: true } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            JobCardModel.countDocuments({ customerId: id, garageId, isDeleted: { $ne: true } })
        ]);

        res.status(200).json(jobCards);
    } catch (error) {
        next(error);
    }
}

const getJobCards = async (req, res, next) => {
    try {
        const { page: queryPage, limit: queryLimit, search, sortBy, sortOrder } = getPaginationParams(req);
        const { status } = req.query;

        // Handle params pagination if present
        let page = queryPage;
        let limit = queryLimit;

        if (req.params.page) {
            page = Math.max(parseInt(req.params.page) || 1, 1);
        }
        const skip = (page - 1) * limit;

        const garageId = req.garage._id;
        let filter = { garageId }; // Ensure we only get job cards for the logged-in garage

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { jobCardNumber: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } }
            ];
        }

        const [data, total] = await Promise.all([
            JobCardModel.find(filter)
                .populate("customerId", "name mobile")
                .populate("vehicleId", "vehicleNumber brand model")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            JobCardModel.countDocuments(filter)
        ]);

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}

const getJobCardDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const garageId = req.garage._id;

        const jobCard = await JobCardModel.findOne({ _id: id, garageId })
            .populate("customerId")
            .populate("vehicleId");

        if (!jobCard) {
            const error = new Error("Job card not found");
            error.statusCode = 404;
            throw error;
            // return res.status(404).json({ message: "Job card not found" });
        }

        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
};

const getJobCardQuotation = async (req, res, next) => {
    try {
        const { id } = req.params; // jobcardId
        const garageId = req.garage._id;

        const quotation = await QuotationModel.findOne({ jobcardId: id, garageId });

        // It's possible a quotation hasn't been created yet, so returning null is valid, 
        // or we can return 404. Let's return the object or null.
        if (!quotation) {
            const error = new Error("Quotation not found for this job card");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(quotation);
    } catch (error) {
        next(error);
    }
};

const getJobCardInvoice = async (req, res, next) => {
    try {
        const { id } = req.params; // jobcardId
        const garageId = req.garage._id;

        const invoice = await InvoiceModel.findOne({ jobcardId: id, garageId });

        if (!invoice) {
            const error = new Error("Invoice not found for this job card");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

const updateJobCard = async (req, res, next) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}

const deleteJobCard = async (req, res, next) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}
module.exports = { createJobCard, getJobCards, updateJobCard, deleteJobCard, getJobCardsByCustomer, getJobCardDetail, getJobCardQuotation, getJobCardInvoice };
