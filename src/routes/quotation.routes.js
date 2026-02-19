const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createQuotationSchema, updateQuotationSchema } = require("../validators/quotation.validator");

const { createQuotation, getQuotations, updateQuotation } = require("../controllers/quotation.controller");

router.use(protectGarage);

router.post("/", validate(createQuotationSchema), createQuotation);
router.get("/", getQuotations);
router.patch("/:id", validate(updateQuotationSchema), updateQuotation);

module.exports = router;