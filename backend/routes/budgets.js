const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBudgets, addBudget } = require('../controllers/budgetController');

router.get('/', auth, getBudgets);
router.post('/', auth, addBudget);

module.exports = router;
