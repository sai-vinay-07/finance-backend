const Record = require('../models/financelRecords');

// getSummary - calculate income/expense/balance for dashboard
const getSummary = async (req, res) => {
    try {
        const incomeRecords = await Record.find({
            user: req.user._id,
            type: "income",
            isDeleted: false
        });

        const expenseRecords = await Record.find({
            user: req.user._id,
            type: "expense",
            isDeleted: false
        });

        let totalIncome = 0;
        let totalExpense = 0;

        // sum income amounts
        incomeRecords.forEach(record => totalIncome += record.amount);

        // sum expense amounts
        expenseRecords.forEach(record => totalExpense += record.amount);

        const netBalance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            summary: { totalIncome, totalExpense, netBalance }
        });
    } catch (error) {
        console.log("Summary error:", error);
        res.status(500).json({ success: false, message: "Summary failed" });
    }
};

// category totals using simple JS grouping
const categoryWiseTotal = async (req, res) => {
    try {
        const allRecords = await Record.find({ user: req.user._id, isDeleted: false });

        let categories = {};

        // group records by category and sum amounts
        allRecords.forEach(record => {
            if (!categories[record.category]) categories[record.category] = 0;
            categories[record.category] += record.amount;
        });

        let categoriesArray = [];
        for (let cat in categories) {
            categoriesArray.push({ _id: cat, total: categories[cat] });
        }

        res.status(200).json({ success: true, categories: categoriesArray });
    } catch (error) {
        console.log("Categories error:", error);
        res.status(500).json({ success: false, message: "Categories failed" });
    }
};

// monthly trends - group by month/year/type using JS dates
const monthlyTrends = async (req, res) => {
    try {
        const allRecords = await Record.find({ user: req.user._id, isDeleted: false });

        let trends = {};

        allRecords.forEach(record => {
            const recordDate = new Date(record.date);
            const month = recordDate.getMonth() + 1;
            const year = recordDate.getFullYear();
            const key = `${month}-${year}-${record.type}`;

            if (!trends[key]) {
                trends[key] = {
                    _id: { month, year, type: record.type },
                    total: 0
                };
            }
            trends[key].total += record.amount;
        });

        res.status(200).json({ success: true, monthlyTrends: Object.values(trends) });
    } catch (error) {
        console.log("Monthly trends error:", error);
        res.status(500).json({ success: false, message: "Monthly failed" });
    }
};

// weekly trends using custom week number function
const weeklyTrends = async (req, res) => {
    try {
        const allRecords = await Record.find({ user: req.user._id, isDeleted: false });

        let weeks = {};

        allRecords.forEach(record => {
            const week = getWeekNumber(new Date(record.date));
            const year = new Date(record.date).getFullYear();
            const key = `${week}-${year}-${record.type}`;

            if (!weeks[key]) {
                weeks[key] = {
                    _id: { week, year, type: record.type },
                    total: 0
                };
            }
            weeks[key].total += record.amount;
        });

        res.status(200).json({ success: true, weeklyTrends: Object.values(weeks) });
    } catch (error) {
        console.log("Weekly error:", error);
        res.status(500).json({ success: false, message: "Weekly failed" });
    }
};

// helper - get ISO week number from date
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const recentTransactions = async (req, res) => {
    try {
        const records = await Record.find({
            user: req.user._id,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({ success: true, recentTransactions: records });
    } catch (error) {
        console.log("Recent error:", error);
        res.status(500).json({ success: false, message: "Recent failed" });
    }
};

module.exports = {
    getSummary,
    categoryWiseTotal,
    monthlyTrends,
    weeklyTrends,
    recentTransactions
};

