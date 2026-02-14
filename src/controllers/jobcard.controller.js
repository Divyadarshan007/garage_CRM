const JobCardModel = require("../models/JobCard.model");

const createJobCard = async (req, res) => {
    try {
        console.log("adding data", req.body);
        const { jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory } = req.body;
        const jobCard = new JobCardModel({ jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory });
        await jobCard.save();
        res.status(200).json({ message: "Job Card created successfully", jobCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getJobCards = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {}
        if (status) {
            filter.status = status
        }
        const jobCards = await JobCardModel.find(filter)
        res.status(200).json({ message: "Job Cards fetched successfully", jobCards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateJobCard = async (req, res) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Job Card updated successfully", jobCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteJobCard = async (req, res) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ message: "Job Card deleted successfully", jobCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { createJobCard, getJobCards, updateJobCard, deleteJobCard };