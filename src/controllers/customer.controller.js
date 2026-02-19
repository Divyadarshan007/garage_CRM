const CustomerModel = require("../models/Customer.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createCustomer = async (req, res, next) => {
    try {
        const garageId = req.garage._id;
        const { name, mobile, address } = req.body;
        const customer = new CustomerModel({ name, mobile, address, garageId });
        await customer.save();
        res.status(200).json(customer);
    } catch (error) {
        res.status(422).json({ message: error.message });
    }
}

const getCustomers = async (req, res, next) => {
    try {
        let { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        // If pageId is provided in params, override page and enforce limit of 10
        if (req.params.pageId) {
            page = Math.max(parseInt(req.params.pageId) || 1, 1);
            limit = 10;
            skip = (page - 1) * limit;
        }
        const garageId = req.garage._id;

        let searchQuery = { isDeleted: { $ne: true }, garageId }; // Ensure we don't fetch deleted customers
        if (search) {
            searchQuery = {
                ...searchQuery,
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

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateCustomer = async (req, res, next) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(customer);
    } catch (error) {
        res.status(422).json({ message: error.message });
    }
}
const getCustomerById = async (req, res, next) => {
    try {
        const customer = await CustomerModel.findById(req.params.id);
        if (!customer) {
            res.status(404);
            throw new Error("Customer not found");
        }
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
}
const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createCustomer, getCustomers, updateCustomer, getCustomerById, deleteCustomer
}
