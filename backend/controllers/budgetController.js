const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    console.error('Budgets error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const newBudget = new Budget({ user: req.userId, category, limit });
    await newBudget.save();
    res.json(newBudget);
  } catch (err) {
    console.error('Add budget error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};
