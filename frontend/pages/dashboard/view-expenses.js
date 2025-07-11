import { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      const res = await API.get('/expenses');
      setExpenses(res.data);
    }
    fetchExpenses();
  }, []);

  return (
    <div className="container">
      <h2>All Expenses</h2>
      <ul className="expense-list">
        {expenses.map((exp, idx) => (
          <li key={idx} className="expense-item">
            <strong>{exp.title}</strong> — ₹{exp.amount} ({exp.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
