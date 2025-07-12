document.addEventListener('DOMContentLoaded', () => {
    fetchAnalytics();
  });
  
  async function fetchAnalytics() {
    const res = await fetch('/api/expenses/analytics', {
      headers: { Authorization: localStorage.getItem('token') },
    });
    const data = await res.json();
  
    const container = document.getElementById('analytics-data');
    container.innerHTML = Object.entries(data).map(([cat, amt]) => `
      <div><strong>${cat}</strong>: $${amt.toFixed(2)}</div>
    `).join('');
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  