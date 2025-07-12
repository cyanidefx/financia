const API_URL = 'http://localhost:5000/api/auth';

document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = data.message;
    }
  } catch (err) {
    msg.textContent = 'Server error';
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  console.log('Register button clicked'); // ✅ Add this line for testing
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const msg = document.getElementById('registerMsg');

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = 'Registration successful. Please log in.';
    } else {
      msg.textContent = data.message;
    }
  } catch (err) {
    msg.textContent = 'Server error';
  }
});

