const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");

const { createQuotation, getQuotations, updateQuotation } = require("../controllers/quotation.controller");

router.use(protectGarage);

router.post("/", createQuotation);
router.get("/", getQuotations);
router.patch("/:id", updateQuotation);

module.exports = router;