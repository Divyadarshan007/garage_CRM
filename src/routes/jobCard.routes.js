const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createJobCardSchema, updateJobCardSchema } = require("../validators/jobCard.validator");

const {
    createJobCard,
    getJobCards,
    updateJobCard,
    updateJobCardStatus,
    deleteJobCard,
    getJobCardDetail,
    getJobCardQuotation,
    getJobCardInvoice
} = require("../controllers/jobcard.controller");

router.use(protectGarage);

router.post("/", validate(createJobCardSchema), createJobCard);
router.get("/:page", getJobCards);
router.get("/:id/detail", getJobCardDetail);
router.get("/:id/quotations", getJobCardQuotation);
router.get("/:id/invoices", getJobCardInvoice);
router.post("/:id/status", validate(require("../validators/jobCard.validator").updateJobCardStatusSchema), updateJobCardStatus);
router.patch("/:id", validate(updateJobCardSchema), updateJobCard);
router.delete("/:id", deleteJobCard);

module.exports = router;