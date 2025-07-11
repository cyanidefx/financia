const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  tags: [{ type: String }],
  recurring: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', null], default: null },
    nextDate: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
