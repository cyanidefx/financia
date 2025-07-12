const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAnalytics } = require('../controllers/expenseController');

router.get('/analytics', auth, getAnalytics);

module.exports = router;
