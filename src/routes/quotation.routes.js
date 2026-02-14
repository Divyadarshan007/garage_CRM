const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createQuotation, getQuotations, updateQuotation } = require("../controllers/quotation.controller");

router.use(protect);

router.post("/", createQuotation);
router.get("/", getQuotations);
router.patch("/:id", updateQuotation);

module.exports = router;