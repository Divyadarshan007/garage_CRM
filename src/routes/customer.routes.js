const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { createCustomerSchema, updateCustomerSchema } = require("../validators/customer.validator");

const { createCustomer, getCustomers, updateCustomer, getCustomerById, deleteCustomer } = require("../controllers/customer.controller");
const { getVehiclesByCustomer } = require("../controllers/vehicle.controller");
const { getJobCardsByCustomer } = require("../controllers/jobcard.controller");


router.use(protectGarage);

router.post("/", validate(createCustomerSchema), createCustomer);
// router.get("/", getCustomers);
router.get("/:pageId", getCustomers);
router.patch("/:id", validate(updateCustomerSchema), updateCustomer);
router.get("/:id/vehicles/:pageId", getVehiclesByCustomer);
router.get("/:id/jobcard/:pageId", getJobCardsByCustomer);
router.get("/:id/detail", getCustomerById);
router.delete("/:id", deleteCustomer);


module.exports = router;