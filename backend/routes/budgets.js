const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// GET all budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ date: -1 });
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new budget
router.post('/', auth, async (req, res) => {
  const { category, amount, date } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ message: 'Category and amount are required' });
  }

  try {
    const budget = new Budget({
      user: req.user.id,
      category,
      amount,
      date: date ? new Date(date) : new Date()
    });

    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create budget failed:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE budget by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
