import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Budgets() {
  const { token } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchBudgets = async () => {
      try {
        const { data } = await api.get('/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(data);
      } catch (err) {
        console.error('Fetch budgets error:', err.response?.data || err.message);
      }
    };

    fetchBudgets();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/budgets', { category, limit }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets([...budgets, data]);
      setCategory('');
      setLimit('');
    } catch (err) {
      console.error('Add budget error:', err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>Budgets</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <input
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem' }}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem' }}
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px' }}>
          Set Budget
        </button>
      </form>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Current Budgets</h2>
        {budgets.map((b) => (
          <div key={b._id} style={{ background: 'white', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <b>Category:</b> {b.category} <br/>
            <b>Limit:</b> ₹{b.limit}
          </div>
        ))}
      </div>
    </div>
  );
}
