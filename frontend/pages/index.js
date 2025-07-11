import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ExpenseCard from '../components/ExpenseCard';
import DarkModeToggle from '../components/DarkModeToggle';
import ChartWrapper from '../components/ChartWrapper';
import BudgetAlert from '../components/BudgetAlert';

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Summaries
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpenses = expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth());
  const monthlyTotal = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [expRes, budRes] = await Promise.all([
          api.get('/expenses', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/budgets', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setExpenses(expRes.data);
        setBudgets(budRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    return null;
  }

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <DarkModeToggle />
        <button onClick={logout} style={{ background: '#0070f3', color: 'white', padding: '0.6rem 1rem', border: 'none', borderRadius: '8px' }}>
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '1rem' }}>Welcome to Financia Dashboard</h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <>
          {/* 📊 Summary */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', minWidth: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h3>Total Spent</h3>
              <p style={{ fontSize: '1.4rem' }}>₹{totalSpent}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', minWidth: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h3>This Month</h3>
              <p style={{ fontSize: '1.4rem' }}>₹{monthlyTotal}</p>
            </div>
          </div>

          {/* 🚨 Budget Alerts */}
          <BudgetAlert expenses={expenses} budgets={budgets} />

          {/* 📦 Expenses list */}
          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Your Expenses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {expenses.map((e) => (
              <ExpenseCard key={e._id} expense={e} />
            ))}
          </div>

          {/* 📈 Charts */}
          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Analytics</h2>
          <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <ChartWrapper expenses={expenses} />
          </div>
        </>
      )}
    </div>
  );
}
