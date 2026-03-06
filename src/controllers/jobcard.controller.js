const mongoose = require("mongoose");
const JobCardModel = require("../models/JobCard.model");
const VehicleModel = require("../models/Vehicle.model");
const QuotationModel = require("../models/Quotation.model");
const InvoiceModel = require("../models/Invoice.model");
const { getPaginationParams } = require("../utils/pagination.helper");
const { moveFiles } = require("../utils/fileMover");
const { getISTDate } = require("../utils/date.helper");
const path = require("path");

const STATUS_LABELS = {
    "pending": "Jobcard Pending",
    "quotationCreated": "Quotation Created",
    "quotationApproved": "Quotation Approved",
    "inProgress": "Work in Progress",
    "completed": "Work Completed",
    "invoiceCreated": "Invoice Created",
    "paid": "Payment Received"
};

const SIMPLE_STATUS_LABELS = {
    "pending": "pending",
    "quotationCreated": "quotation created",
    "quotationApproved": "quotation approved",
    "inProgress": "in progress",
    "completed": "completed",
    "invoiceCreated": "invoice created",
    "paid": "paid"
};


const createJobCard = async (req, res, next) => {
    try {
        console.log("adding data", req.body);
        const { customerId, vehicleId, currentkm, serviceRequested, specificIssue, status, statusHistory } = req.body;
        let { vehiclePhotos } = req.body;

        const garageId = req.body.garageId || req.garage._id;

        // Move photos from temp to jobcard folder
        if (vehiclePhotos && Array.isArray(vehiclePhotos)) {
            vehiclePhotos = await moveFiles(vehiclePhotos, 'uploads/jobcard');
        }



        // Find the last created jobcard for this garage
        const lastJobCard = await JobCardModel.findOne({ garageId: garageId })
            .sort({ createdAt: -1 });

        let nextNumber = 1;
        if (lastJobCard && lastJobCard.jobCardNumber) {
            // Extract the number from format "JC-X"
            const match = lastJobCard.jobCardNumber.match(/JC-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const autoJobCardNumber = `JC-${nextNumber}`;

        const jobCard = new JobCardModel({
            jobCardNumber: autoJobCardNumber,
            customerId,
            vehicleId,
            garageId: garageId,
            currentkm,
            vehiclePhotos,
            serviceRequested,
            specificIssue,
            status: status || "pending",
            statusHistory: [{
                status: "Jobcard Created",
                date: getISTDate(),
                notes: `Jobcard ${autoJobCardNumber} initiated.`
            }]
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

        let page = queryPage;
        let limit = queryLimit;

        if (req.params.page) {
            page = Math.max(parseInt(req.params.page) || 1, 1);
        }
        const skip = (page - 1) * limit;
        const garageId = new mongoose.Types.ObjectId(req.garage._id);

        const pipeline = [
            { $match: { garageId, isDeleted: { $ne: true } } }
        ];

        if (status) {
            pipeline.push({ $match: { status: { $regex: new RegExp(`^${status}$`, "i") } } });
        }

        // Join with Customer
        pipeline.push({
            $lookup: {
                from: "customers",
                localField: "customerId",
                foreignField: "_id",
                as: "customerId"
            }
        });
        pipeline.push({ $unwind: { path: "$customerId", preserveNullAndEmptyArrays: true } });

        // Join with Vehicle
        pipeline.push({
            $lookup: {
                from: "vehicles",
                localField: "vehicleId",
                foreignField: "_id",
                as: "vehicleId"
            }
        });
        pipeline.push({ $unwind: { path: "$vehicleId", preserveNullAndEmptyArrays: true } });

        // Search Filter
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { jobCardNumber: { $regex: search, $options: "i" } },
                        { "customerId.name": { $regex: search, $options: "i" } },
                        { "vehicleId.vehicleNumber": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }

        // Clone pipeline for count before pagination
        const countPipeline = [...pipeline, { $count: "total" }];

        // Sort, Skip, Limit
        pipeline.push({ $sort: { [sortBy]: sortOrder } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        const [data, countResult] = await Promise.all([
            JobCardModel.aggregate(pipeline),
            JobCardModel.aggregate(countPipeline)
        ]);

        const total = countResult.length > 0 ? countResult[0].total : 0;

        res.status(200).json(data);
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

        const quotations = await QuotationModel.find({ jobcardId: id, garageId })
            .populate("customerId")
            .populate("vehicleId");

        res.status(200).json(quotations);
    } catch (error) {
        next(error);
    }
};

const getJobCardInvoice = async (req, res, next) => {
    try {
        const { id } = req.params; // jobcardId
        const garageId = req.garage._id;

        const invoices = await InvoiceModel.find({ jobcardId: id, garageId })
            .populate("customerId")
            .populate("vehicleId")
            .populate("quotationId");

        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

const updateJobCard = async (req, res, next) => {
    try {
        let updateData = { ...req.body };

        // Move photos from temp to jobcard folder if present in update
        if (updateData.vehiclePhotos && Array.isArray(updateData.vehiclePhotos)) {
            updateData.vehiclePhotos = await moveFiles(updateData.vehiclePhotos, 'uploads/jobcard');
        }

        const jobCardBefore = await JobCardModel.findById(req.params.id);
        if (!jobCardBefore) {
            const error = new Error("Job card not found");
            error.statusCode = 404;
            throw error;
        }

        const statusHistoryEntry = {
            date: getISTDate(),
            status: "Jobcard updated",
            notes: "Jobcard details were updated."
        };

        if (updateData.status && updateData.status !== jobCardBefore.status) {
            statusHistoryEntry.status = STATUS_LABELS[updateData.status] || "Status updated";
            statusHistoryEntry.notes = `Status changed from ${SIMPLE_STATUS_LABELS[jobCardBefore.status] || jobCardBefore.status} to ${SIMPLE_STATUS_LABELS[updateData.status] || updateData.status}.`;
        }

        const jobCard = await JobCardModel.findByIdAndUpdate(
            req.params.id,
            {
                ...updateData,
                $push: { statusHistory: statusHistoryEntry }
            },
            { new: true }
        );
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}


const deleteJobCard = async (req, res, next) => {
    try {
        const statusHistoryEntry = {
            status: "Jobcard deleted",
            date: getISTDate(),
            notes: "Jobcard was marked as deleted."
        };

        const jobCard = await JobCardModel.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                $push: { statusHistory: statusHistoryEntry }
            },
            { new: true }
        );
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}
const updateJobCardStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const garageId = req.garage._id;

        const jobCard = await JobCardModel.findOne({ _id: id, garageId }).populate("customerId").populate("vehicleId");

        if (!jobCard) {
            const error = new Error("Job card not found");
            error.statusCode = 404;
            throw error;
        }

        if (jobCard.status === status) {
            return res.status(200).json(jobCard);
        }

        const oldStatus = jobCard.status;
        jobCard.status = status;

        jobCard.statusHistory.push({
            status: STATUS_LABELS[status] || "Status updated",
            date: getISTDate(),
            notes: notes || `Status changed from ${SIMPLE_STATUS_LABELS[oldStatus] || oldStatus} to ${SIMPLE_STATUS_LABELS[status] || status}.`
        });

        await jobCard.save();
        res.status(200).json(jobCard);
    } catch (error) {
        next(error);
    }
}

module.exports = { createJobCard, getJobCards, updateJobCard, updateJobCardStatus, deleteJobCard, getJobCardsByCustomer, getJobCardDetail, getJobCardQuotation, getJobCardInvoice };
