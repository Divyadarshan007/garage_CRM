const mongoose = require("mongoose");
const Garage = require("../models/Garage.model");
const Customer = require("../models/Customer.model");
const Quotation = require("../models/Quotation.model");
const JobCard = require("../models/JobCard.model");
const Vehicle = require("../models/Vehicle.model");
const Invoice = require("../models/Invoice.model");
const Subscription = require("../models/Subscription.model");
const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const Payment = require("../models/Payment.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createGarage = async (req, res, next) => {
    try {
        const { name, owner, mobile, email, address, password, isDeleted } = req.body;
        const garage = new Garage({ name, owner, mobile, email, address, password, isDeleted });
        await garage.save();

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
        res.status(200).json(populatedGarage);
    } catch (error) {
        next(error);
    }
}

const getGarages = async (req, res, next) => {
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

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}
const getSubscriptions = async (req, res, next) => {
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

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}


const getStatsOverview = async (req, res, next) => {
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
                    from: "garages",
                    localField: "garageId",
                    foreignField: "_id",
                    as: "garage"
                }
            },
            { $unwind: "$garage" },
            { $match: { "garage.isDeleted": { $ne: true } } },
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
            totalGarages,
            totalCustomers,
            totalVehicles,
            totalJobCards,
            activeSubscriptions,
            totalActivePlans
        });
    } catch (error) {
        next(error);
    }
}

const getGarageById = async (req, res, next) => {
    try {
        const garage = await Garage.findById(req.params.id);
        if (!garage) {
            res.status(404);
            throw new Error("Garage not found");
        }
        res.status(200).json(garage);
    } catch (error) {
        next(error);
    }
}

const deleteGarage = async (req, res, next) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!garage) {
            res.status(404);
            throw new Error("Garage not found");
        }
        res.status(200).json(garage);
    } catch (error) {
        next(error);
    }
}

const getGarageSummary = async (req, res, next) => {
    try {
        const garageId = new mongoose.Types.ObjectId(req.params.id);

        const garage = await Garage.findById(garageId);
        if (!garage) {
            res.status(404);
            throw new Error("Garage not found");
        }

        // --- Date Calculation Implementation ---
        // IST is UTC + 5:30. 
        // We calculate date boundaries in IST.
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowIST = new Date(now.getTime() + istOffset);

        // Start of Today (IST)
        const startOfTodayIST = new Date(nowIST);
        startOfTodayIST.setUTCHours(0, 0, 0, 0);
        // Map back to UTC for DB query
        const startOfTodayUTC = new Date(startOfTodayIST.getTime() - istOffset);

        // Start of current Month (IST)
        const startOfMonthIST = new Date(nowIST);
        startOfMonthIST.setUTCDate(1);
        startOfMonthIST.setUTCHours(0, 0, 0, 0);
        const startOfMonthUTC = new Date(startOfMonthIST.getTime() - istOffset);

        // Start of last Month (IST)
        const startOfLastMonthIST = new Date(startOfMonthIST);
        startOfLastMonthIST.setUTCMonth(startOfLastMonthIST.getUTCMonth() - 1);
        const startOfLastMonthUTC = new Date(startOfLastMonthIST.getTime() - istOffset);

        // --- Aggregations & Counts ---
        const [
            totalCustomers,
            totalJobCards,
            totalJobCardsToday,
            activeJobCards,
            completedJobCardsCount,
            revenueData,
            pendingPaymentResult
        ] = await Promise.all([
            // Overall Counts
            Customer.countDocuments({ garageId }),
            JobCard.countDocuments({ garageId, isDeleted: { $ne: true } }),

            // Today's Jobcards
            JobCard.countDocuments({
                garageId,
                createdAt: { $gte: startOfTodayUTC },
                isDeleted: { $ne: true }
            }),

            // Active Jobcards (Across all time)
            JobCard.countDocuments({
                garageId,
                status: { $nin: ["completed", "paid"] },
                isDeleted: { $ne: true }
            }),

            // Completed Jobcards (Across all time)
            JobCard.countDocuments({
                garageId,
                status: { $in: ["completed", "paid"] },
                isDeleted: { $ne: true }
            }),

            // Revenue Data (Payments)
            Payment.aggregate([
                { $match: { garageId } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        thisMonth: {
                            $sum: {
                                $cond: [{ $gte: ["$createdAt", startOfMonthUTC] }, "$amount", 0]
                            }
                        },
                        lastMonth: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$createdAt", startOfLastMonthUTC] },
                                            { $lt: ["$createdAt", startOfMonthUTC] }
                                        ]
                                    },
                                    "$amount",
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Pending Payments (Invoices)
            Invoice.aggregate([
                { $match: { garageId } },
                { $group: { _id: null, totalPending: { $sum: "$amountDue" } } }
            ])
        ]);

        const revenue = revenueData[0] || { totalRevenue: 0, thisMonth: 0, lastMonth: 0 };
        const pendingPayment = pendingPaymentResult[0] ? pendingPaymentResult[0].totalPending : 0;

        res.json({
            today: {
                totalJobCards: totalJobCardsToday,
                activeJobCards: activeJobCards,
                completedJobCards: completedJobCardsCount
            },
            Revenue: {
                thisMonth: revenue.thisMonth,
                lastMonth: revenue.lastMonth
            },
            Overall: {
                totalRevenue: revenue.totalRevenue,
                pendingPayment: pendingPayment,
                totalCustomers: totalCustomers,
                totalJobCards: totalJobCards
            }
        });
    } catch (error) {
        next(error);
    }
}

const getGarageCustomers = async (req, res, next) => {
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

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}

const updateGarage = async (req, res, next) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(garage);
    } catch (error) {
        next(error);
    }
}

const updateGarageSubscription = async (req, res, next) => {
    try {
        const garageId = req.params.id;
        const { planId } = req.body;

        const garage = await Garage.findById(garageId);
        if (!garage) {
            res.status(404);
            throw new Error("Garage not found");
        }

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            res.status(404);
            throw new Error("Subscription plan not found");
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

        res.status(200).json(subscription);
    } catch (error) {
        next(error);
    }
}
module.exports = { createGarage, getGarages, getSubscriptions, getStatsOverview, getGarageById, deleteGarage, getGarageSummary, getGarageCustomers, updateGarage, updateGarageSubscription }
