const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");

const { createJobCard, getJobCards, updateJobCard, deleteJobCard } = require("../controllers/jobcard.controller");

router.use(protectGarage);

router.post("/", createJobCard);
router.get("/", getJobCards);
router.patch("/:id", updateJobCard);
router.delete("/:id", deleteJobCard);

module.exports = router;