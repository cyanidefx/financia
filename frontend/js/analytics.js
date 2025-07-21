const token = localStorage.getItem('token');
const API_URL = 'http://localhost:5000/api/budgets/summary?mode=';

const modeSelect = document.getElementById('modeSelect');
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const categoryFilter = document.getElementById('categoryFilter');

const barChartCtx = document.getElementById('barChart').getContext('2d');
const lineChartCtx = document.getElementById('lineChart').getContext('2d');
const pieChartCtx = document.getElementById('pieChart').getContext('2d');

let barChart, lineChart, pieChart;
let fullData = {};
let currentMode = 'yearly';

async function fetchData(mode) {
  const res = await fetch(`${API_URL}${mode}`, {
    headers: { 'x-auth-token': token }
  });
  if (!res.ok) {
    alert('Failed to load data.');
    return {};
  }
  return await res.json();
}

function populateYearMonthSelectors(data) {
  yearSelect.innerHTML = '';
  monthSelect.innerHTML = '';
  const years = Object.keys(data);
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  if (years.length > 0) {
    const months = Object.keys(data[years[0]].months || {});
    months.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      monthSelect.appendChild(opt);
    });
  }
}

function updateCategoryFilter(data, mode) {
  const categories = new Set();
  for (const y in data) {
    for (const m in data[y].months) {
      for (const d in data[y].months[m].days) {
        data[y].months[m].days[d].entries.forEach(([_, __, cat]) => {
          if (cat) categories.add(cat);
        });
      }
    }
  }
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  [...categories].forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function extractChartData(data, mode, selectedYear, selectedMonth, category) {
  let labels = [], values = [], pieCategories = {}, lineValues = [];

  if (mode === 'yearly') {
    for (const y in data) {
      labels.push(y);
      values.push(data[y].total);
    }
  }

  if (mode === 'monthly') {
    const yearData = data[selectedYear]?.months || {};
    for (const m in yearData) {
      labels.push(m);
      values.push(yearData[m].total);
    }
  }

  if (mode === 'daily') {
    const dayData = data[selectedYear]?.months[selectedMonth]?.days || {};
    for (const d in dayData) {
      let dayTotal = 0;
      dayData[d].entries.forEach(([t, amt, cat]) => {
        if (!category || cat === category) {
          dayTotal += amt;
          pieCategories[cat] = (pieCategories[cat] || 0) + amt;
        }
      });
      labels.push(`${selectedMonth} ${d}`);
      values.push(dayTotal);
    }
  }

  lineValues = [...values];
  return { labels, values, pieCategories, lineValues };
}

function renderChart(ctx, type, labels, values, title, onClick = null) {
  if (type === 'bar' && barChart) barChart.destroy();
  if (type === 'line' && lineChart) lineChart.destroy();
  if (type === 'pie' && pieChart) pieChart.destroy();

  const chart = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: type === 'pie'
          ? labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
          : 'rgba(75,192,192,0.5)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (type === 'bar' && onClick && elements.length > 0) {
          const i = elements[0].index;
          onClick(labels[i]);
        }
      },
      scales: type === 'pie' ? {} : {
        y: {
          beginAtZero: true,
          ticks: { color: '#000' },
        },
        x: {
          ticks: { color: '#000' },
        }
      },
      plugins: {
        legend: { labels: { color: '#000' } },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ₹${context.formattedValue}`;
            }
          }
        }
      }
    }
  });

  if (type === 'bar') barChart = chart;
  if (type === 'line') lineChart = chart;
  if (type === 'pie') pieChart = chart;
}

function exportToImage() {
  const link = document.createElement('a');
  link.download = 'financia_chart.png';
  link.href = barChart.toBase64Image();
  link.click();
}

function exportToCSV(labels, values) {
  let csv = 'Label,Amount\n';
  labels.forEach((l, i) => {
    csv += `${l},${values[i]}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, 'financia_data.csv');
}

function drillDownHandler(label) {
  if (currentMode === 'yearly') {
    modeSelect.value = 'monthly';
    yearSelect.value = label;
    triggerUpdate();
  } else if (currentMode === 'monthly') {
    modeSelect.value = 'daily';
    yearSelect.value = yearSelect.value;
    monthSelect.value = label;
    triggerUpdate();
  }
}

function triggerUpdate() {
  currentMode = modeSelect.value;
  yearSelect.style.display = currentMode !== 'yearly' ? 'inline-block' : 'none';
  monthSelect.style.display = currentMode === 'daily' ? 'inline-block' : 'none';

  const selectedYear = yearSelect.value;
  const selectedMonth = monthSelect.value;
  const category = categoryFilter.value;

  const { labels, values, pieCategories, lineValues } = extractChartData(
    fullData, currentMode, selectedYear, selectedMonth, category
  );

  renderChart(barChartCtx, 'bar', labels, values, 'Spending', drillDownHandler);
  renderChart(lineChartCtx, 'line', labels, lineValues, 'Trend');
  renderChart(pieChartCtx, 'pie', Object.keys(pieCategories), Object.values(pieCategories), 'By Category');
}

modeSelect.addEventListener('change', triggerUpdate);
yearSelect.addEventListener('change', triggerUpdate);
monthSelect.addEventListener('change', triggerUpdate);
categoryFilter.addEventListener('change', triggerUpdate);
document.getElementById('exportImageBtn').addEventListener('click', exportToImage);
document.getElementById('exportCSVBtn').addEventListener('click', () => {
  const labels = barChart.data.labels;
  const values = barChart.data.datasets[0].data;
  exportToCSV(labels, values);
});

// Initial load
(async () => {
  fullData = await fetchData('daily-detail');
  populateYearMonthSelectors(fullData);
  updateCategoryFilter(fullData, 'daily-detail');
  triggerUpdate();
})();
