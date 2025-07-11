import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const { token } = useContext(AuthContext);

  if (token) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }


  export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async e => {
      e.preventDefault();
      try {
        const res = await api.post('/auth/register', { name, email, password });

        localStorage.setItem('token', res.data.token);  // ✅ Save token
        alert('Registration successful!');
        router.push('/dashboard');
      } catch (err) {
        console.error('Register error:', err.response?.data || err.message);
        alert('Registration failed: ' + (err.response?.data?.message || 'Unknown error'));
      }
    };

    return (
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    );
  }
]