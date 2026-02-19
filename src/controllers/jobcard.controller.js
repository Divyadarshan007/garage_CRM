const JobCardModel = require("../models/JobCard.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createJobCard = async (req, res, next) => {
    try {
        console.log("adding data", req.body);
        const { jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory } = req.body;
        const jobCard = new JobCardModel({ jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory });
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
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);
        const { status } = req.query;

        let filter = {};
        if (status) {
            filter.status = status;
        }

        const [data, total] = await Promise.all([
            JobCardModel.find(filter)
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
module.exports = { createJobCard, getJobCards, updateJobCard, deleteJobCard, getJobCardsByCustomer };
