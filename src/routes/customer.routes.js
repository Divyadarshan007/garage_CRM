const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");

const { createCustomer, getCustomers, updateCustomer, getCustomerById, deleteCustomer } = require("../controllers/customer.controller");

router.use(protectGarage);

router.post("/", createCustomer);
router.get("/", getCustomers);
router.patch("/:id", updateCustomer);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);

module.exports = router;