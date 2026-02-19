const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");
const { validate } = require("../middleware/validator");
const { createPlanSchema, updatePlanSchema } = require("../validators/subscriptionPlan.validator");

const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require("../controllers/subscriptionPlan.controller");

router.use(protect);

router.post("/", validate(createPlanSchema), createPlan);
router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", validate(updatePlanSchema), updatePlan);
router.patch("/:id", deletePlan);

module.exports = router;
