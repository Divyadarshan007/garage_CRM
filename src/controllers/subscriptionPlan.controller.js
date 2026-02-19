const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const Subscription = require("../models/Subscription.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createPlan = async (req, res, next) => {
    try {
        const { name, durationDays, price, isActive } = req.body;
        const plan = await SubscriptionPlan.create({ name, durationDays, price, isActive });
        res.status(201).json(plan);
    } catch (error) {
        next(error);
    }
};

const getAllPlans = async (req, res, next) => {
    try {
        const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        let searchQuery = {};
        if (search) {
            searchQuery = { name: { $regex: search, $options: "i" } };
        }

        const [plans, total] = await Promise.all([
            SubscriptionPlan.find(searchQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            SubscriptionPlan.countDocuments(searchQuery)
        ]);

        const plansWithUsage = await Promise.all(plans.map(async (plan) => {
            const usageCount = await Subscription.countDocuments({
                planId: plan._id,
                status: "Active"
            });
            return {
                ...plan.toObject(),
                usageCount
            };
        }));

        res.status(200).json(
            plansWithUsage
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
};

const getPlanById = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);
        if (!plan) {
            res.status(404);
            throw new Error("Plan not found");
        }
        res.status(200).json(plan);
    } catch (error) {
        next(error);
    }
};

const updatePlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!plan) {
            res.status(404);
            throw new Error("Plan not found");
        }
        res.status(200).json(plan);
    } catch (error) {
        next(error);
    }
};

const deletePlan = async (req, res, next) => {
    try {
        const id = req.params.id;
        const plan = await SubscriptionPlan.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!plan) {
            res.status(404);
            throw new Error("Plan not found");
        }
        res.status(200).json(plan);
    } catch (error) {
        next(error);
    }
};
module.exports = { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan };