const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");

const { createVehicle, getAllVehicles, updateVehicle, deleteVehicle } = require("../controllers/vehicle.controller");

router.use(protectGarage);

router.post("/", createVehicle);
router.get("/", getAllVehicles);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;