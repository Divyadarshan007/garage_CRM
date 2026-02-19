const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createJobCardSchema, updateJobCardSchema } = require("../validators/jobCard.validator");

const { createJobCard, getJobCards, updateJobCard, deleteJobCard, getJobCardDetail, getJobCardQuotation, getJobCardInvoice } = require("../controllers/jobcard.controller");

router.use(protectGarage);

router.post("/", validate(createJobCardSchema), createJobCard);
router.get("/:page", getJobCards);
router.get("/:id/detail", getJobCardDetail);
router.get("/:id/quotation", getJobCardQuotation);
router.get("/:id/invoice", getJobCardInvoice);
router.patch("/:id", validate(updateJobCardSchema), updateJobCard);
router.delete("/:id", deleteJobCard);

module.exports = router;