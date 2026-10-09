/* =========================================
   MONEY TRACKER APP - STEP 4
   Progressive Tax Brackets + State Manager
   ========================================= */

const CATEGORIES = ["Income","Groceries","Dining","Bills and Utilities","Subscriptions","Transfers","Transportation","Shopping","Health","Entertainment","Fees and Interest","Miscellaneous"];

const CATEGORY_FLOW_MAP = {
  "Income": "Income", "Bills and Utilities": "Fixed Bill", "Subscriptions": "Fixed Bill", "Transfers": "Internal Transfer",
  "Groceries": "Flexible Spending", "Dining": "Flexible Spending", "Transportation": "Flexible Spending",
  "Shopping": "Flexible Spending", "Health": "Flexible Spending", "Entertainment": "Flexible Spending",
  "Fees and Interest": "Flexible Spending", "Miscellaneous": "Flexible Spending"
};

const CATEGORY_COLORS = {
  "Bills and Utilities": { bg: "rgba(0, 229, 255, 0.15)", color: "#00e5ff", border: "rgba(0, 229, 255, 0.4)", glow: "rgba(0, 229, 255, 0.25)" },
  "Groceries": { bg: "rgba(54, 240, 151, 0.15)", color: "#36f097", border: "rgba(54, 240, 151, 0.4)", glow: "rgba(54, 240, 151, 0.25)" },
  "Dining": { bg: "rgba(255, 170, 0, 0.15)", color: "#ffaa00", border: "rgba(255, 170, 0, 0.4)", glow: "rgba(255, 170, 0, 0.25)" },
  "Shopping": { bg: "rgba(255, 0, 85, 0.15)", color: "#ff0055", border: "rgba(255, 0, 85, 0.4)", glow: "rgba(255, 0, 85, 0.25)" },
  "Subscriptions": { bg: "rgba(157, 78, 221, 0.15)", color: "#9d4edd", border: "rgba(157, 78, 221, 0.4)", glow: "rgba(157, 78, 221, 0.25)" },
  "Transportation": { bg: "rgba(0, 119, 255, 0.15)", color: "#0077ff", border: "rgba(0, 119, 255, 0.4)", glow: "rgba(0, 119, 255, 0.25)" },
  "Health": { bg: "rgba(255, 107, 107, 0.15)", color: "#ff6b6b", border: "rgba(255, 107, 107, 0.4)", glow: "rgba(255, 107, 107, 0.25)" },
  "Entertainment": { bg: "rgba(247, 37, 133, 0.15)", color: "#f72585", border: "rgba(247, 37, 133, 0.4)", glow: "rgba(247, 37, 133, 0.25)" },
  "Transfers": { bg: "rgba(114, 9, 183, 0.15)", color: "#7209b7", border: "rgba(114, 9, 183, 0.4)", glow: "rgba(114, 9, 183, 0.25)" },
  "Fees and Interest": { bg: "rgba(255, 84, 0, 0.15)", color: "#ff5400", border: "rgba(255, 84, 0, 0.4)", glow: "rgba(255, 84, 0, 0.25)" },
  "Income": { bg: "rgba(0, 255, 136, 0.15)", color: "#00ff88", border: "rgba(0, 255, 136, 0.4)", glow: "rgba(0, 255, 136, 0.25)" },
  "Miscellaneous": { bg: "rgba(138, 143, 158, 0.15)", color: "#8a8f9e", border: "rgba(138, 143, 158, 0.4)", glow: "rgba(138, 143, 158, 0.2)" },
  "Other": { bg: "rgba(255, 255, 255, 0.1)", color: "#f0f2f8", border: "rgba(255, 255, 255, 0.2)", glow: "rgba(255, 255, 255, 0.1)" }
};

const CATEGORY_RULES = [
  { contains: "ROUNDUP", category: "Transfers", flow: "Internal Transfer" },
  { contains: "VAULT", category: "Transfers", flow: "Internal Transfer" },
  { contains: "INTEREST", category: "Income", flow: "Income" },
  { contains: "DEPOSIT", category: "Income", flow: "Income" },
  { contains: "PIONEER", category: "Income", flow: "Income" },
  { contains: "WAL-MART", category: "Groceries", flow: "Flexible Spending" },
  { contains: "WALMART", category: "Groceries", flow: "Flexible Spending" },
  { contains: "SUPERMARKET", category: "Groceries", flow: "Flexible Spending" },
  { contains: "MCDONALD", category: "Dining", flow: "Flexible Spending" },
  { contains: "SONIC", category: "Dining", flow: "Flexible Spending" },
  { contains: "RESTAURANT", category: "Dining", flow: "Flexible Spending" },
  { contains: "T-MOBILE", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "TMOBILE", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "OKLAHOMA NATURAL", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "US BANK", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "MORTGAGE", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "CREDIT UNION", category: "Bills and Utilities", flow: "Fixed Bill" },
  { contains: "SPOTIFY", category: "Subscriptions", flow: "Fixed Bill" },
  { contains: "PARAMOUNT", category: "Subscriptions", flow: "Fixed Bill" },
  { contains: "APPLE", category: "Subscriptions", flow: "Fixed Bill" },
  { contains: "PEACOCK", category: "Subscriptions", flow: "Fixed Bill" },
  { contains: "LOWES", category: "Shopping", flow: "Flexible Spending" },
  { contains: "SAM'S CLUB", category: "Shopping", flow: "Flexible Spending" }
];

// Default tax states — user can add more via the UI
const DEFAULT_TAX_STATES = [
  {
    code: 'OK', name: 'Oklahoma',
    brackets: [
      { min: 0, max: 1000, rate: 0.25 },
      { min: 1000, max: 2500, rate: 0.75 },
      { min: 2500, max: 3750, rate: 1.75 },
      { min: 3750, max: 4900, rate: 2.75 },
      { min: 4900, max: 7200, rate: 3.75 },
      { min: 7200, max: MAX_BRACKET, rate: 4.75 }
    ]
  },
  {
    code: 'KS', name: 'Kansas',
    brackets: [
      { min: 0, max: 15000, rate: 3.10 },
      { min: 15000, max: 30000, rate: 5.25 },
      { min: 30000, max: MAX_BRACKET, rate: 5.70 }
    ]
  },
  { code: 'CO', name: 'Colorado', brackets: [{ min: 0, max: MAX_BRACKET, rate: 4.40 }] },
  { code: 'TX', name: 'Texas', brackets: [{ min: 0, max: MAX_BRACKET, rate: 0 }] },
  { code: 'FL', name: 'Florida', brackets: [{ min: 0, max: MAX_BRACKET, rate: 0 }] }
];

const INITIAL_EMPTY_STATE = {
  version: 3,
  accounts: {
    CHECKING: { id: "CHECKING", name: "Joint Checking", verifiedBalance: 0.00 },
    SAVINGS: { id: "SAVINGS", name: "Joint Savings", verifiedBalance: 0.00 }
  },
  vaults: [], pendingItems: [], transactions: [],
  scenarios: [{ id: "sc_honda", name: "Increase Honda Payment", amount: -100.00, active: true }],
  suggestedVaults: [], nicknameRules: [], loans: [],
  taxStates: JSON.parse(JSON.stringify(DEFAULT_TAX_STATES)),
  selectedState: 'OK'
};

class MoneyTrackerApp {
  constructor() {
    this.state = this.loadState();
    this.currentTab = 'checking';
    this.chartRanges = { checking: 'week', networth: 'year', forecaster: 'year' };
    this.selectedRows = new Set();
    this.calendarMonth = new Date();
    this.currentDrawerDate = null;
    this.resizeTimeout = null;
    this.saveTimeout = null;
    this.searchTimeout = null;
    this.sortState = { col: 'date', asc: false };
    this.compactDensity = false;
    this.searchQuery = '';
    this.stagedFiles = [];
    this.editingStateCode = null;
  }

  /* ============ STORAGE ============ */
  loadState() {
    const saved = localStorage.getItem('MONEY_TRACKER_STATE_V3');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        p.vaults = p.vaults || []; p.pendingItems = p.pendingItems || [];
        p.transactions = p.transactions || [];
        p.scenarios = p.scenarios || [{ id: "sc_honda", name: "Increase Honda Payment", amount: -100.00, active: true }];
        p.suggestedVaults = p.suggestedVaults || []; p.nicknameRules = p.nicknameRules || [];
        p.loans = p.loans || [];
        p.accounts = p.accounts || JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE.accounts));
        // Sanitize account names (remove old account numbers)
        if (p.accounts.CHECKING) {
          p.accounts.CHECKING.name = p.accounts.CHECKING.name.replace(/\s+\d{4}$/, '');
        }
        if (p.accounts.SAVINGS) {
          p.accounts.SAVINGS.name = p.accounts.SAVINGS.name.replace(/\s+\d{4}$/, '');
        }
        // Ensure taxStates exists and has defaults
        if (!p.taxStates || !Array.isArray(p.taxStates) || p.taxStates.length === 0) {
          p.taxStates = JSON.parse(JSON.stringify(DEFAULT_TAX_STATES));
        }
        if (!p.selectedState) p.selectedState = p.taxStates[0]?.code || 'OK';
        return p;
      } catch(e) { console.error("State load error:", e); }
    }
    return JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE));
  }

  saveState() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try { localStorage.setItem('MONEY_TRACKER_STATE_V3', JSON.stringify(this.state)); }
      catch(e) { console.error("Save error:", e); this.showToast("Storage full!"); }
    }, 1500);
  }

  /* ============ INIT ============ */
  init() {
    this.recalculateBalances();
    this.applyNicknameRules();
    this.cleanSpotify();
    this.recalculateLoanBalances();
    this.renderTabContent(this.currentTab);
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    document.getElementById('tabStrip').addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn) this.switchTab(btn.dataset.tab);
    });

    document.body.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (typeof this[action] === 'function') {
          e.preventDefault();
          this[action](actionEl);
        }
        return;
      }
      const sortEl = e.target.closest('th[data-sort]');
      if (sortEl) { this.sortTable(sortEl.dataset.sort); return; }
      const lockEl = e.target.closest('[data-toggle-lock]');
      if (lockEl) { this.toggleLock(lockEl.dataset.toggleLock); return; }
      const rangeEl = e.target.closest('[data-chart-range]');
      if (rangeEl) { this.setChartRange(rangeEl.dataset.chartRange); return; }
      const nwEl = e.target.closest('[data-networth-range]');
      if (nwEl) {
        this.chartRanges.networth = nwEl.dataset.networthRange;
        document.querySelectorAll('[data-networth-range]').forEach(b => b.classList.remove('active-mode'));
        nwEl.classList.add('active-mode');
        this.renderCharts(); return;
      }
      const fcEl = e.target.closest('[data-forecaster-range]');
      if (fcEl) {
        this.chartRanges.forecaster = fcEl.dataset.forecasterRange;
        document.querySelectorAll('[data-forecaster-range]').forEach(b => b.classList.remove('active-mode'));
        fcEl.classList.add('active-mode');
        this.renderCharts(); return;
      }
    });

    document.body.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('.cat-select')) this.updateRowCategory(t.dataset.txId, t.value);
      else if (t.matches('[data-row-checkbox]')) this.toggleRowSelect(t.dataset.rowCheckbox, t.checked);
      else if (t.matches('#checkingHeaderSelect')) this.selectAllRows('checking', t.checked);
      else if (t.matches('#payState')) {
        this.state.selectedState = t.value;
        this.saveState();
        this.calculatePaycheck();
      }
    });

    document.body.addEventListener('input', (e) => {
      if (e.target.matches('#checkingSearch')) {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.toLowerCase();
          this.renderCheckingTable();
        }, 300);
      }
    });

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) cancelAnimationFrame(this.resizeTimeout);
      this.resizeTimeout = requestAnimationFrame(() => this.renderCharts());
    });

    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
    this.renderTabContent(tabId);
  }

  renderTabContent(tabId) {
    const main = document.getElementById('mainContent');
    const t = {
      checking: () => this.tplChecking(),
      savings: () => this.tplSavings(),
      networth: () => this.tplNetworth(),
      debts: () => this.tplDebts(),
      paycheck: () => this.tplPaycheck(),
      calendar: () => this.tplCalendar(),
      forecaster: () => this.tplForecaster(),
      apy: () => this.tplApy()
    };
    main.innerHTML = (t[tabId] || t.checking)();

    try {
      if (tabId === 'checking') this.renderCheckingView();
      if (tabId === 'savings') this.renderSavingsView();
      if (tabId === 'networth') this.renderNetWorthView();
      if (tabId === 'debts') this.renderDebtsView();
      if (tabId === 'paycheck') this.calculatePaycheck();
      if (tabId === 'calendar') this.renderCalendarView();
      if (tabId === 'forecaster') this.renderForecaster();
      if (tabId === 'apy') this.renderAPY();
    } catch (e) {
      console.error("Tab render error:", e);
      this.showToast("Render error. Check console.");
    }
    setTimeout(() => { try { this.renderCharts(); } catch(e) { console.error(e); } }, 50);
  }

  /* ============ TEMPLATES ============ */
  tplChecking() {
    return `
      <section class="view-container active">
        <div class="stat-header" id="checkingStats"></div>
        <div class="card" style="margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1rem; font-weight:600;">Checking Balance History</h3>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-sm chart-mode-btn active-mode" data-chart-range="week">week</button>
                <button class="btn btn-sm chart-mode-btn" data-chart-range="month">month</button>
                <button class="btn btn-sm chart-mode-btn" data-chart-range="year">year</button>
              </div>
            </div>
          </div>
          <canvas id="checkingChart" height="260" style="width:100%; display:block;"></canvas>
        </div>
        <div class="table-toolbar">
          <div class="search-box">
            <input type="text" id="checkingSearch" placeholder="Search transactions..." value="${this.escapeHtml(this.searchQuery)}">
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm" data-action="toggleDensity">Toggle Density</button>
            <button class="btn btn-sm" data-action="openMassEditModal">Mass Edit</button>
            <button class="btn btn-sm btn-primary" data-action="openAddPendingModal">+ Add Pending</button>
          </div>
        </div>
        <div class="table-container card ${this.compactDensity ? 'compact-density' : ''}" style="padding:0;" id="checkingTableContainer">
          <table id="checkingTable">
            <thead><tr>
              <th style="width:30px;"><input type="checkbox" id="checkingHeaderSelect"></th>
              <th data-sort="date">Date ${this.sortArrow('date')}</th>
              <th data-sort="description">Description ${this.sortArrow('description')}</th>
              <th data-sort="category">Category ${this.sortArrow('category')}</th>
              <th>Flow</th>
              <th data-sort="amount">Amount ${this.sortArrow('amount')}</th>
              <th data-sort="balance">Balance ${this.sortArrow('balance')}</th>
              <th>Status</th><th>Lock</th>
            </tr></thead>
            <tbody id="checkingTableBody"></tbody>
          </table>
        </div>
      </section>`;
  }

  tplSavings() {
    return `
      <section class="view-container active">
        <div class="stat-header" id="savingsStats"></div>
        <div class="card" style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1rem; font-weight:600;">Vault Balances</h3>
            <button class="btn btn-sm btn-primary" data-action="openVaultModal">+ New Vault</button>
          </div>
          <div id="vaultList"></div>
        </div>
        <div class="card">
          <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Savings Ledger</h3>
          <div class="table-container" style="border:none;">
            <table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody id="savingsTableBody"></tbody></table>
          </div>
        </div>
      </section>`;
  }

  tplNetworth() {
    return `
      <section class="view-container active">
        <div class="stat-header" id="networthStats"></div>
        <div class="card" style="margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1rem; font-weight:600;">Total Household Position Trend</h3>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-sm chart-mode-btn active-mode" data-networth-range="week">week</button>
                <button class="btn btn-sm chart-mode-btn" data-networth-range="month">month</button>
                <button class="btn btn-sm chart-mode-btn" data-networth-range="year">year</button>
              </div>
            </div>
          </div>
          <canvas id="networthChart" height="260" style="width:100%; display:block;"></canvas>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
          <div class="card">
            <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Spending by Category</h3>
            <canvas id="categoryDonut" height="240" style="width:100%; display:block;"></canvas>
            <div id="categoryLegend" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:0.5rem; margin-top:1rem;"></div>
          </div>
          <div class="card">
            <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Roundup Sweeps Summary</h3>
            <div id="roundupsSummary"></div>
          </div>
        </div>
      </section>`;
  }

  tplDebts() {
    return `
      <section class="view-container active">
        <div class="stat-header" id="debtStats"></div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1rem; font-weight:600;">Your Debts</h3>
              <button class="btn btn-sm btn-primary" data-action="openAddLoanModal">+ Add Loan</button>
            </div>
            <div id="loanList"></div>
          </div>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1rem; font-weight:600;">What-If Payoff Simulator</h3>
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
            </div>
            <div id="loanSimControls"></div>
            <div id="loanSimResults"></div>
            <canvas id="debtChart" height="200" style="width:100%; display:block; margin-top:1rem;"></canvas>
          </div>
        </div>
      </section>`;
  }

  tplPaycheck() {
  const stateOpts = this.state.taxStates.map(s =>
    `<option value="${s.code}" ${s.code === this.state.selectedState ? 'selected' : ''}>${this.escapeHtml(s.name)} (${s.code})</option>`
  ).join('');
  return `
    <section class="view-container active">
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
        <div class="card">
          <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Income Details</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Hourly Rate ($)</label><input type="number" id="payHourlyRate" value="20" oninput="app.debouncedPaycheck()"></div>
            <div><label class="stat-label">Hours per Week</label><input type="number" id="payHours" value="40" oninput="app.debouncedPaycheck()"></div>
            <div><label class="stat-label">Days per Week</label><input type="number" id="payDays" value="5" oninput="app.debouncedPaycheck()"></div>
            <div><label class="stat-label">Weeks per Year</label><input type="number" id="payWeeks" value="52" oninput="app.debouncedPaycheck()"></div>
          </div>
        </div>
        <div class="card">
          <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Deductions & Taxes</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div>
              <label class="stat-label">State</label>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <select id="payState" style="flex:1;">${stateOpts}</select>
                <button class="btn btn-sm" data-action="openTaxBracketModal" title="Manage state tax brackets">⚙️</button>
              </div>
            </div>
            <div><label class="stat-label">Federal Tax Rate (%)</label><input type="number" id="payFederalRate" value="12" oninput="app.debouncedPaycheck()"></div>
            <div><label class="stat-label">Monthly Benefits Cost ($)</label><input type="number" id="payBenefits" value="0" oninput="app.debouncedPaycheck()"></div>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="font-size:1rem; font-weight:600;">Paycheck Summary</h3>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <label class="stat-label" style="margin:0;">Period</label>
            <select id="payPeriod" onchange="app.calculatePaycheck()" style="width:auto; min-width:130px;">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly" selected>Yearly</option>
            </select>
          </div>
        </div>
        <div id="paycheckResults"></div>
      </div>
    </section>`;
  }

  tplCalendar() {
    return `
      <section class="view-container active">
        <div id="calendarMonthSummary" style="margin-bottom:1rem;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn btn-sm" data-action="changeMonth" data-offset="-1">← Prev</button>
            <h2 id="calendarMonthTitle" style="font-size:1.2rem; font-weight:700;"></h2>
            <button class="btn btn-sm" data-action="changeMonth" data-offset="1">Next →</button>
          </div>
          <button class="btn btn-sm btn-primary" data-action="openRecurringModal">+ Add Recurring</button>
        </div>
        <div class="calendar-desktop-view">
          <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div><div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div><div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div><div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
          </div>
          <div class="calendar-grid" id="calendarGrid" style="margin-top:6px;"></div>
        </div>
        <div class="calendar-mobile-view" id="calendarMobileList"></div>
      </section>`;
  }

  tplForecaster() {
    return `
      <section class="view-container active">
        <div class="card" style="margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <h3 style="font-size:1rem; font-weight:600;">Monthly Baseline</h3>
            <button class="btn btn-sm" data-action="syncForecaster">🔄 Auto-Sync</button>
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem;">
            <div><label class="stat-label">AVG INCOME</label>
              <div class="input-currency-wrapper"><span>$</span><input type="number" id="fcAvgIncome" value="0.00" step="0.01" oninput="app.debouncedForecaster()"></div>
            </div>
            <div><label class="stat-label">FIXED EXPENSES</label>
              <div class="input-currency-wrapper"><span>$</span><input type="number" id="fcAvgFixed" value="0.00" step="0.01" oninput="app.debouncedForecaster()"></div>
            </div>
            <div><label class="stat-label">FLEXIBLE SPENDING</label>
              <div class="input-currency-wrapper"><span>$</span><input type="number" id="fcAvgVariable" value="0.00" step="0.01" oninput="app.debouncedForecaster()"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="forecast-split-grid" id="forecastOutputCards"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
            <h3 style="font-size:0.95rem; font-weight:600;">What-If Scenarios</h3>
            <button class="btn btn-sm btn-primary" data-action="openAddScenarioModal">+ Add Scenario</button>
          </div>
          <div id="scenarioList" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; flex-wrap:wrap; gap:0.5rem;">
            <h4 style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">PROJECTION</h4>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-sm chart-mode-btn active-mode" data-forecaster-range="week">week</button>
                <button class="btn btn-sm chart-mode-btn" data-forecaster-range="month">month</button>
                <button class="btn btn-sm chart-mode-btn" data-forecaster-range="year">year</button>
              </div>
            </div>
          </div>
          <canvas id="forecasterChart" height="220" style="width:100%; display:block; margin-top:0.5rem;"></canvas>
        </div>
      </section>`;
  }

  tplApy() {
    return `
      <section class="view-container active">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
          <div class="card">
            <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Simulation Parameters</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div><label class="stat-label">Starting Balance Source</label>
                <select id="apySource" onchange="app.updateApySource()">
                  <option value="VAULTS">Vault Total</option>
                  <option value="CHECKING">Checking Available</option>
                  <option value="CUSTOM">Custom Amount</option>
                </select>
              </div>
              <div><label class="stat-label">Principal Amount ($)</label><input type="number" id="apyPrincipal" value="1119.74" oninput="app.debouncedAPY()"></div>
              <div><label class="stat-label">Annual Percentage Yield (APY %)</label><input type="number" step="0.01" id="apyRate" value="3.30" oninput="app.debouncedAPY()"></div>
              <div><label class="stat-label">Monthly Deposit ($)</label><input type="number" id="apyMonthly" value="200" oninput="app.debouncedAPY()"></div>
              <div><label class="stat-label">Monthly Withdrawal ($)</label><input type="number" id="apyWithdrawal" value="0" oninput="app.debouncedAPY()"></div>
              <div><label class="stat-label">Time Horizon (Years)</label><input type="number" id="apyYears" value="5" min="1" max="30" oninput="app.debouncedAPY()"></div>
            </div>
          </div>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1rem; font-weight:600;">Compound Interest Projection</h3>
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
            </div>
            <canvas id="apyChart" height="220" style="width:100%; display:block;"></canvas>
            <div id="apySummary" style="margin-top:1rem; font-size:0.9rem;"></div>
          </div>
        </div>
      </section>`;
  }

  sortArrow(col) {
    if (this.sortState.col !== col) return '';
    return this.sortState.asc ? '↑' : '↓';
  }

  /* ============ DEBOUNCE ============ */
  debouncedPaycheck() {
    if (this._paycheckT) clearTimeout(this._paycheckT);
    this._paycheckT = setTimeout(() => this.calculatePaycheck(), 250);
  }
  debouncedForecaster() {
    if (this._fcT) clearTimeout(this._fcT);
    this._fcT = setTimeout(() => this.renderForecaster(), 250);
  }
  debouncedAPY() {
    if (this._apyT) clearTimeout(this._apyT);
    this._apyT = setTimeout(() => this.renderAPY(), 250);
  }
  debouncedDebtSim() {
    if (this._dsT) clearTimeout(this._dsT);
    this._dsT = setTimeout(() => this.renderDebtSimulation(), 250);
  }

  /* ============ PROGRESSIVE TAX ENGINE ============ */
  calculateProgressiveTax(income, brackets) {
    if (!brackets || !brackets.length || income <= 0) return 0;
    let tax = 0;
    for (const b of brackets) {
      if (income <= b.min) break;
      const taxable = Math.min(income, b.max) - b.min;
      if (taxable > 0) tax += taxable * (b.rate / 100);
    }
    return tax;
  }

  /* ============ CHECKING VIEW ============ */
  renderCheckingView() {
    const bal = this.getBalances('CHECKING');
    const stats = document.getElementById('checkingStats');
    if (stats) stats.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Available Balance</div>
        <div class="stat-value mono" style="color:var(--accent-primary)">$${bal.available.toFixed(2)}</div>
        <div class="stat-subtext">Spendable Funds</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ledger Balance</div>
        <div class="stat-value mono">$${bal.ledger.toFixed(2)}</div>
        <div class="stat-subtext">$${bal.pending.toFixed(2)} (${this.state.pendingItems.filter(p => p.account === 'CHECKING').length} Pending)</div>
      </div>`;
    this.renderCheckingTable();
  }

  renderCheckingTable() {
    const tbody = document.getElementById('checkingTableBody');
    if (!tbody) return;

    let items = this.getFilteredTransactions('CHECKING');
    items = [...this.state.pendingItems.filter(p => p.account === 'CHECKING'), ...items];

    if (this.searchQuery) {
      const q = this.searchQuery;
      items = items.filter(t =>
        (t.nickname && t.nickname.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => {
      let va = a[this.sortState.col], vb = b[this.sortState.col];
      if (this.sortState.col === 'amount' || this.sortState.col === 'balance') {
        va = parseFloat(va) || 0; vb = parseFloat(vb) || 0;
      }
      if (va < vb) return this.sortState.asc ? -1 : 1;
      if (va > vb) return this.sortState.asc ? 1 : -1;
      return 0;
    });

    const header = document.getElementById('checkingHeaderSelect');
    if (header) header.checked = items.length > 0 && items.every(i => this.selectedRows.has(i.id));

    const limit = 500;
    const display = items.slice(0, limit);
    let html = display.map(t => this.buildCheckingRow(t)).join('');
    if (items.length > limit) {
      html += `<tr><td colspan="9" style="text-align:center; padding:1rem; color:var(--text-muted); font-size:0.8rem;">Showing first ${limit} of ${items.length}. Use search to narrow.</td></tr>`;
    }
    tbody.innerHTML = html;
  }

  buildCheckingRow(t) {
    const isPending = t.status === 'pending';
    const colors = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Miscellaneous'];
    const flow = CATEGORY_FLOW_MAP[t.category] || 'Flexible Spending';
    const catOpts = CATEGORIES.map(c => `<option value="${c}" ${t.category === c ? 'selected' : ''}>${c}</option>`).join('');
    const dn = t.nickname
      ? `<div style="font-weight:700; color:var(--accent-primary);">${this.escapeHtml(t.nickname)}</div><div style="font-size:0.75rem; color:var(--text-dim);">${this.escapeHtml(t.description)}</div>`
      : `<div style="font-weight:600;">${this.escapeHtml(t.description)}</div>`;

    return `<tr data-tx-row="${t.id}">
      <td><input type="checkbox" data-row-checkbox="${t.id}" ${this.selectedRows.has(t.id) ? 'checked' : ''}></td>
      <td class="mono">${t.date}</td>
      <td>${dn}</td>
      <td><div class="cat-select-wrapper" style="--cat-bg:${colors.bg}; --cat-color:${colors.color}; --cat-border:${colors.border}; --cat-glow:${colors.glow};">
        <select class="cat-select" data-tx-id="${t.id}">${catOpts}</select>
      </div></td>
      <td><span style="font-size:0.75rem; color:var(--text-muted)">${flow}</span></td>
      <td class="mono" style="color:${t.amount < 0 ? 'var(--accent-negative)' : 'var(--accent-positive)'}">$${(parseFloat(t.amount) || 0).toFixed(2)}</td>
      <td class="mono">$${(parseFloat(t.balance) || 0).toFixed(2)}</td>
      <td><span class="badge ${isPending ? 'badge-pending' : 'badge-posted'}">${t.status || 'POSTED'}</span></td>
      <td style="cursor:pointer;" data-toggle-lock="${t.id}">${t.locked ? '🔒' : '🔓'}</td>
    </tr>`;
  }

  /* ============ SAVINGS VIEW ============ */
  renderSavingsView() {
    const bal = this.getBalances('SAVINGS');
    const stats = document.getElementById('savingsStats');
    if (stats) stats.innerHTML = `
      <div class="stat-card"><div class="stat-label">Savings Account Ledger</div>
        <div class="stat-value mono">$${bal.ledger.toFixed(2)}</div></div>
      <div class="stat-card"><div class="stat-label">Total Vault Earmarks</div>
        <div class="stat-value mono" style="color:var(--accent-secondary)">$${bal.vaults.toFixed(2)}</div></div>`;

    const vc = document.getElementById('vaultList');
    if (vc) {
      if ((this.state.vaults || []).length === 0) {
        vc.innerHTML = '<div style="color:var(--text-muted); padding:1rem 0; text-align:center;">No vaults yet. Click "+ New Vault".</div>';
      } else {
        vc.innerHTML = this.state.vaults.map(v => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-subtle); gap:0.5rem;">
            <div style="min-width:0;">
              <div style="font-weight:600;">${this.escapeHtml(v.name)}</div>
              <div style="font-size:0.75rem; color:var(--text-dim)">Earmarked Sub-balance</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
              <span class="mono" style="font-size:1rem; font-weight:700; background:var(--bg-base); padding:0.3rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); min-width:90px; text-align:right;">$${(parseFloat(v.balance) || 0).toFixed(2)}</span>
              <button class="btn btn-sm" data-action="openVaultTransferModal" data-vault-id="${v.id}">💸</button>
              <button class="btn btn-sm" data-action="openEditVaultModal" data-vault-id="${v.id}">⚙️</button>
            </div>
          </div>`).join('');
      }
    }
    this.renderSavingsTable();
  }

  renderSavingsTable() {
    const tbody = document.getElementById('savingsTableBody');
    if (!tbody) return;
    const items = this.getFilteredTransactions('SAVINGS').slice(0, 200);
    tbody.innerHTML = items.map(t => `
      <tr>
        <td class="mono">${t.date}</td>
        <td>${this.escapeHtml(t.nickname || t.description)}</td>
        <td>${this.escapeHtml(t.category)}</td>
        <td class="mono" style="color:${t.amount < 0 ? 'var(--accent-negative)' : 'var(--accent-positive)'}">$${(parseFloat(t.amount) || 0).toFixed(2)}</td>
        <td><span class="badge badge-posted">${t.status || 'POSTED'}</span></td>
      </tr>`).join('');
  }

  /* ============ NET WORTH ============ */
  renderNetWorthView() {
    const chk = this.getBalances('CHECKING');
    const sav = this.getBalances('SAVINGS');
    const nw = chk.available + sav.available + chk.vaults;
    const stats = document.getElementById('networthStats');
    if (stats) stats.innerHTML = `
      <div class="stat-card"><div class="stat-label">Total Household Net Worth</div>
        <div class="stat-value mono" style="color:var(--accent-positive)">$${nw.toFixed(2)}</div>
        <div class="stat-subtext">Checking + Savings + Vaults</div></div>`;

    const roundups = this.state.transactions.filter(t => t.status !== 'estimated' && t.description && t.description.toLowerCase().includes('roundup'));
    const rt = roundups.reduce((s, t) => s + Math.abs(parseFloat(t.amount) || 0), 0);
    const rs = document.getElementById('roundupsSummary');
    if (rs) rs.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <div style="font-size:1.4rem;" class="mono">$${rt.toFixed(2)}</div>
        <div style="color:var(--text-muted); font-size:0.85rem;">Total Swept from ${roundups.length} roundup transactions</div>
      </div>`;
  }

  /* ============ DATA QUERIES ============ */
  getBalances(accountKey) {
    const posted = this.state.transactions.filter(t => t.account === accountKey && t.status !== 'estimated');
    let ending = 0;
    if (posted.length > 0) {
      const sorted = [...posted].sort((a, b) => new Date(b.date) - new Date(a.date));
      ending = sorted[0].balance !== undefined ? (parseFloat(sorted[0].balance) || 0) : (parseFloat(sorted[0].amount) || 0);
    } else {
      ending = parseFloat(this.state.accounts[accountKey]?.verifiedBalance) || 0;
    }
    const pendingSum = this.state.pendingItems
      .filter(p => p.account === accountKey && p.status === 'pending')
      .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const vaultTotal = (this.state.vaults || []).reduce((s, v) => s + (parseFloat(v.balance) || 0), 0);
    return { ledger: ending, pending: pendingSum, available: ending + pendingSum, vaults: vaultTotal };
  }

  getFilteredTransactions(accountKey) {
    return this.state.transactions.filter(t => t.account === accountKey && t.status !== 'estimated');
  }

  /* ============ MUTATIONS ============ */
  updateRowCategory(id, newCat) {
    const tx = this.state.transactions.find(t => t.id === id);
    if (!tx) return;
    tx.category = newCat; tx.locked = true;
    this.saveState();
    const row = document.querySelector(`tr[data-tx-row="${id}"]`);
    if (row) {
      const cells = row.querySelectorAll('td');
      if (cells[4]) cells[4].innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted)">${CATEGORY_FLOW_MAP[newCat] || 'Flexible Spending'}</span>`;
      if (cells[8]) cells[8].innerHTML = tx.locked ? '🔒' : '🔓';
      const sw = row.querySelector('.cat-select-wrapper');
      if (sw) {
        const c = CATEGORY_COLORS[newCat] || CATEGORY_COLORS['Miscellaneous'];
        sw.style.setProperty('--cat-bg', c.bg);
        sw.style.setProperty('--cat-color', c.color);
        sw.style.setProperty('--cat-border', c.border);
        sw.style.setProperty('--cat-glow', c.glow);
      }
    }
    this.showToast(`Updated to ${newCat}`);
  }

  toggleLock(id) {
    const tx = this.state.transactions.find(t => t.id === id);
    if (!tx) return;
    tx.locked = !tx.locked;
    this.saveState();
    const row = document.querySelector(`tr[data-tx-row="${id}"]`);
    if (row) {
      const lc = row.querySelector('[data-toggle-lock]');
      if (lc) lc.innerText = tx.locked ? '🔒' : '🔓';
    }
  }

  toggleRowSelect(id, checked) {
    if (checked) this.selectedRows.add(id); else this.selectedRows.delete(id);
  }

  selectAllRows(accountKey, checked) {
    const tb = document.getElementById('checkingTableBody');
    if (!tb) return;
    tb.querySelectorAll('[data-row-checkbox]').forEach(cb => {
      cb.checked = checked;
      if (checked) this.selectedRows.add(cb.dataset.rowCheckbox);
      else this.selectedRows.delete(cb.dataset.rowCheckbox);
    });
  }

  sortTable(col) {
    if (this.sortState.col === col) this.sortState.asc = !this.sortState.asc;
    else { this.sortState.col = col; this.sortState.asc = true; }
    this.renderTabContent(this.currentTab);
  }

  toggleDensity() {
    this.compactDensity = !this.compactDensity;
    document.getElementById('checkingTableContainer')?.classList.toggle('compact-density', this.compactDensity);
  }

  setChartRange(range) {
    this.chartRanges.checking = range;
    document.querySelectorAll('[data-chart-range]').forEach(b => b.classList.remove('active-mode'));
    document.querySelector(`[data-chart-range="${range}"]`)?.classList.add('active-mode');
    this.renderCharts();
  }

  recalculateBalances() {
    ['CHECKING', 'SAVINGS'].forEach(acc => {
      let running = 0;
      const txs = this.state.transactions.filter(t => t.account === acc && t.status !== 'estimated')
        .sort((a, b) => { const dA = new Date(a.date).getTime(), dB = new Date(b.date).getTime(); return dA !== dB ? dA - dB : (a.id || '').localeCompare(b.id || ''); });
      txs.forEach(tx => {
        running += (parseFloat(tx.amount) || 0);
        if (tx.balance !== undefined && tx.balance !== 0) running = parseFloat(tx.balance) || 0;
        else tx.balance = running;
      });
    });
  }

  applyNicknameRules() {
    if (!this.state.nicknameRules || !this.state.nicknameRules.length) return;
    this.state.transactions.forEach(t => {
      if (!t.nickname) {
        const m = this.state.nicknameRules.find(r => t.description && t.description.toLowerCase().includes(r.searchPattern.toLowerCase()));
        if (m) t.nickname = m.nickname;
      }
    });
  }

  cleanSpotify() {
    this.state.transactions.forEach(t => {
      if (t.description && t.description.toUpperCase().startsWith('SPOTIFY')) t.description = 'Spotify';
    });
  }

  getMatchingNickname(desc) {
    if (!desc || !this.state.nicknameRules) return null;
    const m = this.state.nicknameRules.find(r => desc.toLowerCase().includes(r.searchPattern.toLowerCase()));
    return m ? m.nickname : null;
  }

  /* ============ CALENDAR ============ */
  renderCalendarView() {
    try {
      const title = document.getElementById('calendarMonthTitle');
      const grid = document.getElementById('calendarGrid');
      const mobile = document.getElementById('calendarMobileList');
      if (!title || !grid || !mobile) return;

      const year = this.calendarMonth.getFullYear();
      const month = this.calendarMonth.getMonth();
      const mn = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      title.innerText = `${mn[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

      const dayMap = new Map();
      this.state.transactions.forEach(t => {
        if (t.date && t.date.startsWith(monthPrefix)) {
          if (!dayMap.has(t.date)) dayMap.set(t.date, []);
          dayMap.get(t.date).push(t);
        }
      });
      this.state.pendingItems.forEach(t => {
        if (t.date && t.date.startsWith(monthPrefix)) {
          if (!dayMap.has(t.date)) dayMap.set(t.date, []);
          dayMap.get(t.date).push(t);
        }
      });

      const gridFrag = document.createDocumentFragment();
      const mobileFrag = document.createDocumentFragment();

      for (let i = 0; i < firstDay; i++) {
        const ec = document.createElement('div');
        ec.className = 'calendar-cell other-month';
        gridFrag.appendChild(ec);
      }

      let totalIncome = 0, totalExpense = 0, hasActivity = false;

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayTxs = dayMap.get(dateStr) || [];

        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.addEventListener('click', () => this.openDayDrawer(dateStr));
        const num = document.createElement('div');
        num.style.fontWeight = '700';
        num.style.fontSize = '0.85rem';
        num.innerText = d;
        cell.appendChild(num);

        if (dayTxs.length > 0) {
          const badge = document.createElement('div');
          badge.className = 'badge badge-vault';
          badge.style.fontSize = '0.65rem';
          badge.innerText = `${dayTxs.length} item(s)`;
          cell.appendChild(badge);
          hasActivity = true;
        }
        gridFrag.appendChild(cell);

        if (dayTxs.length > 0) {
          const total = dayTxs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
          if (total > 0) totalIncome += total; else totalExpense += Math.abs(total);
          const color = total >= 0 ? 'var(--accent-positive)' : 'var(--accent-negative)';
          const mc = document.createElement('div');
          mc.className = 'calendar-mobile-card has-activity';
          mc.addEventListener('click', () => this.openDayDrawer(dateStr));
          mc.innerHTML = `
            <div><div style="font-weight:700;">${mn[month]} ${d}, ${year}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${dayTxs.length} transaction(s)</div></div>
            <div style="color:${color}; font-weight:600;">${total >= 0 ? '+' : ''}$${total.toFixed(2)}</div>`;
          mobileFrag.appendChild(mc);
        }
      }

      grid.innerHTML = ''; mobile.innerHTML = '';
      grid.appendChild(gridFrag);
      if (!hasActivity) {
        const noAct = document.createElement('div');
        noAct.style.cssText = 'color:var(--text-muted); text-align:center; padding:1rem;';
        noAct.innerText = 'No transactions this month.';
        mobileFrag.appendChild(noAct);
      }
      mobile.appendChild(mobileFrag);

      const summary = document.getElementById('calendarMonthSummary');
      if (summary) {
        summary.innerHTML = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:0.75rem;">
            <div class="stat-card"><div class="stat-label">Income</div><div class="stat-value mono" style="color:var(--accent-positive); font-size:1.2rem;">$${totalIncome.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Expenses</div><div class="stat-value mono" style="color:var(--accent-negative); font-size:1.2rem;">$${totalExpense.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Net</div><div class="stat-value mono" style="color:${(totalIncome-totalExpense)>=0?'var(--accent-positive)':'var(--accent-negative)'}; font-size:1.2rem;">$${(totalIncome-totalExpense).toFixed(2)}</div></div>
          </div>`;
      }
    } catch(e) { console.error("Calendar error:", e); }
  }

  changeMonth(btn) {
    const offset = parseInt(btn.dataset.offset) || 0;
    this.calendarMonth.setMonth(this.calendarMonth.getMonth() + offset);
    this.renderCalendarView();
  }

  openDayDrawer(dateStr) {
    this.currentDrawerDate = dateStr;
    let drawer = document.getElementById('dayDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'dayDrawer';
      drawer.className = 'drawer';
      document.body.appendChild(drawer);
    }
    const dayTxs = this.state.transactions.filter(t => t.date === dateStr)
      .concat(this.state.pendingItems.filter(t => t.date === dateStr));

    drawer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="font-size:1.1rem; font-weight:700;">Details for ${dateStr}</h3>
        <button class="btn btn-sm" data-action="closeDrawer">Close</button>
      </div>
      ${dayTxs.length === 0 ? '<div style="color:var(--text-muted);">No transactions.</div>' :
        dayTxs.map(t => `
          <div style="background:var(--bg-base); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:0.75rem;">
            <div style="font-weight:700;">${this.escapeHtml(t.nickname || t.description)}</div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-bottom:0.35rem;">${this.escapeHtml(t.description)}</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mono" style="font-weight:700; color:${t.amount < 0 ? 'var(--accent-negative)' : 'var(--accent-positive)'}">$${(parseFloat(t.amount) || 0).toFixed(2)}</span>
              <span class="badge badge-posted">${t.category}</span>
            </div>
          </div>`).join('')}`;
    drawer.classList.add('active');
  }

  closeDrawer() {
    document.getElementById('dayDrawer')?.classList.remove('active');
  }

  /* ============ DEBTS ============ */
  renderDebtsView() {
    const loans = this.state.loans || [];
    const total = loans.reduce((s, l) => s + (parseFloat(l.balance) || 0), 0);
    const stats = document.getElementById('debtStats');
    if (stats) stats.innerHTML = `
      <div class="stat-card"><div class="stat-label">Total Outstanding Debt</div>
        <div class="stat-value mono" style="color:var(--accent-negative)">$${total.toFixed(2)}</div>
        <div class="stat-subtext">${loans.length} active loan(s)</div></div>`;

    const list = document.getElementById('loanList');
    if (list) {
      list.innerHTML = loans.length ? loans.map(l => {
        const bal = parseFloat(l.balance) || 0;
        return `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-subtle); gap:0.5rem;">
          <div style="min-width:0;">
            <div style="font-weight:600;">${this.escapeHtml(l.name)}</div>
            <div style="font-size:0.75rem; color:var(--text-dim)">${l.rate || 0}% APR • ${l.termYears || 'N/A'} yr</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="mono" style="font-weight:700; color:var(--accent-negative); background:var(--bg-base); padding:0.3rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); min-width:90px; text-align:right;">$${bal.toFixed(2)}</span>
            <button class="btn btn-sm" data-action="openEditLoanModal" data-loan-id="${l.id}">⚙️</button>
          </div>
        </div>`;
      }).join('') : '<div style="color:var(--text-muted); padding:1rem 0; text-align:center;">No loans yet.</div>';
    }

    const simControls = document.getElementById('loanSimControls');
    if (simControls) {
      if (loans.length > 0) {
        simControls.innerHTML = `
          <div style="margin-bottom:1rem;">
            <label class="stat-label">Loan</label>
            <select id="simLoanSelect" onchange="app.renderDebtSimulation()">
              ${loans.map(l => `<option value="${l.id}">${this.escapeHtml(l.name)} ($${(parseFloat(l.balance)||0).toFixed(2)})</option>`).join('')}
            </select>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.5rem;">
              <div><label class="stat-label">Extra Payment ($)</label>
                <input type="number" id="simExtraPayment" value="0" oninput="app.debouncedDebtSim()"></div>
              <div><label class="stat-label">P&I Payment ($)</label>
                <input type="number" id="simMinPayment" value="0" readonly style="opacity:0.7;"></div>
            </div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.5rem; text-align:center;">
              Enter P&I portion (exclude escrow) for accurate simulation.
            </div>
          </div>`;
        this.renderDebtSimulation();
      } else {
        simControls.innerHTML = '';
      }
    }
  }

  renderDebtSimulation() {
    const loans = this.state.loans || [];
    if (!loans.length) return;
    const sel = document.getElementById('simLoanSelect');
    if (!sel) return;
    const loan = loans.find(l => l.id === sel.value);
    if (!loan) return;

    const bal = parseFloat(loan.balance) || 0;
    const rate = parseFloat(loan.rate) || 0;
    const minPay = parseFloat(loan.minPayment) || 0;
    const escrow = parseFloat(loan.escrow) || 0;
    const pi = Math.max(0, minPay - escrow);

    const piEl = document.getElementById('simMinPayment');
    if (piEl) piEl.value = pi.toFixed(2);

    const extra = parseFloat(document.getElementById('simExtraPayment')?.value) || 0;

    const result = this.calculatePayoff(bal, rate, pi, extra);
    const minResult = this.calculatePayoff(bal, rate, pi, 0);
    const interestSaved = minResult.totalInterest - result.totalInterest;
    const monthsSaved = minResult.months - result.months;

    const yr = Math.floor(result.months / 12), mo = result.months % 12;
    const payoff = yr > 0 ? `${yr} yr, ${mo} mo` : `${mo} mo`;

    const resEl = document.getElementById('loanSimResults');
    if (resEl) resEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; background:var(--bg-base); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
        <div><div class="stat-label">Payoff Time</div>
          <div class="stat-value mono" style="color:var(--accent-primary); font-size:1.1rem;">${payoff}</div>
          <div class="stat-subtext">${monthsSaved > 0 ? `Save ${monthsSaved} months!` : 'No change'}</div></div>
        <div><div class="stat-label">Total Interest</div>
          <div class="stat-value mono" style="color:var(--accent-negative); font-size:1.1rem;">$${result.totalInterest.toFixed(2)}</div>
          <div class="stat-subtext" style="color:var(--accent-positive);">${interestSaved > 0 ? `Save $${interestSaved.toFixed(2)}!` : 'No change'}</div></div>
      </div>`;

    this.renderDebtChart(result.schedule, minResult.schedule);
  }

  calculatePayoff(principal, annualRate, minPayment, extraPayment) {
    let balance = principal;
    const monthlyRate = (annualRate / 100) / 12;
    const totalPay = minPayment + extraPayment;
    let totalInterest = 0, months = 0;
    const schedule = [{ month: 0, balance: principal }];
    if (totalPay <= 0 || totalPay <= balance * monthlyRate) {
      return { months: 999, totalInterest: 999999, schedule: [] };
    }
    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      const principalPaid = totalPay - interest;
      balance -= principalPaid;
      totalInterest += interest;
      months++;
      schedule.push({ month: months, balance: Math.max(0, balance) });
    }
    return { months, totalInterest, schedule };
  }

  renderDebtChart(schedule, minSchedule) {
    const canvas = document.getElementById('debtChart');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 220 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 220);

    if (!schedule || schedule.length === 0) {
      ctx.fillStyle = '#8a8f9e'; ctx.font = '12px Inter'; ctx.textAlign = 'center';
      ctx.fillText('Payment is too low to cover interest.', rect.width / 2, 110); return;
    }
    const maxM = Math.max(schedule.length, minSchedule.length);
    const maxB = schedule[0].balance;
    const startY = 30, endY = 180, ch = endY - startY;
    const getX = m => 50 + (m / maxM) * (rect.width - 70);
    const getY = b => endY - ((b - 0) / (maxB - 0)) * ch;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.fillStyle = '#5a5e6b'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(rect.width - 20, y); ctx.stroke();
      const val = maxB - (maxB / 4) * i;
      ctx.fillText(this.fmt(val), 45, y + 3);
    }
    ctx.textAlign = 'center';
    const totalY = Math.ceil(maxM / 12);
    const yStep = Math.max(1, Math.ceil(totalY / 5));
    for (let y = 0; y <= totalY; y += yStep) {
      ctx.fillText(`Yr ${y}`, getX(y * 12), endY + 18);
    }
    ctx.beginPath(); ctx.strokeStyle = '#b26bff'; ctx.lineWidth = 2;
    minSchedule.forEach((d, i) => { const x = getX(d.month), y = getY(d.balance); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
    schedule.forEach((d, i) => { const x = getX(d.month), y = getY(d.balance); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
  }

  /* ============ PAYCHECK ============ */
  calculatePaycheck() {
  const get = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
  const hourly = get('payHourlyRate', 20);
  const hours = get('payHours', 40);
  const weeks = get('payWeeks', 52);
  const benefits = get('payBenefits', 0);
  const fedRate = get('payFederalRate', 12);
  const stateCode = document.getElementById('payState')?.value || this.state.selectedState;
  const period = document.getElementById('payPeriod')?.value || 'yearly';

  const weeklyGross = hourly * hours;
  const annualGross = weeklyGross * weeks;

  const stateData = (this.state.taxStates || []).find(s => s.code === stateCode);
  let stateTax = 0;
  let effectiveStateRate = 0;
  if (stateData) {
    stateTax = this.calculateProgressiveTax(annualGross, stateData.brackets);
    effectiveStateRate = annualGross > 0 ? (stateTax / annualGross) * 100 : 0;
  }

  const fedTax = annualGross * (fedRate / 100);
  const ss = annualGross * 0.062;
  const med = annualGross * 0.0145;
  const totalTax = fedTax + stateTax + ss + med;
  const annualBenefits = benefits * 12;
  const annualNet = annualGross - totalTax - annualBenefits;

  // Period divisors — no extra storage, just divide
  const divisors = { weekly: 52, biweekly: 26, monthly: 12, yearly: 1 };
  const div = divisors[period] || 1;
  const periodLabel = { weekly: 'Weekly', biweekly: 'Bi-Weekly', monthly: 'Monthly', yearly: 'Yearly' }[period];

  const pGross = annualGross / div;
  const pNet = annualNet / div;
  const pFed = fedTax / div;
  const pState = stateTax / div;
  const pSS = ss / div;
  const pMed = med / div;
  const pBenefits = annualBenefits / div;

  // Bracket breakdown (shows per-period amounts)
  let bracketBreakdown = '';
  if (stateData && stateData.brackets.length > 1) {
    const rows = [];
    for (const b of stateData.brackets) {
      if (annualGross <= b.min) break;
      const taxable = Math.min(annualGross, b.max) - b.min;
      if (taxable <= 0) continue;
      const taxAtBracket = taxable * (b.rate / 100);
      const maxLabel = b.max >= MAX_BRACKET ? '+' : `$${b.max.toLocaleString()}`;
      rows.push(`<div style="display:flex; justify-content:space-between; font-size:0.75rem; padding:0.15rem 0;">
        <span style="color:var(--text-muted);">$${b.min.toLocaleString()} - ${maxLabel} @ ${b.rate}%</span>
        <span class="mono" style="color:var(--accent-negative);">$${(taxAtBracket / div).toFixed(2)}</span>
      </div>`);
    }
    if (rows.length > 0) {
      bracketBreakdown = `<div style="margin-top:0.75rem; padding-top:0.6rem; border-top:1px solid var(--border-subtle);">
        <div class="stat-label" style="font-size:0.65rem; margin-bottom:0.4rem;">${this.escapeHtml(stateData.name)} Brackets (${periodLabel})</div>
        ${rows.join('')}
      </div>`;
    }
  }

  const el = document.getElementById('paycheckResults');
  if (!el) return;
  el.innerHTML = `
    <div style="text-align:center; padding:1.5rem 1rem; background:linear-gradient(180deg, rgba(0,255,157,0.08) 0%, rgba(0,255,157,0) 100%); border-radius:var(--radius-md); border:1px solid rgba(0,255,157,0.2);">
      <div class="stat-label" style="justify-content:center;">NET TAKE HOME (${periodLabel.toUpperCase()})</div>
      <div class="mono" style="font-size:2.5rem; font-weight:700; color:var(--accent-positive); line-height:1.1;">$${pNet.toFixed(2)}</div>
    </div>
    <div style="text-align:center; padding:0.75rem 1rem 0.5rem;">
      <div class="stat-label" style="justify-content:center;">GROSS (${periodLabel.toUpperCase()})</div>
      <div class="mono" style="font-size:1.2rem; font-weight:600; color:var(--text-main);">$${pGross.toFixed(2)}</div>
    </div>
    <details style="background:var(--bg-base); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); padding:0.5rem 1rem; margin-top:0.5rem;">
      <summary style="cursor:pointer; font-weight:600; font-size:0.85rem; color:var(--text-muted); padding:0.4rem 0; user-select:none;">Deductions Breakdown</summary>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.85rem; padding-top:0.5rem;">
        <div>Federal (${fedRate}%): <span class="mono" style="color:var(--accent-negative);">$${pFed.toFixed(2)}</span></div>
        <div>${stateData ? this.escapeHtml(stateData.name) : 'State'} (${effectiveStateRate.toFixed(2)}%): <span class="mono" style="color:var(--accent-negative);">$${pState.toFixed(2)}</span></div>
        <div>Social Security: <span class="mono" style="color:var(--accent-negative);">$${pSS.toFixed(2)}</span></div>
        <div>Medicare: <span class="mono" style="color:var(--accent-negative);">$${pMed.toFixed(2)}</span></div>
        <div>Benefits: <span class="mono" style="color:var(--accent-negative);">$${pBenefits.toFixed(2)}</span></div>
      </div>
      ${bracketBreakdown}
    </details>`;
  }

  /* ============ TAX BRACKET MODAL ============ */
  openTaxBracketModal() {
    const states = this.state.taxStates || [];
    const selected = this.state.selectedState || states[0]?.code;
    const current = states.find(s => s.code === selected) || states[0];

    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal" style="max-width:700px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">⚙ State Tax Brackets</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:grid; grid-template-columns: 1fr auto; gap:0.5rem; margin-bottom:1rem;">
            <div>
              <label class="stat-label">Select State</label>
              <select id="tbStateSelect" onchange="app.loadBracketEditor(this.value)">
                ${states.map(s => `<option value="${s.code}" ${s.code === selected ? 'selected' : ''}>${this.escapeHtml(s.name)} (${s.code})</option>`).join('')}
              </select>
            </div>
            <div style="display:flex; align-items:flex-end;">
              <button class="btn btn-sm btn-primary" data-action="newTaxState">+ New State</button>
            </div>
          </div>

          <div id="tbEditor"></div>

          <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-top:1.5rem; flex-wrap:wrap;">
  <div style="display:flex; gap:0.5rem;">
    <button class="btn btn-danger btn-sm" data-action="deleteTaxState">Delete State</button>
    <button class="btn btn-sm" data-action="resetTaxBrackets" title="Restore all default state brackets">↺ Reset to Defaults</button>
  </div>
  <div style="display:flex; gap:0.5rem;">
    <button class="btn" data-action="closeModal">Cancel</button>
    <button class="btn btn-primary" data-action="saveTaxBrackets">Save Brackets</button>
  </div>
</div>
        </div>
      </div>`);
    if (current) this.loadBracketEditor(current.code);
  }

  loadBracketEditor(code) {
    const state = (this.state.taxStates || []).find(s => s.code === code);
    const editor = document.getElementById('tbEditor');
    if (!editor) return;
    if (!state) { editor.innerHTML = ''; return; }

    this.editingStateCode = code;

    const rowsHtml = state.brackets.map((b, i) => `
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr auto; gap:0.5rem; align-items:center; margin-bottom:0.4rem;" data-bracket-row="${i}">
        <input type="number" step="0.01" placeholder="Min $" value="${b.min}" data-bracket-min="${i}">
        <input type="number" step="0.01" placeholder="Max $" value="${b.max >= MAX_BRACKET ? '' : b.max}" data-bracket-max="${i}" title="Leave empty for top bracket">
        <input type="number" step="0.01" placeholder="Rate %" value="${b.rate}" data-bracket-rate="${i}">
        <button class="btn btn-sm btn-danger" data-action="removeBracketRow" data-index="${i}">✕</button>
      </div>`).join('');

    editor.innerHTML = `
      <div style="background:var(--bg-base); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-glow);">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:1rem;">
          <div><label class="stat-label">State Code</label><input type="text" id="tbStateCode" value="${this.escapeHtml(state.code)}" maxlength="4"></div>
          <div><label class="stat-label">State Name</label><input type="text" id="tbStateName" value="${this.escapeHtml(state.name)}"></div>
        </div>
        <div class="stat-label" style="margin-bottom:0.5rem;">Brackets (Min $ | Max $ | Rate %)</div>
        <div style="font-size:0.7rem; color:var(--text-dim); margin-bottom:0.5rem;">Leave Max empty for the top bracket (no upper limit).</div>
        <div id="tbBracketRows">${rowsHtml}</div>
        <button class="btn btn-sm" data-action="addBracketRow" style="margin-top:0.5rem;">+ Add Bracket</button>
      </div>`;
  }

  addBracketRow() {
    const rows = document.getElementById('tbBracketRows');
    if (!rows) return;
    const i = rows.querySelectorAll('[data-bracket-row]').length;
    const row = document.createElement('div');
    row.style.cssText = 'display:grid; grid-template-columns: 1fr 1fr 1fr auto; gap:0.5rem; align-items:center; margin-bottom:0.4rem;';
    row.setAttribute('data-bracket-row', i);
    row.innerHTML = `
      <input type="number" step="0.01" placeholder="Min $" data-bracket-min="${i}">
      <input type="number" step="0.01" placeholder="Max $" data-bracket-max="${i}">
      <input type="number" step="0.01" placeholder="Rate %" data-bracket-rate="${i}">
      <button class="btn btn-sm btn-danger" data-action="removeBracketRow" data-index="${i}">✕</button>`;
    rows.appendChild(row);
  }

  removeBracketRow(btn) {
    const row = btn.closest('[data-bracket-row]');
    if (row) row.remove();
  }

  saveTaxBrackets() {
    const code = document.getElementById('tbStateCode')?.value.trim().toUpperCase();
    const name = document.getElementById('tbStateName')?.value.trim();
    if (!code || !name) { alert('Enter a state code and name.'); return; }

    const brackets = [];
    const rows = document.querySelectorAll('#tbBracketRows [data-bracket-row]');
    rows.forEach(row => {
      const min = parseFloat(row.querySelector('[data-bracket-min]')?.value) || 0;
      const maxInput = row.querySelector('[data-bracket-max]')?.value;
      const max = maxInput === '' ? MAX_BRACKET : (parseFloat(maxInput) || MAX_BRACKET);
      const rate = parseFloat(row.querySelector('[data-bracket-rate]')?.value) || 0;
      brackets.push({ min, max, rate });
    });
    brackets.sort((a, b) => a.min - b.min);

    if (brackets.length === 0) { alert('Add at least one bracket.'); return; }

    // Find and replace, or add
    const idx = (this.state.taxStates || []).findIndex(s => s.code === this.editingStateCode);
    const entry = { code, name, brackets };
    if (idx >= 0) this.state.taxStates[idx] = entry;
    else this.state.taxStates.push(entry);

    this.state.selectedState = code;
    this.saveState();
    this.closeModal();
    this.renderTabContent('paycheck');
    this.showToast(`Saved ${name} brackets`);
  }

  deleteTaxState() {
    const code = document.getElementById('tbStateCode')?.value.trim().toUpperCase();
    if (!code) return;
    if (!confirm(`Delete tax brackets for ${code}?`)) return;
    this.state.taxStates = (this.state.taxStates || []).filter(s => s.code !== code);
    if (this.state.selectedState === code) {
      this.state.selectedState = this.state.taxStates[0]?.code || null;
    }
    this.saveState();
    this.closeModal();
    this.renderTabContent('paycheck');
    this.showToast(`Deleted ${code}`);
  }

  resetTaxBrackets() {
  if (!confirm(
    'Reset to default state brackets?\n\n' +
    'This will restore Oklahoma, Kansas, Colorado, Texas, and Florida. ' +
    'Any custom states you have added will be removed.'
  )) return;
  this.state.taxStates = JSON.parse(JSON.stringify(DEFAULT_TAX_STATES));
  this.state.selectedState = 'OK';
  this.saveState();
  this.closeModal();
  this.renderTabContent('paycheck');
  this.showToast('Reset to default state brackets');
  }

  newTaxState() {
    this.editingStateCode = null;
    const editor = document.getElementById('tbEditor');
    if (!editor) return;
    editor.innerHTML = `
      <div style="background:var(--bg-base); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-glow);">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:1rem;">
          <div><label class="stat-label">State Code</label><input type="text" id="tbStateCode" placeholder="e.g. KS" maxlength="4"></div>
          <div><label class="stat-label">State Name</label><input type="text" id="tbStateName" placeholder="e.g. Kansas"></div>
        </div>
        <div class="stat-label" style="margin-bottom:0.5rem;">Brackets (Min $ | Max $ | Rate %)</div>
        <div style="font-size:0.7rem; color:var(--text-dim); margin-bottom:0.5rem;">Leave Max empty for the top bracket (no upper limit).</div>
        <div id="tbBracketRows">
          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr auto; gap:0.5rem; align-items:center; margin-bottom:0.4rem;" data-bracket-row="0">
            <input type="number" step="0.01" placeholder="Min $" value="0" data-bracket-min="0">
            <input type="number" step="0.01" placeholder="Max $" data-bracket-max="0">
            <input type="number" step="0.01" placeholder="Rate %" data-bracket-rate="0">
            <button class="btn btn-sm btn-danger" data-action="removeBracketRow" data-index="0">✕</button>
          </div>
        </div>
        <button class="btn btn-sm" data-action="addBracketRow" style="margin-top:0.5rem;">+ Add Bracket</button>
      </div>`;
  }

  /* ============ FORECASTER ============ */
  syncForecaster() {
    const estimated = this.state.transactions.filter(t => t.status === 'estimated');
    let inc = 0, fix = 0;
    estimated.forEach(t => {
      const abs = Math.abs(t.amount || 0);
      const cfg = t.ruleConfig || { interval: 1, freq: 'weeks' };
      const int = Math.max(1, cfg.interval || 1);
      let monthly = 0;
      if (cfg.freq === 'days') monthly = (abs / int) * (365 / 12);
      else if (cfg.freq === 'weeks') monthly = (abs / int) * (52 / 12);
      else if (cfg.freq === 'months') monthly = abs / int;
      else if (cfg.freq === 'years') monthly = abs / (12 * int);
      if (t.amount > 0 || t.category === 'Income' || t.flow === 'Income') inc += monthly;
      else fix += monthly;
    });
    const incEl = document.getElementById('fcAvgIncome');
    const fixEl = document.getElementById('fcAvgFixed');
    if (incEl) incEl.value = inc.toFixed(2);
    if (fixEl) fixEl.value = fix.toFixed(2);
    this.renderForecaster();
  }

  renderForecaster() {
    const gi = id => parseFloat(document.getElementById(id)?.value) || 0;
    const avgInc = gi('fcAvgIncome');
    const avgFix = gi('fcAvgFixed');
    const avgVar = gi('fcAvgVariable');
    let scenSum = 0;
    (this.state.scenarios || []).forEach(s => { if (s.active) scenSum += (parseFloat(s.amount) || 0); });
    const netFull = avgInc - avgFix - avgVar + scenSum;
    const netBills = avgInc - avgFix + scenSum;

    const cards = document.getElementById('forecastOutputCards');
    if (cards) cards.innerHTML = `
      <div class="forecast-col-card">
        <div class="stat-label">NET MONTHLY SURPLUS (FULL)</div>
        <div class="stat-value mono" style="color:${netFull >= 0 ? 'var(--accent-positive)' : 'var(--accent-negative)'}">$${netFull.toFixed(2)}</div>
        <div class="stat-subtext">Includes Income, Bills, Flex & Scenarios</div>
      </div>
      <div class="forecast-col-card">
        <div class="stat-label">NET SURPLUS (BILLS ONLY)</div>
        <div class="stat-value mono" style="color:${netBills >= 0 ? 'var(--accent-primary)' : 'var(--accent-negative)'}">$${netBills.toFixed(2)}</div>
        <div class="stat-subtext">Income minus Fixed Bills & Scenarios</div>
      </div>`;

    const sList = document.getElementById('scenarioList');
    if (sList) {
      sList.innerHTML = (this.state.scenarios || []).map(s => `
        <div class="scenario-item ${s.active ? '' : 'disabled'}">
          <div>
            <div style="font-weight:600; font-size:0.85rem;">${this.escapeHtml(s.name)}</div>
            <div class="mono" style="font-size:0.8rem; color:${s.amount >= 0 ? 'var(--accent-positive)' : 'var(--accent-negative)'}">
              ${s.amount >= 0 ? '+' : ''}$${(parseFloat(s.amount) || 0).toFixed(2)}/mo
            </div>
          </div>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            <button class="scenario-toggle-btn ${s.active ? 'active' : ''}" data-action="toggleScenario" data-scenario-id="${s.id}">${s.active ? 'ON' : 'OFF'}</button>
            <button class="btn btn-sm" data-action="openEditScenarioModal" data-scenario-id="${s.id}">⚙️</button>
          </div>
        </div>`).join('');
    }
  }

  toggleScenario(btn) {
    const id = btn.dataset.scenarioId;
    const sc = this.state.scenarios.find(s => s.id === id);
    if (sc) { sc.active = !sc.active; this.saveState(); this.renderForecaster(); }
  }

  /* ============ APY ============ */
  renderAPY() {
    const gv = id => parseFloat(document.getElementById(id)?.value) || 0;
    const principal = gv('apyPrincipal');
    const rate = gv('apyRate') / 100;
    const monthly = gv('apyMonthly');
    const withdrawal = gv('apyWithdrawal');
    const years = parseInt(document.getElementById('apyYears')?.value) || 5;

    let total = principal;
    const months = years * 12;
    const mr = rate / 12;
    const balances = [total];
    for (let i = 0; i < months; i++) {
      total = (total + monthly - withdrawal) * (1 + mr);
      if (total < 0) total = 0;
      balances.push(total);
    }
    const deposits = principal + (monthly * months);
    const withdrawals = withdrawal * months;
    const interest = total - deposits + withdrawals;

    const sum = document.getElementById('apySummary');
    if (sum) sum.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; background:var(--bg-base); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
        <div><div class="stat-label">PROJECTED END BALANCE</div>
          <div class="stat-value mono" style="color:var(--accent-positive); font-size:1.3rem;">$${total.toFixed(2)}</div></div>
        <div><div class="stat-label">TOTAL INTEREST EARNED</div>
          <div class="stat-value mono" style="color:var(--accent-primary); font-size:1.3rem;">$${interest.toFixed(2)}</div></div>
      </div>`;

    const canvas = document.getElementById('apyChart');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 220 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 220);

    const minV = Math.min(...balances);
    const maxV = Math.max(...balances);
    const pad = (maxV - minV) * 0.1 || 10;
    const startY = 30, endY = 180, ch = endY - startY;
    const getX = i => 50 + (i / months) * (rect.width - 70);
    const getY = v => endY - ((v - (minV - pad)) / ((maxV + pad) - (minV - pad))) * ch;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(rect.width - 20, y); ctx.stroke();
      ctx.fillText(this.fmt(maxV + pad - ((maxV + pad - (minV - pad)) / 4) * i), 45, y + 3);
    }
    ctx.textAlign = 'center';
    const yStep = Math.max(1, Math.ceil(years / 6));
    for (let i = 0; i <= years; i += yStep) {
      ctx.fillText(`Yr ${i}`, getX(i * 12), endY + 18);
    }
    ctx.beginPath(); ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
    balances.forEach((v, i) => { const x = getX(i), y = getY(v); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
  }

  updateApySource() {
    const src = document.getElementById('apySource')?.value;
    const input = document.getElementById('apyPrincipal');
    if (!input) return;
    if (src === 'VAULTS') input.value = this.getBalances('SAVINGS').vaults.toFixed(2);
    else if (src === 'CHECKING') input.value = this.getBalances('CHECKING').available.toFixed(2);
    this.renderAPY();
  }

  /* ============ CHARTS ============ */
  renderCharts() {
    try {
      if (this.currentTab === 'checking') this.renderCheckingChart();
      else if (this.currentTab === 'networth') { this.renderNetWorthChart(); this.renderDonutChart(); }
      else if (this.currentTab === 'debts') this.renderDebtSimulation();
      else if (this.currentTab === 'forecaster') this.renderForecasterChart();
      else if (this.currentTab === 'apy') this.renderAPY();
    } catch(e) { console.error("Chart error:", e); }
  }

  renderCheckingChart() {
    const canvas = document.getElementById('checkingChart');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 260 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 260);

    const txs = this.state.transactions.filter(t => t.account === 'CHECKING' && t.status !== 'estimated')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (txs.length === 0) {
      ctx.fillStyle = '#8a8f9e'; ctx.font = '14px Inter'; ctx.textAlign = 'center';
      ctx.fillText('No data', rect.width / 2, 130); return;
    }
    const range = this.chartRanges.checking || 'week';
    const latest = new Date(txs[txs.length - 1].date);
    let start = new Date(latest);
    if (range === 'week') start.setDate(start.getDate() - 7);
    else if (range === 'month') start.setMonth(start.getMonth() - 1);
    else start.setFullYear(start.getFullYear() - 1);

    const timeline = [];
    const iter = new Date(start);
    if (range === 'year') {
      iter.setDate(1);
      while (iter <= latest) { timeline.push(new Date(iter)); iter.setMonth(iter.getMonth() + 1); }
    } else {
      while (iter <= latest) { timeline.push(new Date(iter)); iter.setDate(iter.getDate() + 1); }
    }
    const data = [];
    let idx = 0, bal = 0;
    while (idx < txs.length && new Date(txs[idx].date) < start) { bal = parseFloat(txs[idx].balance) || 0; idx++; }
    timeline.forEach(date => {
      while (idx < txs.length && new Date(txs[idx].date) <= date) { bal = parseFloat(txs[idx].balance) || 0; idx++; }
      data.push({ date, balance: bal });
    });
    const vals = data.map(d => d.balance);
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const pad = (maxV - minV) * 0.1 || 10;
    const startY = 30, endY = 220, ch = endY - startY;
    const pts = data.map((d, i) => {
      const x = 50 + (i / Math.max(1, data.length - 1)) * (rect.width - 70);
      const n = (d.balance - (minV - pad)) / ((maxV + pad) - (minV - pad));
      return { x, y: endY - n * ch, date: d.date };
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(rect.width - 20, y); ctx.stroke();
      ctx.fillText(this.fmt(maxV + pad - ((maxV + pad - (minV - pad)) / 4) * i), 45, y + 3);
    }
    ctx.beginPath(); ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
    pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, startY, 0, endY);
    grad.addColorStop(0, 'rgba(0,229,255,0.25)'); grad.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.lineTo(pts[pts.length - 1].x, endY); ctx.lineTo(pts[0].x, endY); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.fillStyle = '#5a5e6b'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
    const maxL = Math.floor((rect.width - 70) / 60);
    const step = Math.max(1, Math.ceil(pts.length / maxL));
    const mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    for (let i = 0; i < pts.length; i += step) {
      const d = new Date(pts[i].date);
      const lbl = range === 'year' ? mn[d.getMonth()] : `${d.getMonth() + 1}/${d.getDate()}`;
      ctx.fillText(lbl, pts[i].x, endY + 18);
    }
  }

  renderNetWorthChart() {
    const canvas = document.getElementById('networthChart');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 260 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 260);

    const allTxs = this.state.transactions.filter(t => t.status !== 'estimated')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const vaultTotal = this.getBalances('SAVINGS').vaults;
    if (allTxs.length === 0) {
      ctx.fillStyle = '#8a8f9e'; ctx.font = '14px Inter'; ctx.textAlign = 'center';
      ctx.fillText('No data', rect.width / 2, 130); return;
    }
    const range = this.chartRanges.networth || 'year';
    const latest = new Date(allTxs[allTxs.length - 1].date);
    let start = new Date(latest);
    if (range === 'week') start.setDate(start.getDate() - 7);
    else if (range === 'month') start.setMonth(start.getMonth() - 1);
    else start.setFullYear(start.getFullYear() - 1);

    const timeline = [];
    const iter = new Date(start);
    if (range === 'year') {
      iter.setDate(1);
      while (iter <= latest) { timeline.push(new Date(iter)); iter.setMonth(iter.getMonth() + 1); }
    } else {
      while (iter <= latest) { timeline.push(new Date(iter)); iter.setDate(iter.getDate() + 1); }
    }
    let curC = 0, curS = 0, idx = 0;
    while (idx < allTxs.length && new Date(allTxs[idx].date) < start) {
      const tx = allTxs[idx];
      if (tx.account === 'CHECKING') curC = tx.balance || 0;
      if (tx.account === 'SAVINGS') curS = tx.balance || 0;
      idx++;
    }
    const data = timeline.map(date => {
      while (idx < allTxs.length && new Date(allTxs[idx].date) <= date) {
        const tx = allTxs[idx];
        if (tx.account === 'CHECKING') curC = tx.balance || 0;
        if (tx.account === 'SAVINGS') curS = tx.balance || 0;
        idx++;
      }
      return { date, balance: curC + curS + vaultTotal };
    });
    const vals = data.map(d => d.balance);
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const pad = (maxV - minV) * 0.1 || 10;
    const startY = 30, endY = 220, ch = endY - startY;
    const pts = data.map((d, i) => {
      const x = 50 + (i / Math.max(1, data.length - 1)) * (rect.width - 70);
      const n = (d.balance - (minV - pad)) / ((maxV + pad) - (minV - pad));
      return { x, y: endY - n * ch, date: d.date };
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(rect.width - 20, y); ctx.stroke();
      ctx.fillText(this.fmt(maxV + pad - ((maxV + pad - (minV - pad)) / 4) * i), 45, y + 3);
    }
    ctx.beginPath(); ctx.strokeStyle = '#b26bff'; ctx.lineWidth = 2.5;
    pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, startY, 0, endY);
    grad.addColorStop(0, 'rgba(178,107,255,0.25)'); grad.addColorStop(1, 'rgba(178,107,255,0)');
    ctx.lineTo(pts[pts.length - 1].x, endY); ctx.lineTo(pts[0].x, endY); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.fillStyle = '#5a5e6b'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
    const maxL = Math.floor((rect.width - 70) / 60);
    const step = Math.max(1, Math.ceil(pts.length / maxL));
    const mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    for (let i = 0; i < pts.length; i += step) {
      const d = new Date(pts[i].date);
      const lbl = range === 'year' ? mn[d.getMonth()] : `${d.getMonth() + 1}/${d.getDate()}`;
      ctx.fillText(lbl, pts[i].x, endY + 18);
    }
  }

  renderDonutChart() {
    const canvas = document.getElementById('categoryDonut');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 240 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 240);

    const txs = this.state.transactions.filter(t => t.status !== 'estimated' && parseFloat(t.amount) < 0);
    const totals = {};
    let grand = 0;
    txs.forEach(t => {
      const c = t.category || 'Miscellaneous';
      totals[c] = (totals[c] || 0) + Math.abs(parseFloat(t.amount) || 0);
      grand += Math.abs(parseFloat(t.amount) || 0);
    });
    const legend = document.getElementById('categoryLegend');
    if (grand === 0) {
      ctx.fillStyle = '#8a8f9e'; ctx.font = '12px Inter'; ctx.textAlign = 'center';
      ctx.fillText('No spending data', rect.width / 2, 120);
      if (legend) legend.innerHTML = '';
      return;
    }
    const cx = rect.width / 2, cy = 120, radius = 85;
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const threshold = grand * 0.03;
    let otherVal = 0;
    const display = [];
    entries.forEach(([cat, val]) => {
      if (val < threshold) otherVal += val;
      else display.push([cat, val]);
    });
    if (otherVal > 0) display.push(["Other", otherVal]);

    let startA = -Math.PI / 2;
    display.forEach(([cat, val]) => {
      const sliceA = (val / grand) * Math.PI * 2;
      const endA = startA + sliceA;
      const cfg = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startA, endA);
      ctx.arc(cx, cy, radius - 30, endA, startA, true);
      ctx.closePath();
      ctx.fillStyle = cfg.color; ctx.fill();
      ctx.strokeStyle = '#0a0a0f'; ctx.lineWidth = 2; ctx.stroke();
      startA = endA;
    });
    if (legend) legend.innerHTML = display.map(([cat, val]) => {
      const cfg = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];
      return `<div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; background:var(--bg-base); padding:0.3rem 0.5rem; border-radius:6px; border:1px solid var(--border-subtle);">
        <span style="width:8px; height:8px; border-radius:50%; background:${cfg.color};"></span>
        <span style="font-weight:500;">${cat}</span>
        <span style="color:var(--text-muted); margin-left:auto;">$${val.toFixed(0)}</span>
      </div>`;
    }).join('');
  }

  renderForecasterChart() {
    const canvas = document.getElementById('forecasterChart');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 220 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, 220);

    const gv = id => parseFloat(document.getElementById(id)?.value) || 0;
    const avgInc = gv('fcAvgIncome'), avgFix = gv('fcAvgFixed'), avgVar = gv('fcAvgVariable');
    let scenSum = 0;
    this.state.scenarios.forEach(s => { if (s.active) scenSum += (parseFloat(s.amount) || 0); });
    const netFull = avgInc - avgFix - avgVar + scenSum;
    const netBills = avgInc - avgFix + scenSum;
    const start = this.getBalances('CHECKING').available + this.getBalances('SAVINGS').available + this.getBalances('SAVINGS').vaults;

    const range = this.chartRanges.forecaster || 'year';
    let num = 12, stepF = netFull, stepB = netBills, lblFn = i => `M${i}`;
    if (range === 'week') { num = 7; stepF = netFull / 30.4375; stepB = netBills / 30.4375; lblFn = i => `D${i}`; }
    else if (range === 'month') { num = 30; stepF = netFull / 30.4375; stepB = netBills / 30.4375; lblFn = i => `D${i}`; }

    const dataF = [], dataB = [];
    let bf = start, bb = start;
    for (let i = 0; i <= num; i++) {
      dataF.push({ x: i, y: bf }); dataB.push({ x: i, y: bb });
      bf += stepF; bb += stepB;
    }
    const allV = [...dataF.map(d => d.y), ...dataB.map(d => d.y)];
    const minV = Math.min(...allV), maxV = Math.max(...allV);
    const pad = (maxV - minV) * 0.1 || 10;
    const startY = 30, endY = 180, ch = endY - startY;
    const getX = i => 50 + (i / num) * (rect.width - 70);
    const getY = v => endY - ((v - (minV - pad)) / ((maxV + pad) - (minV - pad))) * ch;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(rect.width - 20, y); ctx.stroke();
      ctx.fillText(this.fmt(maxV + pad - ((maxV + pad - (minV - pad)) / 4) * i), 45, y + 3);
    }
    ctx.textAlign = 'center';
    const st = Math.max(1, Math.ceil(num / 6));
    for (let i = 0; i <= num; i += st) ctx.fillText(lblFn(i), getX(i), endY + 18);
    ctx.beginPath(); ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
    dataF.forEach((d, i) => { if (i === 0) ctx.moveTo(getX(i), getY(d.y)); else ctx.lineTo(getX(i), getY(d.y)); });
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#b26bff'; ctx.lineWidth = 2.5;
    dataB.forEach((d, i) => { if (i === 0) ctx.moveTo(getX(i), getY(d.y)); else ctx.lineTo(getX(i), getY(d.y)); });
    ctx.stroke();
  }

  /* ============ MODALS ============ */
  openModal(html) {
    document.getElementById('modalContainer').innerHTML = html;
  }

  closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
  }

  openRulesModal() {
    const nicknameRules = this.state.nicknameRules || [];
    const catOpts = `<option value="">-- Leave Category Unchanged --</option>` + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal" style="max-width:700px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">⚙ Active Rules</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="background:var(--bg-base); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-glow); margin-bottom:1.5rem;">
            <div style="font-weight:600; font-size:0.85rem; color:var(--accent-primary); margin-bottom:0.75rem;">+ ADD NEW RULE</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.5rem;">
              <div><label class="stat-label">Contains</label><input type="text" id="newRuleSearch"></div>
              <div><label class="stat-label">Nickname (Optional)</label><input type="text" id="newRuleNickname"></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:0.5rem; align-items:flex-end;">
              <div><label class="stat-label">Category (Optional)</label><select id="newRuleCategory">${catOpts}</select></div>
              <button class="btn btn-primary btn-sm" style="height:35px;" data-action="addNewRule">Add Rule</button>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1.5rem;">
            <div>
              <h3 style="font-size:0.9rem; font-weight:600; color:var(--accent-primary); margin-bottom:0.5rem;">Saved Rules</h3>
              <div>
                ${nicknameRules.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No custom rules yet.</div>' :
                  nicknameRules.map(r => `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-base); padding:0.5rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:0.5rem;">
                      <div><span style="color:var(--text-muted); font-size:0.8rem;">Contains:</span>
                        <strong style="font-family:var(--font-mono);">${this.escapeHtml(r.searchPattern)}</strong> →
                        <span style="color:var(--accent-primary); font-weight:600;">"${this.escapeHtml(r.nickname)}"</span></div>
                      <button class="btn btn-sm btn-danger" data-action="deleteNicknameRule" data-pattern="${this.escapeHtml(r.searchPattern)}">🗑️</button>
                    </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>`);
  }

  addNewRule() {
    const pattern = document.getElementById('newRuleSearch').value.trim();
    const nickname = document.getElementById('newRuleNickname').value.trim();
    const category = document.getElementById('newRuleCategory').value;
    if (!pattern) { alert('Enter a search phrase.'); return; }
    if (!nickname && !category) { alert('Enter a nickname or category.'); return; }
    if (nickname) {
      if (!this.state.nicknameRules) this.state.nicknameRules = [];
      this.state.nicknameRules = this.state.nicknameRules.filter(r => r.searchPattern.toLowerCase() !== pattern.toLowerCase());
      this.state.nicknameRules.push({ searchPattern: pattern, nickname });
    }
    let count = 0;
    this.state.transactions.forEach(t => {
      if (t.description && t.description.toLowerCase().includes(pattern.toLowerCase())) {
        if (nickname) t.nickname = nickname;
        if (category) { t.category = category; t.locked = true; }
        count++;
      }
    });
    this.saveState();
    this.closeModal();
    this.showToast(`Applied rule to ${count} transactions`);
    this.renderTabContent(this.currentTab);
  }

  deleteNicknameRule(btn) {
    const pattern = btn.dataset.pattern;
    if (!confirm(`Delete rule for "${pattern}"?`)) return;
    this.state.nicknameRules = this.state.nicknameRules.filter(r => r.searchPattern !== pattern);
    this.saveState();
    this.openRulesModal();
  }

  openImportWizard() {
    this.stagedFiles = [];
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">Import Bank CSV</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="border:2px dashed var(--border-glow); padding:2rem; text-align:center; border-radius:var(--radius-md); cursor:pointer;" data-action="triggerCsvUpload">
            <p>Click to browse CSV files</p>
            <p style="font-size:0.75rem; color:var(--text-dim); margin-top:0.5rem;">Format: Date, Description, Amount, Balance</p>
          </div>
          <input type="file" id="csvInput" multiple accept=".csv" style="display:none">
          <div style="margin-top:1rem;">
            <label class="stat-label">Account Target</label>
            <select id="importAccountTarget">
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
            </select>
          </div>
          <div id="importPreview" style="margin-top:1rem;"></div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" id="commitImportBtn" data-action="commitImport" disabled>Commit</button>
          </div>
        </div>
      </div>`);
    document.getElementById('csvInput').addEventListener('change', (e) => this.handleCSVSelect(e));
  }

  triggerCsvUpload() {
    document.getElementById('csvInput')?.click();
  }

  handleCSVSelect(evt) {
    const files = Array.from(evt.target.files);
    if (files.length) {
      this.stagedFiles = files;
      const prev = document.getElementById('importPreview');
      if (prev) prev.innerText = `${files.length} file(s) ready`;
      const btn = document.getElementById('commitImportBtn');
      if (btn) btn.disabled = false;
    }
  }

  commitImport() {
    if (!this.stagedFiles.length) return;
    const target = document.getElementById('importAccountTarget').value;
    let count = 0, pending = this.stagedFiles.length;
    this.stagedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        lines.forEach((line, idx) => {
          if (idx === 0 || !line.trim()) return;
          const parts = line.split(',');
          if (parts.length >= 3) {
            const date = parts[0].replace(/"/g, '').trim();
            let desc = parts[1].replace(/"/g, '').trim();
            const amt = parseFloat(parts[2].replace(/"/g, '').trim());
            let bal = parts.length >= 4 ? parseFloat(parts[3].replace(/"/g, '').trim()) : 0;
            if (isNaN(bal)) bal = 0;
            if (desc.toUpperCase().startsWith('SPOTIFY')) desc = 'Spotify';
            if (!isNaN(amt) && date) {
              let cat = 'Miscellaneous', flow = 'Flexible Spending';
              const rule = CATEGORY_RULES.find(r => desc.toUpperCase().includes(r.contains));
              if (rule) { cat = rule.category; flow = rule.flow; }
              this.state.transactions.push({
                id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                account: target, date, description: desc,
                nickname: this.getMatchingNickname(desc),
                category: cat, flow, amount: amt, balance: bal, status: 'POSTED'
              });
              count++;
            }
          }
        });
        pending--;
        if (pending === 0) {
          this.recalculateBalances();
          this.saveState();
          this.closeModal();
          this.showToast(`Imported ${count} transactions`);
          this.renderTabContent(this.currentTab);
        }
      };
      reader.readAsText(file);
    });
  }

  openAddPendingModal() {
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">Add Pending Item</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Account</label><select id="pendingAccount">
              <option value="CHECKING">Checking</option><option value="SAVINGS">Savings</option>
            </select></div>
            <div><label class="stat-label">Date</label><input type="date" id="pendingDate" value="${new Date().toISOString().split('T')[0]}"></div>
            <div><label class="stat-label">Description</label><input type="text" id="pendingDesc"></div>
            <div><label class="stat-label">Amount ($)</label><input type="number" step="0.01" id="pendingAmount"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="savePendingItem">Save</button>
          </div>
        </div>
      </div>`);
  }

  savePendingItem() {
    const acc = document.getElementById('pendingAccount').value;
    const date = document.getElementById('pendingDate').value;
    const desc = document.getElementById('pendingDesc').value;
    const amt = parseFloat(document.getElementById('pendingAmount').value);
    if (!desc || isNaN(amt)) return;
    this.state.pendingItems.push({
      id: `p_${Date.now()}`, account: acc, date, description: desc,
      nickname: this.getMatchingNickname(desc), amount: amt, status: 'pending'
    });
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
    this.showToast('Pending item added');
  }

  openVaultModal() {
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">Create New Vault</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Vault Name</label><input type="text" id="vaultName"></div>
            <div><label class="stat-label">Initial Balance ($)</label><input type="number" step="0.01" id="vaultInitialBalance" value="0"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="saveVault">Create Vault</button>
          </div>
        </div>
      </div>`);
  }

  saveVault() {
    const name = document.getElementById('vaultName').value.trim();
    const bal = parseFloat(document.getElementById('vaultInitialBalance').value) || 0;
    if (!name) return;
    this.state.vaults.push({ id: `v_${Date.now()}`, name, balance: bal });
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
    this.showToast(`Vault "${name}" created`);
  }

  openVaultTransferModal(btn) {
    const vaultId = btn.dataset.vaultId;
    const vault = this.state.vaults.find(v => v.id === vaultId);
    if (!vault) return;
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Transfer to ${this.escapeHtml(vault.name)}</h2>
          <input type="hidden" id="transferVaultId" value="${vaultId}">
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">From Account</label>
              <select id="transferFromAccount">
                <option value="CHECKING">Checking</option>
                <option value="SAVINGS">Savings</option>
              </select></div>
            <div><label class="stat-label">Amount ($)</label><input type="number" step="0.01" id="transferAmount"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="saveVaultTransfer">Confirm</button>
          </div>
        </div>
      </div>`);
  }

  saveVaultTransfer() {
    const vaultId = document.getElementById('transferVaultId').value;
    const from = document.getElementById('transferFromAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    if (isNaN(amount) || amount <= 0) { alert('Enter valid amount'); return; }
    const vault = this.state.vaults.find(v => v.id === vaultId);
    if (!vault) return;
    if (this.getBalances(from).available < amount) { alert('Insufficient funds'); return; }
    this.state.transactions.push({
      id: `tx_${Date.now()}_out`, account: from,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to Vault: ${vault.name}`,
      category: 'Transfers', flow: 'Internal Transfer',
      amount: -amount, balance: 0, status: 'POSTED'
    });
    vault.balance += amount;
    this.recalculateBalances();
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
    this.showToast(`Transferred $${amount.toFixed(2)}`);
  }

  openEditVaultModal(btn) {
    const vault = this.state.vaults.find(v => v.id === btn.dataset.vaultId);
    if (!vault) return;
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Edit Vault</h2>
          <input type="hidden" id="editVaultId" value="${vault.id}">
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Name</label><input type="text" id="editVaultName" value="${this.escapeHtml(vault.name)}"></div>
            <div><label class="stat-label">Balance ($)</label><input type="number" step="0.01" id="editVaultBalance" value="${(parseFloat(vault.balance) || 0).toFixed(2)}"></div>
          </div>
          <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn btn-danger btn-sm" data-action="deleteVault">Delete</button>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn" data-action="closeModal">Cancel</button>
              <button class="btn btn-primary" data-action="saveEditedVault">Save</button>
            </div>
          </div>
        </div>
      </div>`);
  }

  saveEditedVault() {
    const id = document.getElementById('editVaultId').value;
    const name = document.getElementById('editVaultName').value.trim();
    const bal = parseFloat(document.getElementById('editVaultBalance').value) || 0;
    const v = this.state.vaults.find(x => x.id === id);
    if (v) { v.name = name; v.balance = bal; }
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
  }

  deleteVault() {
    const id = document.getElementById('editVaultId').value;
    if (!confirm('Delete this vault?')) return;
    this.state.vaults = this.state.vaults.filter(v => v.id !== id);
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
  }

  openMassEditModal() {
    const catOpts = `<option value="">-- Leave Unchanged --</option>` + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">Mass Edit</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Description Contains</label><input type="text" id="massSearch"></div>
            <div><label class="stat-label">Assign Nickname</label><input type="text" id="massNickname"></div>
            <div><label class="stat-label">Set Category</label><select id="massCategory">${catOpts}</select></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="applyMassEdit">Apply</button>
          </div>
        </div>
      </div>`);
  }

  applyMassEdit() {
    const q = document.getElementById('massSearch').value.trim().toLowerCase();
    const nick = document.getElementById('massNickname').value.trim();
    const cat = document.getElementById('massCategory').value;
    if (!q) { alert('Enter search phrase'); return; }
    let count = 0;
    this.state.transactions.forEach(t => {
      if (t.description && t.description.toLowerCase().includes(q)) {
        if (nick) t.nickname = nick;
        if (cat) { t.category = cat; t.locked = true; }
        count++;
      }
    });
    this.saveState();
    this.closeModal();
    this.renderTabContent(this.currentTab);
    this.showToast(`Updated ${count} transactions`);
  }

  openAddLoanModal() {
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Add New Loan</h2>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Loan Name</label><input type="text" id="loanName"></div>
            <div><label class="stat-label">Current Balance ($)</label><input type="number" step="0.01" id="loanBalance"></div>
            <div><label class="stat-label">Interest Rate (%)</label><input type="number" step="0.01" id="loanRate"></div>
            <div><label class="stat-label">Minimum Monthly Payment ($)</label><input type="number" step="0.01" id="loanMinPayment"></div>
            <div><label class="stat-label">Escrow ($)</label><input type="number" step="0.01" id="loanEscrow" value="0"></div>
            <div><label class="stat-label">Term (Years)</label><input type="number" id="loanTerm" value="30"></div>
            <div><label class="stat-label">Payment Filter</label><input type="text" id="loanFilter" placeholder="e.g. MORTGAGE"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="saveLoan">Add Loan</button>
          </div>
        </div>
      </div>`);
  }

  saveLoan() {
    const name = document.getElementById('loanName').value.trim();
    const bal = parseFloat(document.getElementById('loanBalance').value);
    const rate = parseFloat(document.getElementById('loanRate').value);
    const min = parseFloat(document.getElementById('loanMinPayment').value);
    const esc = parseFloat(document.getElementById('loanEscrow').value) || 0;
    const term = parseInt(document.getElementById('loanTerm').value) || 30;
    const filter = document.getElementById('loanFilter').value.trim();
    if (!name || isNaN(bal) || isNaN(rate) || isNaN(min)) { alert('Fill all fields'); return; }
    this.state.loans.push({
      id: `loan_${Date.now()}`, name, balance: bal, initialBalance: bal,
      rate, minPayment: min, escrow: esc, termYears: term, paymentFilter: filter
    });
    this.recalculateLoanBalances();
    this.saveState();
    this.closeModal();
    this.renderTabContent('debts');
  }

  openEditLoanModal(btn) {
    const loan = this.state.loans.find(l => l.id === btn.dataset.loanId);
    if (!loan) return;
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Edit Loan</h2>
          <input type="hidden" id="editLoanId" value="${loan.id}">
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Name</label><input type="text" id="elName" value="${this.escapeHtml(loan.name)}"></div>
            <div><label class="stat-label">Balance ($)</label><input type="number" step="0.01" id="elBalance" value="${(parseFloat(loan.balance) || 0).toFixed(2)}"></div>
            <div><label class="stat-label">Rate (%)</label><input type="number" step="0.01" id="elRate" value="${loan.rate}"></div>
            <div><label class="stat-label">Min Payment ($)</label><input type="number" step="0.01" id="elMin" value="${loan.minPayment}"></div>
            <div><label class="stat-label">Escrow ($)</label><input type="number" step="0.01" id="elEsc" value="${loan.escrow || 0}"></div>
            <div><label class="stat-label">Term (Years)</label><input type="number" id="elTerm" value="${loan.termYears || 30}"></div>
            <div><label class="stat-label">Filter</label><input type="text" id="elFilter" value="${this.escapeHtml(loan.paymentFilter || '')}"></div>
          </div>
          <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn btn-danger btn-sm" data-action="deleteLoan">Delete</button>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn" data-action="closeModal">Cancel</button>
              <button class="btn btn-primary" data-action="saveEditedLoan">Save</button>
            </div>
          </div>
        </div>
      </div>`);
  }

  saveEditedLoan() {
    const id = document.getElementById('editLoanId').value;
    const l = this.state.loans.find(x => x.id === id);
    if (!l) return;
    l.name = document.getElementById('elName').value.trim();
    l.balance = parseFloat(document.getElementById('elBalance').value) || 0;
    l.rate = parseFloat(document.getElementById('elRate').value) || 0;
    l.minPayment = parseFloat(document.getElementById('elMin').value) || 0;
    l.escrow = parseFloat(document.getElementById('elEsc').value) || 0;
    l.termYears = parseInt(document.getElementById('elTerm').value) || 30;
    l.paymentFilter = document.getElementById('elFilter').value.trim();
    this.saveState();
    this.closeModal();
    this.renderTabContent('debts');
  }

  deleteLoan() {
    const id = document.getElementById('editLoanId').value;
    if (!confirm('Delete this loan?')) return;
    this.state.loans = this.state.loans.filter(l => l.id !== id);
    this.saveState();
    this.closeModal();
    this.renderTabContent('debts');
  }

  recalculateLoanBalances() {
    if (!this.state.loans || !this.state.loans.length) return;
    this.state.loans.forEach(loan => {
      if (!loan.paymentFilter) return;
      const filter = loan.paymentFilter.toUpperCase();
      const payments = this.state.transactions.filter(t =>
        t.status !== 'estimated' && t.amount < 0 &&
        t.description && t.description.toUpperCase().includes(filter)
      );
      if (!payments.length) return;
      payments.sort((a, b) => new Date(a.date) - new Date(b.date));
      let bal = parseFloat(loan.initialBalance || loan.balance) || 0;
      const mr = ((parseFloat(loan.rate) || 0) / 100) / 12;
      payments.forEach(p => {
        const amt = Math.abs(parseFloat(p.amount) || 0);
        const interest = bal * mr;
        let principal = amt - interest;
        if (principal < 0) principal = 0;
        bal -= principal;
        if (bal < 0) bal = 0;
      });
      loan.balance = bal;
    });
    this.saveState();
  }

  openAddScenarioModal() {
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal" style="max-width:500px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">+ Add Scenario</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <div><label class="stat-label">Name</label><input type="text" id="scenarioNameInput"></div>
            <div><label class="stat-label">Monthly Impact ($)</label><input type="number" step="0.01" id="scenarioAmountInput"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="saveScenario">Save</button>
          </div>
        </div>
      </div>`);
  }

  saveScenario() {
    const name = document.getElementById('scenarioNameInput').value.trim();
    const amt = parseFloat(document.getElementById('scenarioAmountInput').value);
    if (!name || isNaN(amt)) { alert('Enter valid values'); return; }
    this.state.scenarios.push({ id: `sc_${Date.now()}`, name, amount: amt, active: true });
    this.saveState();
    this.closeModal();
    this.renderForecaster();
  }

  openEditScenarioModal(btn) {
    const sc = this.state.scenarios.find(s => s.id === btn.dataset.scenarioId);
    if (!sc) return;
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal" style="max-width:500px;">
          <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Edit Scenario</h2>
          <input type="hidden" id="editScenarioId" value="${sc.id}">
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <div><label class="stat-label">Name</label><input type="text" id="editScenarioName" value="${this.escapeHtml(sc.name)}"></div>
            <div><label class="stat-label">Amount ($)</label><input type="number" step="0.01" id="editScenarioAmount" value="${sc.amount}"></div>
          </div>
          <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn btn-danger btn-sm" data-action="deleteScenario">Delete</button>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn" data-action="closeModal">Cancel</button>
              <button class="btn btn-primary" data-action="saveEditedScenario">Save</button>
            </div>
          </div>
        </div>
      </div>`);
  }

  saveEditedScenario() {
    const id = document.getElementById('editScenarioId').value;
    const sc = this.state.scenarios.find(s => s.id === id);
    if (!sc) return;
    sc.name = document.getElementById('editScenarioName').value.trim();
    sc.amount = parseFloat(document.getElementById('editScenarioAmount').value) || 0;
    this.saveState();
    this.closeModal();
    this.renderForecaster();
  }

  deleteScenario() {
    const id = document.getElementById('editScenarioId').value;
    if (!confirm('Delete this scenario?')) return;
    this.state.scenarios = this.state.scenarios.filter(s => s.id !== id);
    this.saveState();
    this.closeModal();
    this.renderForecaster();
  }

  openRecurringModal() {
    this.openModal(`
      <div class="modal-overlay active">
        <div class="modal">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="font-size:1.2rem; font-weight:700;">Add Recurring Item</h2>
            <button class="btn btn-sm" data-action="closeModal">Close</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div><label class="stat-label">Description</label><input type="text" id="recDesc"></div>
            <div><label class="stat-label">Account</label><select id="recAccount">
              <option value="CHECKING">Checking</option><option value="SAVINGS">Savings</option>
            </select></div>
            <div><label class="stat-label">Category</label><select id="recCategory">
              ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select></div>
            <div><label class="stat-label">Amount ($)</label><input type="number" step="0.01" id="recAmount"></div>
            <div><label class="stat-label">Start Date</label><input type="date" id="recStart" value="${new Date().toISOString().split('T')[0]}"></div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
              <div><label class="stat-label">Interval</label><input type="number" id="recInterval" value="1" min="1"></div>
              <div><label class="stat-label">Frequency</label><select id="recFreq">
                <option value="days">Days</option><option value="weeks" selected>Weeks</option>
                <option value="months">Months</option><option value="years">Years</option>
              </select></div>
            </div>
            <div><label class="stat-label">End After (occurrences)</label><input type="number" id="recCount" value="12" min="1"></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="btn" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="saveRecurring">Save</button>
          </div>
        </div>
      </div>`);
  }

  saveRecurring() {
    const desc = document.getElementById('recDesc').value.trim();
    const acc = document.getElementById('recAccount').value;
    const cat = document.getElementById('recCategory').value;
    const amt = parseFloat(document.getElementById('recAmount').value);
    const start = document.getElementById('recStart').value;
    const interval = parseInt(document.getElementById('recInterval').value) || 1;
    const freq = document.getElementById('recFreq').value;
    const count = parseInt(document.getElementById('recCount').value) || 12;
    if (!desc || isNaN(amt) || !start) { alert('Fill required fields'); return; }
    const groupId = `rec_${Date.now()}`;
    let curDate = new Date(start + 'T00:00:00');
    for (let i = 0; i < count; i++) {
      const dateStr = `${curDate.getFullYear()}-${String(curDate.getMonth() + 1).padStart(2, '0')}-${String(curDate.getDate()).padStart(2, '0')}`;
      this.state.transactions.push({
        id: `est_${Date.now()}_${i}`, groupId, account: acc, date: dateStr,
        description: desc, category: cat, flow: CATEGORY_FLOW_MAP[cat] || 'Flexible Spending',
        amount: amt, status: 'estimated', ruleConfig: { interval, freq, count }
      });
      if (freq === 'days') curDate.setDate(curDate.getDate() + interval);
      else if (freq === 'weeks') curDate.setDate(curDate.getDate() + (7 * interval));
      else if (freq === 'months') curDate.setMonth(curDate.getMonth() + interval);
      else curDate.setFullYear(curDate.getFullYear() + interval);
    }
    this.saveState();
    this.closeModal();
    this.renderTabContent('calendar');
    this.showToast(`Added ${count} recurring items`);
  }

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money_tracker_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  triggerImportJSON() {
    const input = document.getElementById('jsonInput');
    input.onchange = (e) => this.importJSON(e);
    input.click();
  }

  importJSON(evt) {
    const file = evt.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.state = JSON.parse(e.target.result);
        // Ensure taxStates exists after import
        if (!this.state.taxStates || !this.state.taxStates.length) {
          this.state.taxStates = JSON.parse(JSON.stringify(DEFAULT_TAX_STATES));
        }
        this.saveState();
        this.recalculateBalances();
        this.init();
        this.showToast('State restored');
      } catch(err) { alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  }

  clearAllData() {
    if (!confirm('Are you sure you want to CLEAR ALL data?')) return;
    if (!confirm('DOUBLE CONFIRMATION: This will permanently reset everything.')) return;
    localStorage.removeItem('MONEY_TRACKER_STATE_V3');
    this.state = JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE));
    this.selectedRows.clear();
    this.init();
    this.showToast('All data cleared');
  }

  /* ============ UTILS ============ */
  fmt(v) {
    if (isNaN(v) || v === null || v === undefined) return '$0';
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'K';
    return '$' + v.toFixed(0);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  showToast(msg) {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}

const app = new MoneyTrackerApp();
window.onload = () => app.init();