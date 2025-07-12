exports.getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const categoryTotals = {};

    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    res.json(categoryTotals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
