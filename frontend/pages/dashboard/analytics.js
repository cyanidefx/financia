import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import ChartWrapper from '../../components/ChartWrapper';

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(data);
    };
    fetchExpenses();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Analytics</h2>
      {expenses.length > 0 ? <ChartWrapper expenses={expenses} /> : <p>Loading charts...</p>}
    </div>
  );
}
