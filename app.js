/* =========================================
   MONEY TRACKER APP - CORE LOGIC (STEP 2)
   ========================================= */

const CATEGORIES = [
  "Income", "Groceries", "Dining", "Bills and Utilities", "Subscriptions",
  "Transfers", "Transportation", "Shopping", "Health", "Entertainment",
  "Fees and Interest", "Miscellaneous"
];

const CATEGORY_FLOW_MAP = {
  "Income": "Income", "Bills and Utilities": "Fixed Bill", "Subscriptions": "Fixed Bill",
  "Transfers": "Internal Transfer", "Groceries": "Flexible Spending", "Dining": "Flexible Spending",
  "Transportation": "Flexible Spending", "Shopping": "Flexible Spending", "Health": "Flexible Spending",
  "Entertainment": "Flexible Spending", "Fees and Interest": "Flexible Spending", "Miscellaneous": "Flexible Spending"
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

const INITIAL_EMPTY_STATE = {
  version: 2,
  accounts: {
    CHECKING: { id: "CHECKING", name: "Joint Checking 0199", verifiedBalance: 0.00 },
    SAVINGS: { id: "SAVINGS", name: "Joint Savings 3703", verifiedBalance: 0.00 }
  },
  vaults: [],
  pendingItems: [],
  transactions: [],
  scenarios: [{ id: "sc_honda", name: "Increase Honda Payment", amount: -100.00, active: true }],
  suggestedVaults: [],
  nicknameRules: [],
  loans: []
};

class MoneyTrackerApp {
  constructor() {
    this.state = this.loadState();
    this.currentTab = 'checking';
    this.chartRanges = { checking: 'week', networth: 'year', forecaster: 'year' };
    this.selectedRows = new Set();
    this.calendarMonth = new Date(2026, 8, 1);
    this.currentDrawerDate = null;
    this.resizeTimeout = null;
    this.saveTimeout = null;
    this.searchTimeout = null;
    this.sortState = { col: 'date', asc: false };
    this.compactDensity = false;
    this.transactionIndex = new Map();
    this.searchQuery = '';
  }

  /* =========================================
     STORAGE
     ========================================= */

  loadState() {
    const saved = localStorage.getItem('MONEY_TRACKER_STATE_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all arrays exist
        parsed.vaults = parsed.vaults || [];
        parsed.pendingItems = parsed.pendingItems || [];
        parsed.transactions = parsed.transactions || [];
        parsed.scenarios = parsed.scenarios || [{ id: "sc_honda", name: "Increase Honda Payment", amount: -100.00, active: true }];
        parsed.suggestedVaults = parsed.suggestedVaults || [];
        parsed.nicknameRules = parsed.nicknameRules || [];
        parsed.loans = parsed.loans || [];
        parsed.accounts = parsed.accounts || JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE.accounts));
        return parsed;
      } catch(e) {
        console.error("State load error, resetting:", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE));
  }

  saveState() {
    // Debounce saves: only save 1.5s after the user stops interacting
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('MONEY_TRACKER_STATE_V2', JSON.stringify(this.state));
      } catch(e) {
        console.error("Save error (localStorage may be full):", e);
      }
    }, 1500);
  }

  /* =========================================
     INITIALIZATION
     ========================================= */

  init() {
    this.recalculateBalances();
    this.buildTransactionIndex();
    this.renderTabContent(this.currentTab);
    this.bindGlobalEvents();
  }

  buildTransactionIndex() {
    // O(1) lookup by date for calendar rendering
    this.transactionIndex.clear();
    this.state.transactions.forEach(t => {
      if (!this.transactionIndex.has(t.date)) {
        this.transactionIndex.set(t.date, []);
      }
      this.transactionIndex.get(t.date).push(t);
    });
  }

  bindGlobalEvents() {
    // 1. Tab Switching (Event Delegation)
    document.getElementById('tabStrip').addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn) this.switchTab(btn.dataset.tab);
    });

    // 2. Global Action Buttons (Delegation for data-action attributes)
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        const action = btn.dataset.action;
        if (typeof this[action] === 'function') {
          e.preventDefault();
          this[action](btn);
        }
      }
    });

    // 3. Table Change Events (Delegation for selects & checkboxes)
    document.body.addEventListener('change', (e) => {
      const target = e.target;
      if (target.matches('.cat-select')) {
        this.updateRowCategory(target.dataset.txId, target.value);
      } else if (target.matches('[data-row-checkbox]')) {
        this.toggleRowSelect(target.dataset.rowCheckbox, target.checked);
      } else if (target.matches('#checkingHeaderSelect')) {
        this.selectAllRows('checking', target.checked);
      }
    });

    // 4. Table Click Events (Delegation for lock, sort, etc.)
    document.body.addEventListener('click', (e) => {
      const target = e.target;

      // Sort header
      if (target.matches('th[data-sort]')) {
        this.sortTable(target.dataset.sort);
        return;
      }
      // Lock toggle
      if (target.matches('[data-toggle-lock]')) {
        this.toggleLock(target.dataset.toggleLock);
        return;
      }
      // Chart mode buttons
      if (target.matches('[data-chart-range]')) {
        this.setChartRange(target.dataset.chartRange);
        return;
      }
    });

    // 5. Search Input (Debounced)
    document.body.addEventListener('input', (e) => {
      if (e.target.matches('#checkingSearch')) {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.toLowerCase();
          this.renderCheckingTable();
        }, 300);
      }
    });

    // 6. Window Resize
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) cancelAnimationFrame(this.resizeTimeout);
      this.resizeTimeout = requestAnimationFrame(() => this.renderCharts());
    });

    // 7. Chart Range Buttons (Delegated)
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-networth-range]');
      if (btn) {
        this.chartRanges.networth = btn.dataset.networthRange;
        document.querySelectorAll('[data-networth-range]').forEach(b => b.classList.remove('active-mode'));
        btn.classList.add('active-mode');
        this.renderCharts();
      }
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    this.renderTabContent(tabId);
  }

  renderTabContent(tabId) {
    const main = document.getElementById('mainContent');
    const templates = {
      checking: () => this.templateChecking(),
      savings: () => this.templateSavings(),
      networth: () => this.templateNetworth(),
      debts: () => this.templatePlaceholder('Debt Payoff', 'Coming in Step 3'),
      paycheck: () => this.templatePlaceholder('Paycheck Calculator', 'Coming in Step 3'),
      calendar: () => this.templatePlaceholder('Calendar', 'Coming in Step 3'),
      forecaster: () => this.templatePlaceholder('Forecaster', 'Coming in Step 3'),
      apy: () => this.templatePlaceholder('APY Simulator', 'Coming in Step 3')
    };

    const templateFn = templates[tabId] || templates.checking;
    main.innerHTML = templateFn();

    // Now populate dynamic content
    if (tabId === 'checking') this.renderCheckingView();
    if (tabId === 'savings') this.renderSavingsView();
    if (tabId === 'networth') this.renderNetWorthView();

    // Render charts after DOM is ready
    setTimeout(() => this.renderCharts(), 30);
  }

  /* =========================================
     HTML TEMPLATES
     ========================================= */

  templateChecking() {
    return `
      <section id="view-checking" class="view-container active">
        <div class="stat-header" id="checkingStats"></div>

        <div class="card" style="margin-bottom: 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
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
            <input type="text" id="checkingSearch" placeholder="Search transactions..." value="${this.searchQuery}">
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm" data-action="toggleDensity">Toggle Density</button>
            <button class="btn btn-sm" data-action="openMassEditModal">Mass Edit</button>
            <button class="btn btn-sm btn-primary" data-action="openAddPendingModal">+ Add Pending</button>
          </div>
        </div>

        <div class="table-container card ${this.compactDensity ? 'compact-density' : ''}" style="padding:0;" id="checkingTableContainer">
          <table id="checkingTable">
            <thead>
              <tr>
                <th style="width:30px;"><input type="checkbox" id="checkingHeaderSelect"></th>
                <th data-sort="date">Date ${this.getSortArrow('date')}</th>
                <th data-sort="description">Description ${this.getSortArrow('description')}</th>
                <th data-sort="category">Category ${this.getSortArrow('category')}</th>
                <th>Flow</th>
                <th data-sort="amount">Amount ${this.getSortArrow('amount')}</th>
                <th data-sort="balance">Balance ${this.getSortArrow('balance')}</th>
                <th>Status</th>
                <th>Lock</th>
              </tr>
            </thead>
            <tbody id="checkingTableBody"></tbody>
          </table>
        </div>
      </section>
    `;
  }

  templateSavings() {
    return `
      <section id="view-savings" class="view-container active">
        <div class="stat-header" id="savingsStats"></div>

        <div class="card" style="margin-bottom: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <h3 style="font-size:1rem; font-weight:600;">Vault Balances</h3>
            <button class="btn btn-sm btn-primary" data-action="openVaultModal">+ New Vault</button>
          </div>
          <div id="vaultList" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
        </div>

        <div class="card">
          <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Savings Ledger</h3>
          <div class="table-container" style="border:none;">
            <table id="savingsTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="savingsTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  templateNetworth() {
    return `
      <section id="view-networth" class="view-container active">
        <div class="stat-header" id="networthStats"></div>

        <div class="card" style="margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1rem; font-weight:600;">Spending by Category</h3>
              <button class="btn btn-sm" data-action="renderCharts">🔄</button>
            </div>
            <canvas id="categoryDonut" height="240" style="width:100%; display:block;"></canvas>
            <div id="categoryLegend" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:0.5rem; margin-top:1rem;"></div>
          </div>
          <div class="card">
            <h3 style="font-size:1rem; font-weight:600; margin-bottom:1rem;">Roundup Sweeps Summary</h3>
            <div id="roundupsSummary"></div>
          </div>
        </div>
      </section>
    `;
  }

  templatePlaceholder(title, subtitle) {
    return `
      <section class="view-container active">
        <div class="card" style="text-align:center; padding:3rem 1rem;">
          <h2 style="font-size:1.4rem; margin-bottom:0.5rem;">${title}</h2>
          <p style="color:var(--text-muted);">${subtitle}</p>
        </div>
      </section>
    `;
  }

  getSortArrow(col) {
    if (this.sortState.col !== col) return '';
    return this.sortState.asc ? '↑' : '↓';
  }

  /* =========================================
     CHECKING VIEW
     ========================================= */

  renderCheckingView() {
    const bal = this.getBalances('CHECKING');

    document.getElementById('checkingStats').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Available Balance</div>
        <div class="stat-value mono" style="color:var(--accent-primary)">$${bal.available.toFixed(2)}</div>
        <div class="stat-subtext">Spendable Funds</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ledger Balance</div>
        <div class="stat-value mono">$${bal.ledger.toFixed(2)}</div>
        <div class="stat-subtext">$${bal.pending.toFixed(2)} (${this.state.pendingItems.filter(p => p.account === 'CHECKING').length} Pending Items)</div>
      </div>
    `;

    this.renderCheckingTable();
  }

  renderCheckingTable() {
    const tbody = document.getElementById('checkingTableBody');
    if (!tbody) return;

    // Get visible transactions
    let items = this.getFilteredTransactions('CHECKING');

    // Prepend pending items
    const pendingItems = this.state.pendingItems.filter(p => p.account === 'CHECKING');
    items = [...pendingItems, ...items];

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      items = items.filter(t =>
        (t.nickname && t.nickname.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Sort
    items.sort((a, b) => {
      let valA = a[this.sortState.col];
      let valB = b[this.sortState.col];
      if (this.sortState.col === 'amount' || this.sortState.col === 'balance') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      }
      if (valA < valB) return this.sortState.asc ? -1 : 1;
      if (valA > valB) return this.sortState.asc ? 1 : -1;
      return 0;
    });

    // Update header checkbox
    const headerSelect = document.getElementById('checkingHeaderSelect');
    if (headerSelect) {
      headerSelect.checked = items.length > 0 && items.every(item => this.selectedRows.has(item.id));
    }

    // Build table HTML as a single string (much faster than appending rows)
    const rowsHtml = items.map(t => this.buildCheckingRow(t)).join('');
    tbody.innerHTML = rowsHtml;
  }

  buildCheckingRow(t) {
    const isPending = t.status === 'pending';
    const colors = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Miscellaneous'];
    const flow = CATEGORY_FLOW_MAP[t.category] || 'Flexible Spending';

    const categorySelectOptions = CATEGORIES.map(c =>
      `<option value="${c}" ${t.category === c ? 'selected' : ''}>${c}</option>`
    ).join('');

    const displayName = t.nickname
      ? `<div style="font-weight:700; color:var(--accent-primary);">${this.escapeHtml(t.nickname)}</div><div style="font-size:0.75rem; color:var(--text-dim);">${this.escapeHtml(t.description)}</div>`
      : `<div style="font-weight:600;">${this.escapeHtml(t.description)}</div>`;

    return `<tr data-tx-row="${t.id}">
      <td><input type="checkbox" data-row-checkbox="${t.id}" ${this.selectedRows.has(t.id) ? 'checked' : ''}></td>
      <td class="mono">${t.date}</td>
      <td>${displayName}</td>
      <td>
        <div class="cat-select-wrapper" style="--cat-bg:${colors.bg}; --cat-color:${colors.color}; --cat-border:${colors.border}; --cat-glow:${colors.glow};">
          <select class="cat-select" data-tx-id="${t.id}">
            ${categorySelectOptions}
          </select>
        </div>
      </td>
      <td><span style="font-size:0.75rem; color:var(--text-muted)">${flow}</span></td>
      <td class="mono" style="color:${t.amount < 0 ? 'var(--accent-negative)' : 'var(--accent-positive)'}">
        $${(parseFloat(t.amount) || 0).toFixed(2)}
      </td>
      <td class="mono">$${(parseFloat(t.balance) || 0).toFixed(2)}</td>
      <td><span class="badge ${isPending ? 'badge-pending' : 'badge-posted'}">${t.status || 'POSTED'}</span></td>
      <td style="cursor:pointer;" data-toggle-lock="${t.id}">${t.locked ? '🔒' : '🔓'}</td>
    </tr>`;
  }

  /* =========================================
     SAVINGS VIEW
     ========================================= */

  renderSavingsView() {
    const bal = this.getBalances('SAVINGS');

    document.getElementById('savingsStats').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Savings Account Ledger</div>
        <div class="stat-value mono">$${bal.ledger.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Vault Earmarks</div>
        <div class="stat-value mono" style="color:var(--accent-secondary)">$${bal.vaults.toFixed(2)}</div>
      </div>
    `;

    // Render vault list
    const vaultContainer = document.getElementById('vaultList');
    if (vaultContainer) {
      if ((this.state.vaults || []).length === 0) {
        vaultContainer.innerHTML = '<div style="color:var(--text-muted); padding:1rem 0; text-align:center;">No vaults created yet. Click "+ New Vault" above to add one.</div>';
      } else {
        vaultContainer.innerHTML = this.state.vaults.map(v => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-subtle); gap:0.5rem;">
            <div style="min-width:0;">
              <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(v.name)}</div>
              <div style="font-size:0.75rem; color:var(--text-dim)">Earmarked Sub-balance</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
              <span class="mono" style="font-size:1rem; font-weight:700; background:var(--bg-base); padding:0.3rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); min-width:90px; text-align:right; display:inline-block;">$${(parseFloat(v.balance) || 0).toFixed(2)}</span>
              <button class="btn btn-sm" data-action="openVaultTransferModal" data-vault-id="${v.id}">💸</button>
              <button class="btn btn-sm" data-action="openEditVaultModal" data-vault-id="${v.id}">⚙️</button>
            </div>
          </div>
        `).join('');
      }
    }

    // Render savings table
    this.renderSavingsTable();
  }

  renderSavingsTable() {
    const tbody = document.getElementById('savingsTableBody');
    if (!tbody) return;

    const items = this.getFilteredTransactions('SAVINGS').slice(0, 100); // Limit to 100 for speed

    tbody.innerHTML = items.map(t => `
      <tr>
        <td class="mono">${t.date}</td>
        <td>${this.escapeHtml(t.nickname || t.description)}</td>
        <td>${this.escapeHtml(t.category)}</td>
        <td class="mono" style="color:${t.amount < 0 ? 'var(--accent-negative)' : 'var(--accent-positive)'}">$${(parseFloat(t.amount) || 0).toFixed(2)}</td>
        <td><span class="badge badge-posted">${t.status || 'POSTED'}</span></td>
      </tr>
    `).join('');
  }

  /* =========================================
     NET WORTH VIEW
     ========================================= */

  renderNetWorthView() {
    const chk = this.getBalances('CHECKING');
    const sav = this.getBalances('SAVINGS');
    const netWorth = chk.available + sav.available + chk.vaults;

    document.getElementById('networthStats').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Total Household Net Worth</div>
        <div class="stat-value mono" style="color:var(--accent-positive)">$${netWorth.toFixed(2)}</div>
        <div class="stat-subtext">Checking + Savings + Vaults</div>
      </div>
    `;

    const roundups = this.state.transactions.filter(t => t.status !== 'estimated' && t.description && t.description.toLowerCase().includes('roundup'));
    const roundupTotal = roundups.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
    document.getElementById('roundupsSummary').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <div style="font-size:1.4rem;" class="mono">$${roundupTotal.toFixed(2)}</div>
        <div style="color:var(--text-muted); font-size:0.85rem;">Total Swept from ${roundups.length} roundup transactions</div>
      </div>
    `;

    this.renderNetWorthChart();
    this.renderDonutChart();
  }

  /* =========================================
     DATA QUERIES
     ========================================= */

  getBalances(accountKey) {
    const postedTxs = this.state.transactions.filter(t => t.account === accountKey && t.status !== 'estimated');

    let endingBalance = 0;
    if (postedTxs.length > 0) {
      const sorted = [...postedTxs].sort((a, b) => new Date(b.date) - new Date(a.date));
      endingBalance = sorted[0].balance !== undefined ? (parseFloat(sorted[0].balance) || 0) : (parseFloat(sorted[0].amount) || 0);
    } else {
      endingBalance = parseFloat(this.state.accounts[accountKey]?.verifiedBalance) || 0;
    }

    const pendingSum = this.state.pendingItems
      .filter(p => p.account === accountKey && p.status === 'pending')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    const vaultTotal = (this.state.vaults || []).reduce((sum, v) => sum + (parseFloat(v.balance) || 0), 0);

    return {
      ledger: endingBalance,
      pending: pendingSum,
      available: endingBalance + pendingSum,
      vaults: vaultTotal
    };
  }

  getFilteredTransactions(accountKey) {
    return this.state.transactions.filter(t => t.account === accountKey && t.status !== 'estimated');
  }

  /* =========================================
     TRANSACTION MUTATIONS
     ========================================= */

  updateRowCategory(id, newCat) {
    const tx = this.state.transactions.find(t => t.id === id);
    if (!tx) return;

    tx.category = newCat;
    tx.locked = true;
    this.saveState();

    // Targeted DOM update: only update the affected row's cells
    const row = document.querySelector(`tr[data-tx-row="${id}"]`);
    if (row) {
      const cells = row.querySelectorAll('td');
      // Update flow cell (index 4)
      if (cells[4]) {
        cells[4].innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted)">${CATEGORY_FLOW_MAP[newCat] || 'Flexible Spending'}</span>`;
      }
      // Update lock cell (index 8)
      if (cells[8]) {
        cells[8].innerHTML = tx.locked ? '🔒' : '🔓';
      }
      // Update category select styling
      const selectWrapper = row.querySelector('.cat-select-wrapper');
      if (selectWrapper) {
        const colors = CATEGORY_COLORS[newCat] || CATEGORY_COLORS['Miscellaneous'];
        selectWrapper.style.setProperty('--cat-bg', colors.bg);
        selectWrapper.style.setProperty('--cat-color', colors.color);
        selectWrapper.style.setProperty('--cat-border', colors.border);
        selectWrapper.style.setProperty('--cat-glow', colors.glow);
      }
    }

    this.showToast(`Updated to ${newCat}`);
  }

  toggleLock(id) {
    const tx = this.state.transactions.find(t => t.id === id);
    if (!tx) return;
    tx.locked = !tx.locked;
    this.saveState();

    // Targeted DOM update
    const row = document.querySelector(`tr[data-tx-row="${id}"]`);
    if (row) {
      const lockCell = row.querySelector('[data-toggle-lock]');
      if (lockCell) lockCell.innerText = tx.locked ? '🔒' : '🔓';
    }
  }

  toggleRowSelect(id, checked) {
    if (checked) this.selectedRows.add(id);
    else this.selectedRows.delete(id);
  }

  selectAllRows(accountKey, checked) {
    const tbody = document.getElementById('checkingTableBody');
    if (!tbody) return;
    tbody.querySelectorAll('[data-row-checkbox]').forEach(cb => {
      cb.checked = checked;
      if (checked) this.selectedRows.add(cb.dataset.rowCheckbox);
      else this.selectedRows.delete(cb.dataset.rowCheckbox);
    });
  }

  sortTable(col) {
    if (this.sortState.col === col) {
      this.sortState.asc = !this.sortState.asc;
    } else {
      this.sortState.col = col;
      this.sortState.asc = true;
    }
    // Re-render just the table
    this.renderTabContent(this.currentTab);
  }

  toggleDensity() {
    this.compactDensity = !this.compactDensity;
    const container = document.getElementById('checkingTableContainer');
    if (container) container.classList.toggle('compact-density', this.compactDensity);
  }

  setChartRange(range) {
    this.chartRanges.checking = range;
    document.querySelectorAll('[data-chart-range]').forEach(b => b.classList.remove('active-mode'));
    document.querySelector(`[data-chart-range="${range}"]`)?.classList.add('active-mode');
    this.renderCharts();
  }

  recalculateBalances() {
    ['CHECKING', 'SAVINGS'].forEach(account => {
      let runningBalance = 0;
      const txs = this.state.transactions
        .filter(t => t.account === account && t.status !== 'estimated')
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA !== dateB) return dateA - dateB;
          return (a.id || '').localeCompare(b.id || '');
        });

      txs.forEach(tx => {
        runningBalance += (parseFloat(tx.amount) || 0);
        if (tx.balance !== undefined && tx.balance !== 0) {
          runningBalance = parseFloat(tx.balance) || 0;
        } else {
          tx.balance = runningBalance;
        }
      });
    });
  }

  /* =========================================
     CHART RENDERING (Basic - expanded in Step 3)
     ========================================= */

  renderCharts() {
    try {
      if (this.currentTab === 'checking') this.renderCheckingChart();
      if (this.currentTab === 'networth') {
        this.renderNetWorthChart();
        this.renderDonutChart();
      }
    } catch (e) {
      console.error("Chart render error:", e);
    }
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

    const allTxs = this.state.transactions
      .filter(t => t.account === 'CHECKING' && t.status !== 'estimated')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allTxs.length === 0) {
      ctx.fillStyle = '#8a8f9e';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No balance history data available', rect.width / 2, 130);
      return;
    }

    const range = this.chartRanges.checking || 'week';
    const latestTx = allTxs[allTxs.length - 1];
    const endDate = new Date(latestTx.date);
    let startDate = new Date(endDate);
    if (range === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (range === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (range === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

    // Build daily timeline
    const timeline = [];
    const dateIter = new Date(startDate);
    if (range === 'year') {
      dateIter.setDate(1);
      while (dateIter <= endDate) {
        timeline.push(new Date(dateIter));
        dateIter.setMonth(dateIter.getMonth() + 1);
      }
    } else {
      while (dateIter <= endDate) {
        timeline.push(new Date(dateIter));
        dateIter.setDate(dateIter.getDate() + 1);
      }
    }

    const chartData = [];
    let txIndex = 0;
    let currentBalance = 0;
    while (txIndex < allTxs.length && new Date(allTxs[txIndex].date) < startDate) {
      currentBalance = parseFloat(allTxs[txIndex].balance) || 0;
      txIndex++;
    }
    timeline.forEach(date => {
      while (txIndex < allTxs.length && new Date(allTxs[txIndex].date) <= date) {
        currentBalance = parseFloat(allTxs[txIndex].balance) || 0;
        txIndex++;
      }
      chartData.push({ date, balance: currentBalance });
    });

    const balances = chartData.map(d => d.balance);
    const minBal = Math.min(...balances);
    const maxBal = Math.max(...balances);
    const pad = (maxBal - minBal) * 0.1 || 10;

    const startY = 30, endY = 220;
    const chartHeight = endY - startY;
    const points = chartData.map((d, idx) => {
      const x = 50 + (idx / Math.max(1, chartData.length - 1)) * (rect.width - 70);
      const norm = (d.balance - (minBal - pad)) / ((maxBal + pad) - (minBal - pad));
      const y = endY - norm * chartHeight;
      return { x, y, val: d.balance, date: d.date };
    });

    // Grid + Y labels
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = startY + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(rect.width - 20, y);
      ctx.stroke();
      const val = (maxBal + pad) - ((maxBal + pad - (minBal - pad)) / 4) * i;
      ctx.fillText('$' + val.toFixed(0), 45, y + 3);
    }

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.5;
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Gradient fill
    const grad = ctx.createLinearGradient(0, startY, 0, endY);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
    ctx.lineTo(points[points.length - 1].x, endY);
    ctx.lineTo(points[0].x, endY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // X labels
    ctx.fillStyle = '#5a5e6b';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    const maxLabels = Math.floor((rect.width - 70) / 60);
    const labelStep = Math.max(1, Math.ceil(points.length / maxLabels));
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < points.length; i += labelStep) {
      const p = points[i];
      const d = new Date(p.date);
      const label = range === 'year' ? monthNamesShort[d.getMonth()] : `${d.getMonth() + 1}/${d.getDate()}`;
      ctx.fillText(label, p.x, endY + 18);
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
    ctx.fillStyle = '#8a8f9e';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Net Worth Chart (refined in Step 3)', rect.width / 2, 130);
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
    ctx.fillStyle = '#8a8f9e';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Donut Chart (refined in Step 3)', rect.width / 2, 120);
  }

  /* =========================================
     UTILITIES
     ========================================= */

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Placeholder actions (built out in Step 3)
  openRulesModal() { this.showToast('Rules modal - Step 3'); }
  openImportWizard() { this.showToast('Import wizard - Step 3'); }
  clearAllData() { this.showToast('Clear data - Step 3'); }
  exportJSON() { this.showToast('Export JSON - Step 3'); }
  triggerImportJSON() { this.showToast('Import JSON - Step 3'); }
  openMassEditModal() { this.showToast('Mass edit - Step 3'); }
  openAddPendingModal() { this.showToast('Add pending - Step 3'); }
  openVaultModal() { this.showToast('New vault - Step 3'); }
  openVaultTransferModal(btn) { this.showToast('Transfer to vault - Step 3'); }
  openEditVaultModal(btn) { this.showToast('Edit vault - Step 3'); }
}

// Start the app
const app = new MoneyTrackerApp();
window.onload = () => app.init();
