const Garage = require("../models/Garage.model");
const Customer = require("../models/Customer.model");
const Quotation = require("../models/Quotation.model");
const JobCard = require("../models/JobCard.model");
const Vehicle = require("../models/Vehicle.model");
const Invoice = require("../models/Invoice.model");
const Subscription = require("../models/Subscription.model");
const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

const createGarage = async (req, res) => {
    try {
        const { name, owner, mobile, email, address, password, isDeleted } = req.body;
        const garage = new Garage({ name, owner, mobile, email, address, password, isDeleted });
        await garage.save();

        // Find or create the "Free" subscription plan
        let freePlan = await SubscriptionPlan.findOne({ name: "Free" });
        if (!freePlan) {
            freePlan = await SubscriptionPlan.create({ name: "Free", durationDays: 0, price: 0 });
        }

        const subscriptionId = "SUB-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const subscription = new Subscription({
            garageId: garage._id,
            subscriptionId,
            planId: freePlan._id,
            durationDays: 0,
            startDate: new Date(),
            endDate: null,
            status: "Active"
        });
        await subscription.save();

        garage.currentSubscriptionId = subscription._id;
        await garage.save();

        const populatedGarage = await Garage.findById(garage._id)
            .select("-password")
            .populate({
                path: "currentSubscriptionId",
                populate: { path: "planId" }
            });
        res.status(200).json({ message: "Garage created successfully", garage: populatedGarage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGarages = async (req, res) => {
    try {
        const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { owner: { $regex: search, $options: "i" } },
                    { mobile: { $regex: search, $options: "i" } },
                ]
            };
        }

        const [data, total] = await Promise.all([
            Garage.find(searchQuery)
                .populate({ path: "currentSubscriptionId", populate: { path: "planId" } })
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Garage.countDocuments(searchQuery)
        ]);

        res.status(200).json({
            message: "Garages fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getSubscriptions = async (req, res) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);

        const [data, total] = await Promise.all([
            Subscription.find()
                .populate("garageId", "name owner")
                .populate("planId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Subscription.countDocuments()
        ]);

        res.status(200).json({
            message: "Subscriptions fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getStatsOverview = async (req, res) => {
    try {
        const [
            totalGarages,
            totalCustomers,
            totalVehicles,
            totalJobCards,
            totalActivePlans,
        ] = await Promise.all([
            Garage.countDocuments(),
            Customer.countDocuments(),
            Vehicle.countDocuments(),
            JobCard.countDocuments(),
            SubscriptionPlan.countDocuments({ isActive: true }),
        ]);

        const activeSubscriptionsResult = await Subscription.aggregate([
            { $match: { status: "Active" } },
            {
                $lookup: {
                    from: "subscriptionplans",
                    localField: "planId",
                    foreignField: "_id",
                    as: "plan"
                }
            },
            { $unwind: "$plan" },
            { $match: { "plan.price": { $gt: 0 } } },
            { $count: "count" }
        ]);

        const activeSubscriptions = activeSubscriptionsResult.length > 0 ? activeSubscriptionsResult[0].count : 0;

        res.status(200).json({
            message: "Stats fetched successfully",
            totalGarages,
            totalCustomers,
            totalVehicles,
            totalJobCards,
            activeSubscriptions,
            totalActivePlans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGarageById = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }
        res.status(200).json({ message: "Garage fetched successfully", garage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteGarage = async (req, res) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }
        res.status(200).json({ message: "Garage deleted successfully", garage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGarageSummary = async (req, res) => {
    try {
        const garageId = req.params.id;

        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }

        const [
            totalCustomers,
            totalVehicles,
            totalJobCards,
            totalQuotations,
            totalInvoices,
        ] = await Promise.all([
            Customer.countDocuments({ garageId }),
            Vehicle.countDocuments({ garageId }),
            JobCard.countDocuments({ garageId }),
            Quotation.countDocuments({ garageId }),
            Invoice.countDocuments({ garageId }),

        ]);

        res.json({
            garageId,
            totalCustomers,
            totalVehicles,
            totalJobCards,
            totalQuotations,
            totalInvoices,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGarageCustomers = async (req, res) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);
        const filter = { garageId: req.params.id };

        const [data, total] = await Promise.all([
            Customer.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Customer.countDocuments(filter)
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

const updateGarage = async (req, res) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Garage updated successfully", garage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateGarageSubscription = async (req, res) => {
    try {
        const garageId = req.params.id;
        const { planId } = req.body;

        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        const durationDays = plan.durationDays;
        const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = null;
        if (durationDays > 0) {
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + durationDays);
        }

        await Subscription.updateMany(
            { garageId, status: "Active" },
            { status: "Expired" }
        );

        const subscriptionId = "SUB-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const subscription = new Subscription({
            garageId,
            subscriptionId,
            planId,
            durationDays,
            startDate,
            endDate,
            status: "Active"
        });
        await subscription.save();

        garage.currentSubscriptionId = subscription._id;
        await garage.save();

        res.status(200).json({ message: "Subscription updated successfully", subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { createGarage, getGarages, getSubscriptions, getStatsOverview, getGarageById, deleteGarage, getGarageSummary, getGarageCustomers, updateGarage, updateGarageSubscription }