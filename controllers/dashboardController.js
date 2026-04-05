const Record = require('../models/financelRecords');



const getTotalIncome = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: "income",
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = result.length > 0 ? result[0].total : 0;

        res.status(200).json({
            success: true,
            totalIncome: totalIncome
        });

    } catch (error) {
        console.error("Error getting income:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get income"
        });
    }
};




const getTotalExpense = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: "expense",
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalExpense = result.length > 0 ? result[0].total : 0;

        res.status(200).json({
            success: true,
            totalExpense: totalExpense
        });

    } catch (error) {
        console.error("Error getting expense:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get expense"
        });
    }
};




const netBalance = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        result.forEach(item => {
            if (item._id === "income") {
                income = item.total;
            }
            if (item._id === "expense") {
                expense = item.total;
            }
        });

        const balance = income - expense;

        res.status(200).json({
            success: true,
            netBalance: balance
        });

    } catch (error) {
        console.error("Error getting balance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to calculate balance"
        });
    }
};




const categoryWiseTotal = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            categories: result
        });

    } catch (error) {
        console.error("Error getting category totals:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get category totals"
        });
    }
};

const monthlyTrends = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            monthlyTrends: result
        });

    } catch (error) {
        console.error("Error getting monthly trends:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get monthly trends"
        });
    }
};

const weeklyTrends = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    user: req.user._id,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        week: { $week: "$date" },
                        year: { $year: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.week": 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            weeklyTrends: result
        });

    } catch (error) {
        console.error("Error getting weekly trends:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get weekly trends"
        });
    }
};

const getSummary = async (req, res) => {
    try {
        const incomeResult = await Record.aggregate([
            { $match: { user: req.user._id, type: "income", isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const expenseResult = await Record.aggregate([
            { $match: { user: req.user._id, type: "expense", isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
        const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
        const netBalance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                netBalance
            }
        });

    } catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get summary"
        });
    }
};

const recentTransactions = async (req, res) => {
    try {
        const records = await Record.find({ user: req.user._id, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            recentTransactions: records
        });

    } catch (error) {
        console.error("Error getting recent transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get recent transactions"
        });
    }
};

module.exports = {
    getTotalIncome,
    getTotalExpense,
    netBalance,
    categoryWiseTotal,
    monthlyTrends,
    weeklyTrends,
    recentTransactions,
    getSummary
};