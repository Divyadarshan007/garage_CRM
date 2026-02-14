const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createJobCard, getJobCards, updateJobCard, deleteJobCard } = require("../controllers/jobcard.controller");

router.use(protect);

router.post("/", createJobCard);
router.get("/", getJobCards);
router.patch("/:id", updateJobCard);
router.delete("/:id", deleteJobCard);

module.exports = router;