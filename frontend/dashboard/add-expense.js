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
      const res = await API.post('/expenses', form);
      alert('Expense added!');
    } catch (err) {
      console.error(err);
      alert('Error adding expense');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" onChange={handleChange} required />
        <input name="type" placeholder="Type (e.g. food, rent)" onChange={handleChange} required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
