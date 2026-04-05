const express = require('express');
const { getSummary, categoryWiseTotal, monthlyTrends, weeklyTrends, recentTransactions } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/dashboard/summary - Total income, expense, balance (viewer, analyst, admin)
router.get('/summary', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), getSummary);

// GET /api/dashboard/categories - Category totals (viewer, analyst, admin)
router.get('/categories', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), categoryWiseTotal);

// GET /api/dashboard/trends - Monthly trends (viewer, analyst, admin)
router.get('/trends', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), monthlyTrends);

// GET /api/dashboard/weekly-trends - Weekly trends (viewer, analyst, admin)
router.get('/weekly-trends', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), weeklyTrends);

// GET /api/dashboard/recent - Recent transactions (viewer, analyst, admin)
router.get('/recent', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), recentTransactions);

module.exports = router;