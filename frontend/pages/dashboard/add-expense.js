import { useState } from 'react';
import API from '../../utils/api';

export default function AddExpense() {
  const [form, setForm] = useState({ title: '', amount: '', type: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/expenses', form);
      alert('Expense added successfully!');
    } catch (err) {
      alert('Error: Could not add expense.');
    }
  };

  return (
    <div className="container">
      <h2>Add New Expense</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" onChange={handleChange} required />
        <input name="type" placeholder="Type (e.g., Food, Rent)" onChange={handleChange} required />
        <button className="btn" type="submit">Add Expense</button>
      </form>
    </div>
  );
}
