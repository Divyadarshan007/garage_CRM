const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const Subscription = require("../models/Subscription.model");

const createPlan = async (req, res) => {
    try {
        const { name, durationDays, price, isActive } = req.body;
        const plan = await SubscriptionPlan.create({ name, durationDays, price, isActive });
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });

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

        res.status(200).json({ success: true, data: plansWithUsage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPlanById = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        const id = req.params.id;
        const plan = await SubscriptionPlan.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan };