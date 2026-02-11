const express = require("express");
const CustomerModel = require("../models/Customer.model");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, mobile, address, garageId } = req.body;
        const customer = new CustomerModel({ name, mobile, address, garageId });
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const customers = await CustomerModel.find();
        res.json(customers);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, req.body);
        res.json(customer);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const customer = await CustomerModel.findById(req.params.id);
        res.json(customer);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json(customer);
    } catch (error) {
        res.json({ message: error.message });
    }
});


module.exports = router;