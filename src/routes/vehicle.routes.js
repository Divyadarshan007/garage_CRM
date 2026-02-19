const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createVehicleSchema, updateVehicleSchema } = require("../validators/vehicle.validator");

const { createVehicle, getAllVehicles, updateVehicle, deleteVehicle, getVehicleDetail, getVehicleJobCards } = require("../controllers/vehicle.controller");

router.use(protectGarage);

router.get("/:id/detail", getVehicleDetail);
router.get("/:id/jobcards/:pageId", getVehicleJobCards);
// IMPORTANT: Put general param routes after specific ones to avoid conflicts if any
router.get("/:pageId", getAllVehicles);
router.get("/", getAllVehicles); // Keep base route for query params default

router.post("/", validate(createVehicleSchema), createVehicle);
router.patch("/:id", validate(updateVehicleSchema), updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;