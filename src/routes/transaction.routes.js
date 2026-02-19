const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createTransactionSchema, updateTransactionSchema } = require("../validators/transaction.validator");

const { createTransaction, getTransactions, updateTransaction, deleteTransaction, getTransactionStats } = require("../controllers/transaction.controller");

router.use(protectGarage);

// CRUD routes
router.post("/", validate(createTransactionSchema), createTransaction);
router.get("/", getTransactions);
router.get("/stats", getTransactionStats);
router.patch("/:id", validate(updateTransactionSchema), updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;