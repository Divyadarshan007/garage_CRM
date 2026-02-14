const CustomerModel = require("../models/Customer.model");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

const createCustomer = async (req, res) => {
    try {
        const { name, mobile, address } = req.body;
        const customer = new CustomerModel({ name, mobile, address });
        await customer.save();
        res.status(200).json({ message: "Customer created successfully", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCustomers = async (req, res) => {
    try {
        const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { mobile: { $regex: search, $options: "i" } },
                ]
            };
        }

        const [data, total] = await Promise.all([
            CustomerModel.find(searchQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            CustomerModel.countDocuments(searchQuery)
        ]);

        res.status(200).json({
            message: "Customers fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getCustomerById = async (req, res) => {
    try {
        const customer = await CustomerModel.findById(req.params.id);
        res.status(200).json({ message: "Customer fetched successfully", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteCustomer = async (req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ message: "Customer deleted successfully", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createCustomer, getCustomers, updateCustomer, getCustomerById, deleteCustomer
}