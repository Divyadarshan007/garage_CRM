const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require("../controllers/subscriptionPlan.controller");

router.use(protect);

router.post("/", createPlan);
router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", updatePlan);
router.patch("/:id", deletePlan);

module.exports = router;
