/* ============================================================
   Mela QR Research Dashboard — main script
   All interactions, localStorage persistence, CSV export.
   ============================================================ */

const STORAGE_KEYS = {
  calendar: 'melaqr_calendar_v1',
  exec: 'melaqr_exec_v1',
  experiment: 'melaqr_experiment_v1',
  metrics: 'melaqr_metrics_v1'
};

/* ============================================================
   SIDEBAR NAV — mobile toggle + active section highlight
   ============================================================ */
(function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const navItems = document.querySelectorAll('.nav-item');

  menuToggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile sidebar when a nav item is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active section highlighting via IntersectionObserver
  const sections = document.querySelectorAll('.section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }
})();

/* ============================================================
   CONTENT CALENDAR
   ============================================================ */
const CALENDAR_DATA = [
  { day: 1, week: 1, type: 'Product demo', title: 'Mela QR in 30 seconds', hook: 'Watch a customer order in 20 seconds.', cta: 'Request a demo', status: 'planned' },
  { day: 2, week: 1, type: 'Problem/solution', title: 'Dirty menus cost time', hook: "Menus get dirty. Here's a simple fix.", cta: 'Comment DEMO', status: 'planned' },
  { day: 3, week: 1, type: 'Education', title: '3 menu tips', hook: '3 ways to make your menu easier to scan.', cta: 'Follow for more', status: 'planned' },
  { day: 4, week: 1, type: 'Personalized', title: 'Custom video for Cafe A', hook: 'Made this for Cafe A.', cta: 'DM us', status: 'planned' },
  { day: 5, week: 1, type: 'Objections', title: 'Will customers use QR?', hook: 'Will customers actually use QR menus?', cta: 'Book a demo', status: 'planned' },
  { day: 6, week: 1, type: 'Product demo', title: 'QR ordering walkthrough', hook: 'From scan to order in one minute.', cta: 'Request a demo', status: 'planned' },
  { day: 7, week: 1, type: 'Education', title: 'Menu updates made easy', hook: 'Change a price in 10 seconds.', cta: 'Follow for more', status: 'planned' },

  { day: 8, week: 2, type: 'Problem/solution', title: 'Lunch rush bottleneck', hook: 'Lunch rush and only one waiter.', cta: 'Comment DEMO', status: 'planned' },
  { day: 9, week: 2, type: 'Personalized', title: 'Custom video for Cafe B', hook: 'Made this for Cafe B.', cta: 'DM us', status: 'planned' },
  { day: 10, week: 2, type: 'Product demo', title: 'Digital menu tour', hook: 'See how guests browse your menu.', cta: 'Request a demo', status: 'planned' },
  { day: 11, week: 2, type: 'Objections', title: 'Price concerns answered', hook: 'Is it worth the cost?', cta: 'Book a demo', status: 'planned' },
  { day: 12, week: 2, type: 'Education', title: 'Menu psychology tip', hook: 'Where you place items matters.', cta: 'Follow for more', status: 'planned' },
  { day: 13, week: 2, type: 'Personalized', title: 'Custom video for Restaurant C', hook: 'Made this for Restaurant C.', cta: 'DM us', status: 'planned' },
  { day: 14, week: 2, type: 'Problem/solution', title: 'Printed menu reprints', hook: 'Stop reprinting menus every season.', cta: 'Comment DEMO', status: 'planned' },

  { day: 15, week: 3, type: 'Product demo', title: 'Cart and checkout demo', hook: 'Watch the full ordering flow.', cta: 'Request a demo', status: 'planned' },
  { day: 16, week: 3, type: 'Education', title: 'Language options', hook: 'Serve guests in Amharic and English.', cta: 'Follow for more', status: 'planned' },
  { day: 17, week: 3, type: 'Personalized', title: 'Custom video for Cafe D', hook: 'Made this for Cafe D.', cta: 'DM us', status: 'planned' },
  { day: 18, week: 3, type: 'Objections', title: 'Connectivity concerns', hook: 'What if the wifi is slow?', cta: 'Book a demo', status: 'planned' },
  { day: 19, week: 3, type: 'Problem/solution', title: 'Staff time saved', hook: 'Less time taking orders, more time serving.', cta: 'Comment DEMO', status: 'planned' },
  { day: 20, week: 3, type: 'Product demo', title: 'Pilot onboarding', hook: 'Setting up takes minutes.', cta: 'Request a demo', status: 'planned' },
  { day: 21, week: 3, type: 'Education', title: 'Seasonal menu changes', hook: 'Update your menu for the season.', cta: 'Follow for more', status: 'planned' },

  { day: 22, week: 4, type: 'Personalized', title: 'Custom video for Restaurant E', hook: 'Made this for Restaurant E.', cta: 'DM us', status: 'planned' },
  { day: 23, week: 4, type: 'Product demo', title: 'Analytics preview', hook: 'See which items get viewed most.', cta: 'Request a demo', status: 'planned' },
  { day: 24, week: 4, type: 'Problem/solution', title: 'Customer wait times', hook: 'Reduce the wait for a menu.', cta: 'Comment DEMO', status: 'planned' },
  { day: 25, week: 4, type: 'Objections', title: 'Trust and data', hook: 'Where does customer data go?', cta: 'Book a demo', status: 'planned' },
  { day: 26, week: 4, type: 'Education', title: 'Photo tips for menus', hook: 'Better photos sell more dishes.', cta: 'Follow for more', status: 'planned' },
  { day: 27, week: 4, type: 'Personalized', title: 'Custom video for Cafe F', hook: 'Made this for Cafe F.', cta: 'DM us', status: 'planned' },
  { day: 28, week: 4, type: 'Product demo', title: 'QR stand setup', hook: 'From box to table in 5 minutes.', cta: 'Request a demo', status: 'planned' },
  { day: 29, week: 4, type: 'Problem/solution', title: 'Menu errors', hook: 'Out-of-date prices confuse guests.', cta: 'Comment DEMO', status: 'planned' },
  { day: 30, week: 4, type: 'Education', title: 'Recap and next steps', hook: 'What we learned this month.', cta: 'Follow for more', status: 'planned' }
];

let calendarState = {};

function loadCalendarState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.calendar);
    calendarState = saved ? JSON.parse(saved) : {};
  } catch (e) {
    calendarState = {};
  }
}

function saveCalendarState() {
  try {
    localStorage.setItem(STORAGE_KEYS.calendar, JSON.stringify(calendarState));
  } catch (e) { /* storage may be full or unavailable */ }
}

function getCalendarItem(day) {
  return calendarState[day] || {};
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const filterWeek = document.getElementById('filterWeek').value;
  const filterType = document.getElementById('filterType').value;
  grid.innerHTML = '';

  let published = 0;
  CALENDAR_DATA.forEach(item => {
    const state = getCalendarItem(item.day);
    const status = state.status || item.status;
    const title = state.title || item.title;
    if (status === 'published') published++;

    if (filterWeek !== 'all' && String(item.week) !== filterWeek) return;
    if (filterType !== 'all' && item.type !== filterType) return;

    const card = document.createElement('button');
    card.className = 'cal-card';
    card.type = 'button';
    card.innerHTML = `
      <div class="cal-card-header">
        <span class="cal-card-day">Day ${item.day} · W${item.week}</span>
        <span class="cal-card-type">${item.type}</span>
      </div>
      <span class="cal-card-title">${title}</span>
      <span class="cal-card-status status-${status.replace(' ', '-')}">${status}</span>
    `;
    card.addEventListener('click', () => openCalendarModal(item.day));
    grid.appendChild(card);
  });

  // Progress
  const pct = Math.round((published / CALENDAR_DATA.length) * 100);
  document.getElementById('calendarProgress').textContent = `${published} of ${CALENDAR_DATA.length} published`;
  document.getElementById('calendarProgressFill').style.width = pct + '%';
}

/* Modal */
const calendarModal = document.getElementById('calendarModal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
let currentEditDay = null;

function openCalendarModal(day) {
  currentEditDay = day;
  const item = CALENDAR_DATA.find(d => d.day === day);
  const state = getCalendarItem(day);
  const status = state.status || item.status;
  const notes = state.notes || '';
  const title = state.title || item.title;

  modalTitle.textContent = `Day ${day} · ${item.type}`;
  modalBody.innerHTML = `
    <p><strong>Concept:</strong> ${title}</p>
    <p><strong>Example hook:</strong> ${item.hook}</p>
    <p><strong>Call to action:</strong> ${item.cta}</p>
    <label for="modalStatus">Status</label>
    <select id="modalStatus">
      <option value="planned"${status === 'planned' ? ' selected' : ''}>Planned</option>
      <option value="in progress"${status === 'in progress' ? ' selected' : ''}>In progress</option>
      <option value="published"${status === 'published' ? ' selected' : ''}>Published</option>
      <option value="skipped"${status === 'skipped' ? ' selected' : ''}>Skipped</option>
    </select>
    <label for="modalNotes">Private notes</label>
    <textarea id="modalNotes" placeholder="Add notes about this video...">${notes}</textarea>
  `;
  calendarModal.hidden = false;
  document.getElementById('modalStatus').focus();
}

function closeCalendarModal() {
  calendarModal.hidden = true;
  currentEditDay = null;
}

document.getElementById('modalClose').addEventListener('click', closeCalendarModal);
calendarModal.addEventListener('click', (e) => { if (e.target === calendarModal) closeCalendarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !calendarModal.hidden) closeCalendarModal(); });

document.getElementById('modalSave').addEventListener('click', () => {
  if (currentEditDay === null) return;
  const status = document.getElementById('modalStatus').value;
  const notes = document.getElementById('modalNotes').value;
  calendarState[currentEditDay] = { status, notes };
  saveCalendarState();
  renderCalendar();
  closeCalendarModal();
});

document.getElementById('filterWeek').addEventListener('change', renderCalendar);
document.getElementById('filterType').addEventListener('change', renderCalendar);

/* ============================================================
   EXECUTION PLAN
   ============================================================ */
const EXEC_PLAN = [
  { week: 1, title: 'Week 1: Prepare and validate', tasks: [
    'Review the existing website',
    'Prepare product demonstrations',
    'Build the prospect list',
    'Set up lead tracking',
    'Publish the first videos',
    'Contact initial prospects'
  ]},
  { week: 2, title: 'Week 2: Start selling', tasks: [
    'Continue publishing',
    'Contact additional prospects',
    'Follow up',
    'Book demonstrations',
    'Record objections'
  ]},
  { week: 3, title: 'Week 3: Run experiments', tasks: [
    'Compare the two video strategies',
    'Test direct outreach against video-assisted outreach',
    'Conduct demonstrations',
    'Offer suitable pilots',
    'Review qualified-lead quality'
  ]},
  { week: 4, title: 'Week 4: Convert and evaluate', tasks: [
    'Follow up with active prospects',
    'Seek paying customers',
    'Review funnel conversion rates',
    'Compare channel effort and outcomes',
    "Choose the next month's priorities"
  ]}
];

let execState = {};

function loadExecState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.exec);
    execState = saved ? JSON.parse(saved) : {};
  } catch (e) { execState = {}; }
}

function saveExecState() {
  try { localStorage.setItem(STORAGE_KEYS.exec, JSON.stringify(execState)); }
  catch (e) { /* ignore */ }
}

function renderExecPlan() {
  const grid = document.getElementById('execGrid');
  grid.innerHTML = '';
  EXEC_PLAN.forEach((week, wi) => {
    const card = document.createElement('div');
    card.className = 'exec-week';
    card.innerHTML = `<h2>${week.title}</h2>`;
    week.tasks.forEach((task, ti) => {
      const key = `w${wi}-t${ti}`;
      const done = execState[key] === true;
      const label = document.createElement('label');
      label.className = 'exec-task' + (done ? ' done' : '');
      label.innerHTML = `
        <input type="checkbox" ${done ? 'checked' : ''} data-key="${key}">
        <span>${task}</span>
      `;
      label.querySelector('input').addEventListener('change', (e) => {
        execState[key] = e.target.checked;
        saveExecState();
        label.classList.toggle('done', e.target.checked);
        updateExecProgress();
      });
      card.appendChild(label);
    });
    grid.appendChild(card);
  });
  updateExecProgress();
}

function updateExecProgress() {
  const total = EXEC_PLAN.reduce((sum, w) => sum + w.tasks.length, 0);
  const done = Object.values(execState).filter(v => v === true).length;
  document.getElementById('execProgressText').textContent = `${done} of ${total} tasks complete`;
  document.getElementById('execProgressFill').style.width = (total ? (done / total) * 100 : 0) + '%';
}

/* ============================================================
   EXPERIMENT TRACKING TABLE
   ============================================================ */
let experimentRows = [];

function loadExperimentRows() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.experiment);
    experimentRows = saved ? JSON.parse(saved) : [];
  } catch (e) { experimentRows = []; }
}

function saveExperimentRows() {
  try { localStorage.setItem(STORAGE_KEYS.experiment, JSON.stringify(experimentRows)); }
  catch (e) { /* ignore */ }
}

const EXPERIMENT_COLUMNS = ['prospectId', 'segment', 'group', 'contactDate', 'response', 'qualified', 'meeting', 'demo', 'trial', 'paying', 'acqTime', 'cost', 'notes'];

function renderExperimentTable() {
  const body = document.getElementById('experimentBody');
  body.innerHTML = '';
  experimentRows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    EXPERIMENT_COLUMNS.forEach(col => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = (col === 'cost' || col === 'acqTime') ? 'number' : 'text';
      input.value = row[col] || '';
      input.style.width = col === 'notes' ? '140px' : '90px';
      input.style.border = '1px solid transparent';
      input.style.background = 'transparent';
      input.style.padding = '0.3rem';
      input.style.fontSize = '0.82rem';
      input.addEventListener('input', (e) => {
        experimentRows[idx][col] = e.target.value;
        saveExperimentRows();
      });
      td.appendChild(input);
      tr.appendChild(td);
    });
    const tdDel = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.textContent = '×';
    btn.setAttribute('aria-label', 'Delete row');
    btn.addEventListener('click', () => {
      experimentRows.splice(idx, 1);
      saveExperimentRows();
      renderExperimentTable();
    });
    tdDel.appendChild(btn);
    tr.appendChild(tdDel);
    body.appendChild(tr);
  });
}

document.getElementById('addExpRow').addEventListener('click', () => {
  experimentRows.push({});
  saveExperimentRows();
  renderExperimentTable();
});

document.getElementById('exportExpCsv').addEventListener('click', () => {
  const header = ['Prospect ID', 'Segment', 'Group', 'Contact date', 'Response', 'Qualified', 'Meeting', 'Demo', 'Trial', 'Paying', 'Acq. time', 'Cost (ETB)', 'Notes'];
  const rows = experimentRows.map(r => EXPERIMENT_COLUMNS.map(c => `"${(r[c] || '').toString().replace(/"/g, '""')}"`).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mela-qr-experiment.csv';
  a.click();
  URL.revokeObjectURL(url);
});

/* ============================================================
   COPY OUTREACH MESSAGE
   ============================================================ */
document.getElementById('copyOutreach').addEventListener('click', async () => {
  const text = document.getElementById('outreachMessage').textContent;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copyOutreach');
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = original; }, 1500);
  } catch (e) {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  }
});

/* ============================================================
   METRICS DASHBOARD
   ============================================================ */
const METRIC_FIELDS = [
  { key: 'prospects', label: 'Prospects identified' },
  { key: 'contacted', label: 'Businesses contacted' },
  { key: 'qualified', label: 'Qualified leads' },
  { key: 'meetings', label: 'Meetings booked' },
  { key: 'demos', label: 'Demonstrations completed' },
  { key: 'trials', label: 'Trials started' },
  { key: 'paying', label: 'Paying customers' },
  { key: 'videos', label: 'Videos published' },
  { key: 'hours', label: 'Total acquisition hours' },
  { key: 'spend', label: 'Total acquisition spending (ETB)' }
];

let metricsState = {};

function loadMetrics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.metrics);
    metricsState = saved ? JSON.parse(saved) : {};
  } catch (e) { metricsState = {}; }
}

function saveMetrics() {
  try { localStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(metricsState)); }
  catch (e) { /* ignore */ }
}

function renderMetricsInputs() {
  const container = document.getElementById('metricsInputs');
  container.innerHTML = '';
  METRIC_FIELDS.forEach(f => {
    const wrap = document.createElement('div');
    wrap.className = 'metric-input';
    wrap.innerHTML = `
      <label for="metric-${f.key}">${f.label}</label>
      <input type="number" id="metric-${f.key}" min="0" step="1" value="${metricsState[f.key] ?? ''}">
    `;
    wrap.querySelector('input').addEventListener('input', (e) => {
      const v = e.target.value === '' ? '' : Number(e.target.value);
      metricsState[f.key] = v;
      saveMetrics();
      renderMetricsOutput();
    });
    container.appendChild(wrap);
  });
}

function safeRate(numerator, denominator) {
  if (!denominator || denominator <= 0) return null;
  return (numerator / denominator) * 100;
}

function renderMetricsOutput() {
  const out = document.getElementById('metricsOutput');
  const m = metricsState;
  const paying = Number(m.paying) || 0;
  const spend = Number(m.spend) || 0;
  const hours = Number(m.hours) || 0;

  const cards = [
    { label: 'Outreach response rate', value: safeRate(Number(m.qualified) || 0, Number(m.contacted) || 0) },
    { label: 'Qualified-lead rate', value: safeRate(Number(m.qualified) || 0, Number(m.contacted) || 0) },
    { label: 'Meeting conversion rate', value: safeRate(Number(m.meetings) || 0, Number(m.qualified) || 0) },
    { label: 'Trial-to-paid conversion', value: safeRate(paying, Number(m.trials) || 0) },
    { label: 'Cost per acquired customer', value: paying > 0 ? (spend / paying) : null, unit: 'ETB' },
    { label: 'Paying customers per acquisition hour', value: hours > 0 ? (paying / hours) : null, unit: 'per hour' }
  ];

  out.innerHTML = cards.map(c => {
    let display;
    if (c.value === null) {
      display = '<em>No data yet</em>';
    } else if (c.unit === 'ETB') {
      display = `<strong>${c.value.toFixed(0)} ETB</strong>`;
    } else if (c.unit === 'per hour') {
      display = `<strong>${c.value.toFixed(3)}</strong>`;
    } else {
      display = `<strong>${c.value.toFixed(1)}%</strong>`;
    }
    return `<div class="metric-output-card"><span>${c.label}</span>${display}</div>`;
  }).join('');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadCalendarState();
  loadExecState();
  loadExperimentRows();
  loadMetrics();

  renderCalendar();
  renderExecPlan();
  renderExperimentTable();
  renderMetricsInputs();
  renderMetricsOutput();
});