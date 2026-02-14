const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createVehicle, getAllVehicles, updateVehicle, deleteVehicle } = require("../controllers/vehicle.controller");

router.use(protect);

router.post("/", createVehicle);
router.get("/", getAllVehicles);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;