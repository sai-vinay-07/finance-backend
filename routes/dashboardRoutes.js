const express = require('express');
const { getSummary, categoryWiseTotal, monthlyTrends, weeklyTrends, recentTransactions } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();


router.get('/summary', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), getSummary);


router.get('/categories', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), categoryWiseTotal);


router.get('/trends', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), monthlyTrends);


router.get('/weekly-trends', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), weeklyTrends);


router.get('/recent', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), recentTransactions);

module.exports = router;