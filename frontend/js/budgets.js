document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-budget-form');
  const message = document.getElementById('message');
  const showBtn = document.getElementById('show-budgets-btn');
  const budgetList = document.getElementById('budget-list');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value.trim();
    const limit = document.getElementById('limit').value.trim();

    if (!category || !limit) {
      showMessage("Please fill in both fields.", false);
      return;
    }

    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ category, limit }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(`Added category "${data.category}" with limit $${data.limit}.`, true);
        form.reset();
      } else {
        showMessage(data.error || "Failed to add budget.", false);
      }
    } catch (err) {
      showMessage("Server error.", false);
    }
  });

  showBtn.addEventListener('click', fetchBudgets);

  async function fetchBudgets() {
    try {
      const res = await fetch('/api/budgets', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      const budgets = await res.json();

      if (!Array.isArray(budgets)) {
        showMessage("Failed to load budgets.", false);
        return;
      }

      budgetList.innerHTML = budgets.length
        ? budgets.map(b => `<div><strong>${b.category}</strong>: $${b.limit}</div>`).join('')
        : "<p>No budgets found.</p>";
    } catch (err) {
      showMessage("Error fetching budgets.", false);
    }
  }

  function showMessage(text, isSuccess) {
    message.textContent = text;
    message.style.color = isSuccess ? "#80ffb3" : "#ff7f7f";
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
