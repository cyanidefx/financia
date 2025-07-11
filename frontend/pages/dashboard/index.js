import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('Fetch expenses error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <DarkModeToggle />
        <button
          onClick={handleLogout}
          style={{ background: '#0070f3', color: 'white', padding: '0.6rem 1rem', border: 'none', borderRadius: '8px' }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Welcome to Financia</h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            maxWidth: '500px',
            margin: '1rem auto',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2>Total Spent</h2>
            <p style={{ fontSize: '1.5rem' }}>₹{total}</p>
          </div>

          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Your Expenses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {expenses.map(exp => (
              <div key={exp._id} style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                <b>{exp.title}</b> - ₹{exp.amount}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
