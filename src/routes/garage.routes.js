const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");
const { protectAdminOrGarage } = require("../utils/mixedAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createGarageSchema, updateGarageSchema } = require("../validators/garage.validator");

const { createGarage, getGarages, getSubscriptions, getStatsOverview, getGarageById, updateGarage, getGarageSummary, getGarageCustomers, deleteGarage, updateGarageSubscription } = require("../controllers/garage.controller");

// Admin only routes
router.post("/", protect, validate(createGarageSchema), createGarage);
router.get("/", protect, getGarages);
router.get("/subscriptions", protect, getSubscriptions);
router.get("/stats/overview", protect, getStatsOverview);

// Mixed access routes (Admin or specific Garage)
router.get("/:id", protectAdminOrGarage, getGarageById);
router.get("/:id/summary", protectAdminOrGarage, getGarageSummary);
router.get("/:id/customers", protectAdminOrGarage, getGarageCustomers);
router.patch("/:id", protectAdminOrGarage, validate(updateGarageSchema), updateGarage);

// Admin only (resource deletion and subscription management)
router.delete("/:id", protect, deleteGarage);
router.post("/:id/subscription", protect, updateGarageSubscription);

module.exports = router;