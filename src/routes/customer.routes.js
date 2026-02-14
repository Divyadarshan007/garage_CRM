const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

const { createCustomer, getCustomers, updateCustomer, getCustomerById, deleteCustomer } = require("../controllers/customer.controller");

router.use(protect);

router.post("/", createCustomer);
router.get("/", getCustomers);
router.patch("/:id", updateCustomer);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);

module.exports = router;