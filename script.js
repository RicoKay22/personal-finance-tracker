let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;

const form = document.getElementById('transactionForm');
const tableBody = document.querySelector('#txTable tbody');
const filterCategory = document.getElementById('filterCategory');

// Add Transaction
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const t = {
    id: Date.now(),
    description: document.getElementById('description').value.trim(),
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    date: document.getElementById('date').value,
    category: document.getElementById('category').value.trim()
  };
  transactions.push(t);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  form.reset();
  renderTransactions();
});

// Render Transactions
function renderTransactions() {
  tableBody.innerHTML = '';
  const cats = new Set();
  transactions.forEach(t => {
    cats.add(t.category);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.description}</td>
      <td>${t.amount.toFixed(2)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td><button onclick="deleteTx(${t.id})">❌</button></td>
    `;
    tableBody.appendChild(tr);
  });

  filterCategory.innerHTML = '<option value="">All Categories</option>' +
    Array.from(cats).map(c => `<option value="${c}">${c}</option>`).join('');

  renderChart();
}

// Delete Transaction
function deleteTx(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
}

// Render Chart
function renderChart() {
  const ctx = document.getElementById('financeChart').getContext('2d');
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Income vs Expense' },
        legend: { position: 'bottom' }
      }
    }
  });
}

// Initialize
renderTransactions();
