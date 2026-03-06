const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createPaymentSchema, updatePaymentSchema } = require("../validators/payment.validator");
const {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require("../controllers/payment.controller");

router.use(protectGarage);

router.post("/", validate(createPaymentSchema), createPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.patch("/:id", validate(updatePaymentSchema), updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
