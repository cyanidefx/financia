const express = require('express');
const router = express.Router();
const { getExpenses } = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// ✅ protect route
router.get('/', auth, getExpenses);

module.exports = router;
