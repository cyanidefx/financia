const { Parser } = require('json2csv');
const Expense = require('../models/Expense');

exports.exportExpenses = async (userId) => {
  const expenses = await Expense.find({ user: userId }).lean();
  const parser = new Parser();
  return parser.parse(expenses);
};

exports.importExpenses = async (userId, csvData) => {
  // Parse CSV (skip implementation detail here)
  // Insert expenses into DB with userId
};
