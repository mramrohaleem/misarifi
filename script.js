/* ===== إعداد قاعدة البيانات ===== */
const db = new Dexie('misarifiDB');
db.version(1).stores({
  transactions: '++id, amount, category, date, note'
});

/* ===== مراجع الواجهة ===== */
const form   = document.getElementById('txnForm');
const list   = document.getElementById('txnList');
const chartC = document.getElementById('summaryChart');
let   chart;   // الرسم البياني الحالي

/* ===== إضافة حركة ===== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    amount:   parseFloat(form.amount.value),
    category: form.category.value.trim() || 'غير مُصنَّف',
    date:     form.date.value || new Date().toISOString().slice(0, 10),
    note:     form.note.value.trim()
  };

  await db.transactions.add(data);
  form.reset();
  refreshUI();
});

/* ===== تحديث الواجهة ===== */
async function refreshUI () {
  const txns = await db.transactions.toArray();
  renderList(txns);
  renderChart(txns);
}

/* ===== قائمة الحركات ===== */
function renderList (txns) {
  list.innerHTML = '';
  txns.sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(t => {
        const li = document.createElement('li');
        li.className = 'flex justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg';
        li.innerHTML =
          `<span>${t.date} • ${t.category}</span>
           <span class="font-semibold">${t.amount.toFixed(2)} ج</span>`;
        list.appendChild(li);
      });
}

/* ===== ملخّص الرسم البياني ===== */
function renderChart (txns) {
  const sums = {};
  txns.forEach(t => {
    sums[t.category] = (sums[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(sums);
  const data   = Object.values(sums);

  if (chart) chart.destroy();
  chart = new Chart(chartC, {
    type: 'pie',
    data: { labels, datasets: [{ data }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

/* ===== تشغيل أولي ===== */
refreshUI();
