const Transaction = require("../models/Transaction.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createTransaction = async (req, res, next) => {
    try {
        const { invoiceId, amount, paymentMode, paymentDate, notes } = req.body;
        const transaction = new Transaction({ invoiceId, amount, paymentMode, paymentDate, notes });
        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);

        const [data, total] = await Promise.all([
            Transaction.find()
                .populate("invoiceId")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Transaction.countDocuments()
        ]);

        res.status(200).json({
            data,
            total,
            page,
            limit
        });
    } catch (error) {
        next(error);
    }
};

const getTransactionStats = async (req, res, next) => {
    try {
        // Placeholder implementation
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(stats[0] || { totalAmount: 0, count: 0 });
    } catch (error) {
        next(error);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionStats,
    updateTransaction,
    deleteTransaction
};
