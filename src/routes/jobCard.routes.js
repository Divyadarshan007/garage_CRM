const express = require("express");
const JobCardModel = require("../models/JobCard.model");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("adding data", req.body);
        const { jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory } = req.body;
        const jobCard = new JobCardModel({ jobCardNumber, customerId, vehicleId, garageId, currentkm, vehiclePhotos, serviceRequested, specificIssue, status, statusHistory });
        await jobCard.save();
        res.json(jobCard);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {}
        if (status) {
            filter.status = status
        }
        const jobCards = await JobCardModel.find(filter)
        res.json({ jobCards });
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, req.body);
        res.json(jobCard);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const jobCard = await JobCardModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json(jobCard);
    } catch (error) {
        res.json({ message: error.message });
    }
});




module.exports = router;