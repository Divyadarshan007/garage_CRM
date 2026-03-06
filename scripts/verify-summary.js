const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const Garage = require("../src/models/Garage.model");
const Customer = require("../src/models/Customer.model");
const JobCard = require("../src/models/JobCard.model");
const Invoice = require("../src/models/Invoice.model");
const Payment = require("../src/models/Payment.model");
const connectDB = require("../src/config/db");

async function verify() {
    try {
        await connectDB();

        const garage = await Garage.findOne();
        if (!garage) {
            console.log("No garage found in database to test with.");
            process.exit(0);
        }

        const garageId = garage._id;
        console.log(`Testing with Garage ID: ${garageId} (${garage.name})`);

        // --- Logic from Controller ---
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowIST = new Date(now.getTime() + istOffset);

        const startOfTodayIST = new Date(nowIST);
        startOfTodayIST.setUTCHours(0, 0, 0, 0);
        const startOfTodayUTC = new Date(startOfTodayIST.getTime() - istOffset);

        const startOfMonthIST = new Date(nowIST);
        startOfMonthIST.setUTCDate(1);
        startOfMonthIST.setUTCHours(0, 0, 0, 0);
        const startOfMonthUTC = new Date(startOfMonthIST.getTime() - istOffset);

        const startOfLastMonthIST = new Date(startOfMonthIST);
        startOfLastMonthIST.setUTCMonth(startOfLastMonthIST.getUTCMonth() - 1);
        const startOfLastMonthUTC = new Date(startOfLastMonthIST.getTime() - istOffset);

        const [
            totalCustomers,
            totalJobCards,
            totalJobCardsToday,
            activeJobCards,
            completedJobCardsCount,
            revenueData,
            pendingPaymentResult
        ] = await Promise.all([
            Customer.countDocuments({ garageId }),
            JobCard.countDocuments({ garageId, isDeleted: { $ne: true } }),
            JobCard.countDocuments({ garageId, createdAt: { $gte: startOfTodayUTC }, isDeleted: { $ne: true } }),
            JobCard.countDocuments({ garageId, status: { $nin: ["completed", "paid"] }, isDeleted: { $ne: true } }),
            JobCard.countDocuments({ garageId, status: { $in: ["completed", "paid"] }, isDeleted: { $ne: true } }),
            Payment.aggregate([
                { $match: { garageId } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        thisMonth: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonthUTC] }, "$amount", 0] } },
                        lastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$createdAt", startOfLastMonthUTC] }, { $lt: ["$createdAt", startOfMonthUTC] }] }, "$amount", 0] } }
                    }
                }
            ]),
            Invoice.aggregate([
                { $match: { garageId } },
                { $group: { _id: null, totalPending: { $sum: "$amountDue" } } }
            ])
        ]);

        const revenue = revenueData[0] || { totalRevenue: 0, thisMonth: 0, lastMonth: 0 };
        const pendingPayment = pendingPaymentResult[0] ? pendingPaymentResult[0].totalPending : 0;

        const result = {
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
        };

        console.log("Verification Result:");
        console.log(JSON.stringify(result, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
