// js/budgets.js

document.addEventListener('DOMContentLoaded', () => {
  const token         = localStorage.getItem('token');
  const form          = document.getElementById('budgetForm');
  const categoryInput = document.getElementById('category');
  const amountInput   = document.getElementById('amount');
  const dateInput     = document.getElementById('date');
  const showBtn       = document.getElementById('showBudgetsBtn');

  // 1. Handle form submission
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const category = categoryInput.value.trim();
      const amount   = parseFloat(amountInput.value);
      const date     = dateInput.value;
      try {
        const res = await fetch('http://localhost:5000/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ category, amount, date })
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); }
        catch { throw new Error('Non-JSON response from server'); }
        if (res.ok) {
          alert('✅ Budget added');
          form.reset();
          showBudgets();
        } else {
          alert(`❌ Error: ${data.message}`);
        }
      } catch (err) {
        console.error('Add budget error:', err);
        alert('❌ Failed to add budget item.');
      }
    });
  }

  // 2. Wire up Show Budgets button & view-mode change
  if (showBtn) showBtn.addEventListener('click', showBudgets);

  // 3. Initial fetch
  showBudgets();

  // --- fetch & dispatch render ---
  async function showBudgets() {
    const mode = 'daily-detail'; // Always use yearly mode
    try {
      const res = await fetch(
        `http://localhost:5000/api/budgets/summary?mode=${mode}`,
        { headers: { 'x-auth-token': token } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load budgets');
      renderNestedBudgets(data, mode);
    } catch (err) {
      console.error('Fetch budgets failed:', err);
      alert('❌ Failed to fetch budget list.');
    }
  }

  // --- render budgets in UL, with inline flex for yearly ---
  function renderNestedBudgets(data, mode) {
    const container = document.getElementById('nestedBudgetList');
    container.innerHTML = '';
    // reset any inline styles
    container.style.display    = '';
    container.style.flexWrap   = '';
    container.style.overflowX  = '';

    // YEARLY: make UL a horizontal flex container
    if (mode === 'daily-detail') {
      container.style.display   = 'flex';
      container.style.flexWrap  = 'nowrap';
      container.style.overflowX = 'auto';
      container.style.listStyle = 'none';

      for (const year of Object.keys(data)) {
        const yObj = data[year];
        const yearLi = document.createElement('li');
        // inline column styles
        yearLi.style.flex         = '0 0 200px';
        yearLi.style.marginRight  = '1.5rem';
        yearLi.style.borderRight  = '1px solid #ddd';
        yearLi.style.paddingRight = '1rem';

        // header toggles month list
        const header = document.createElement('div');
        header.className = 'toggle-header';
        header.textContent = `${year} – ₹${yObj.total}`;
        yearLi.appendChild(header);

        const monthList = document.createElement('ul');
        monthList.style.display = 'none';
        monthList.style.listStyle = 'none';
        yearLi.appendChild(monthList);

        header.addEventListener('click', () => {
          monthList.style.display =
            monthList.style.display === 'none' ? 'block' : 'none';
        });

        for (const month of Object.keys(yObj.months)) {
          const mObj = yObj.months[month];
          const monthLi = document.createElement('li');

          const mHdr = document.createElement('div');
          mHdr.className = 'toggle-header';
          mHdr.textContent = `${month} – ₹${mObj.total}`;
          monthLi.appendChild(mHdr);

          const dayList = document.createElement('ul');
          dayList.style.display = 'none';
          dayList.style.listStyle = 'none';
          monthLi.appendChild(dayList);

          mHdr.addEventListener('click', () => {
            dayList.style.display =
              dayList.style.display === 'none' ? 'block' : 'none';
          });

          for (const day of Object.keys(mObj.days)) {
            const dObj = mObj.days[day];
            const dayLi = document.createElement('li');

            const dHdr = document.createElement('div');
            dHdr.className = 'toggle-header';
            dHdr.textContent = `${day} – ₹${dObj.total}`;
            dayLi.appendChild(dHdr);
            
            const entryList = document.createElement('ul');
            entryList.style.display = 'none';
            entryList.style.listStyle = 'none';
            dayLi.appendChild(entryList);
            
            dHdr.addEventListener('click', () => {
              entryList.style.display =
                entryList.style.display === 'none' ? 'block' : 'none';
            });
            
            // ✅ Add actual entries
            dObj.entries.forEach(([time, amt, cat]) => {
              const li = document.createElement('li');
              li.textContent = `${time} – ₹${amt} – ${cat}`;
              entryList.appendChild(li);
            });
            

            dayList.appendChild(dayLi);
          }

          monthList.appendChild(monthLi);
        }

        container.appendChild(yearLi);
      }

    } else {
      // NON-YEARLY: reset list style and build nested
      container.style.listStyle = 'none';

      for (const year of Object.keys(data)) {
        const yObj    = data[year];
        const yearItem = createToggleItem(`${year} – ₹${yObj.total}`);

        for (const month of Object.keys(yObj.months)) {
          const mObj     = yObj.months[month];
          const monthItem = createToggleItem(`${month} – ₹${mObj.total}`);

          for (const day of Object.keys(mObj.days)) {
            const dObj    = mObj.days[day];
            const dayItem = createToggleItem(`${day} – ₹${dObj.total}`);

            monthItem.querySelector('ul').appendChild(dayItem);
          }
          yearItem.querySelector('ul').appendChild(monthItem);
        }
        container.appendChild(yearItem);
      }
    }
  }

  // --- helper: make an LI with toggleable UL child ---
  function createToggleItem(title) {
    const wrapper  = document.createElement('li');
    const header   = document.createElement('div');
    header.className = 'toggle-header';
    header.textContent = title;

    const childList = document.createElement('ul');
    childList.style.display = 'none';
    childList.style.listStyle = 'none';

    header.addEventListener('click', () => {
      childList.style.display =
        childList.style.display === 'none' ? 'block' : 'none';
    });

    wrapper.appendChild(header);
    wrapper.appendChild(childList);
    return wrapper;
  }
});
