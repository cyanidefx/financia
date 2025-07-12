const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const newBudget = new Budget({ user: req.user.id, category, limit });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
exports.addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required.' });
    }

    const newBudget = new Budget({
      user: req.user.id,  // Ensure req.user exists (auth middleware)
      category,
      limit
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    console.error('Error adding budget:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
