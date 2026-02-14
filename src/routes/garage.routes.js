const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createGarage, getGarages, getSubscriptions, getStatsOverview, getGarageById, updateGarage, getGarageSummary, getGarageCustomers, deleteGarage, updateGarageSubscription } = require("../controllers/garage.controller");

router.use(protect);

router.post("/", createGarage);
router.get("/", getGarages);
router.get("/subscriptions", getSubscriptions);
router.get("/stats/overview", getStatsOverview);
router.get("/:id", getGarageById);
router.delete("/:id", deleteGarage);
router.get("/:id/summary", getGarageSummary);
router.get("/:id/customers", getGarageCustomers);
router.patch("/:id", updateGarage);
router.post("/:id/subscription", updateGarageSubscription);

module.exports = router;