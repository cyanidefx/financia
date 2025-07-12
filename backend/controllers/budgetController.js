const Budget = require('../models/Budget');

// GET all budgets for the logged-in user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ date: -1 });
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST add a new budget item
exports.addBudget = async (req, res) => {
  try {
    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ error: 'Category, amount, and date are required.' });
    }

    const newBudget = new Budget({
      user: req.user.id,
      category,
      amount,
      date // <-- use user-input date
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    console.error('Error adding budget:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
