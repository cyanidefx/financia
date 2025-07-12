document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const form = document.getElementById('budgetForm');
  const categoryInput = document.getElementById('category');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const list = document.getElementById('budgetList');
  const showBtn = document.getElementById('showBudgetsBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const category = categoryInput.value;
      const amount = parseFloat(amountInput.value);
      const date = dateInput.value;

      try {
        const res = await fetch('http://localhost:5000/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ category, amount, date })
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ Budget added');
          form.reset();
          showBudgets();
        } else {
          alert(`❌ Error: ${data.message}`);
        }
      } catch (err) {
        console.error('Budget request failed:', err);
        alert('❌ Failed to add budget item.');
      }
    });
  }

  if (showBtn) {
    showBtn.addEventListener('click', showBudgets);
  }

  async function showBudgets() {
    try {
      const res = await fetch('http://localhost:5000/api/budgets', {
        headers: {
          'x-auth-token': token
        }
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        console.error('Unexpected response:', data);
        alert(`❌ Error: ${data.message || 'Failed to load budgets.'}`);
        return;
      }

      list.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        const displayDate = new Date(item.date || item.createdAt).toLocaleString();

        li.innerHTML = `
          <strong>${item.category}</strong>: ₹${item.amount}<br>
          <small>📅 ${displayDate}</small><br>
          <button class="delete-btn" data-id="${item._id}">🗑️ Delete</button>
        `;

        list.appendChild(li);
      });

      attachDeleteListeners();
    } catch (err) {
      console.error('Fetch budgets failed:', err);
      alert('❌ Failed to fetch budget list.');
    }
  }

  function attachDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!id) return alert('Missing item ID');

        if (confirm('Delete this budget item?')) {
          try {
            const delRes = await fetch(`http://localhost:5000/api/budgets/${id}`, {
              method: 'DELETE',
              headers: { 'x-auth-token': token }
            });

            const delData = await delRes.json();
            if (delRes.ok) {
              alert('🗑️ Budget deleted');
              showBudgets();
            } else {
              alert(`❌ Delete failed: ${delData.message}`);
            }
          } catch (err) {
            console.error('Delete failed:', err);
            alert('❌ Failed to delete item.');
          }
        }
      });
    });
  }
});
