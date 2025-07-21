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
// Helper to format time string
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// GET summarized budget data by mode
exports.getBudgetSummary = async (req, res) => {
  try {
    const mode = req.query.mode || 'monthly';
    const budgets = await Budget.find({ user: req.user.id }).sort({ date: 1 });

    const result = {};

    budgets.forEach(entry => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate().toString().padStart(2, '0');
      const time = formatTime(date);

      if (!result[year]) result[year] = { total: 0, months: {} };
      result[year].total += entry.amount;

      if (!result[year].months[month]) result[year].months[month] = { total: 0, days: {} };
      result[year].months[month].total += entry.amount;

      if (!result[year].months[month].days[day]) {
        result[year].months[month].days[day] = { total: 0, entries: [] };
      }

      result[year].months[month].days[day].total += entry.amount;

      if (mode === 'daily-detail') {
        result[year].months[month].days[day].entries.push([
          time,
          entry.amount,
          entry.category
        ]);
      }
    });

    res.json(result);
  } catch (err) {
    console.error('Error building summary:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
