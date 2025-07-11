import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { token, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (token) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token);
      router.push('/'); // redirect to dashboard
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Login failed'); // you can replace with toast
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', fontSize: '1rem' }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', fontSize: '1rem' }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}>
          Login
        </button>
      </form>
    </div>
  );
}
