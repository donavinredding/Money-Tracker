/* =========================================
   MONEY TRACKER APP - CORE LOGIC
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

const INITIAL_EMPTY_STATE = {
version: 1,
accounts: {
CHECKING: { id: "CHECKING", name: "Joint Checking 0199", verifiedBalance: 0.00, availableBalance: 0.00 },
SAVINGS: { id: "SAVINGS", name: "Joint Savings 3703", verifiedBalance: 0.00, availableBalance: 0.00 }
},
vaults: [],
pendingItems: [],
transactions: [], // Stored as compact arrays: [id, date, description, amount, balance, category, status, locked, groupId, ruleConfig]
scenarios: [{ id: "sc_honda", name: "Increase Honda Payment", amount: -100.00, active: true }],
suggestedVaults: [],
nicknameRules: [],
loans: []
};

class MoneyTrackerApp {
constructor() {
this.state = this.loadState();
this.currentTab = 'checking';
this.selectedRows = new Set();
this.chartRanges = { checking: 'week', networth: 'year', forecaster: 'year' };
this.calendarMonth = new Date(2026, 8, 1);
this.sortState = { col: 'date', asc: false };
this.currentDrawerDate = null;
this.resizeTimeout = null;
this.saveTimeout = null;
this.transactionIndex = new Map(); // O(1) lookup for transactions by date
}

/* =========================================
   STATE MANAGEMENT & STORAGE
   ========================================= */

loadState() {
const saved = localStorage.getItem('MONEY_TRACKER_STATE_V1');
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
} catch(e) { console.error("State load error:", e); }
}
return JSON.parse(JSON.stringify(INITIAL_EMPTY_STATE));
}

saveState() {
// Debounce saving to localStorage to prevent UI freezing
if (this.saveTimeout) clearTimeout(this.saveTimeout);
this.saveTimeout = setTimeout(() => {
localStorage.setItem('MONEY_TRACKER_STATE_V1', JSON.stringify(this.state));
}, 1500);
}

/* =========================================
   INITIALIZATION & EVENT DELEGATION
   ========================================= */

init() {
this.buildTransactionIndex();
this.renderTabContent(this.currentTab);
this.bindGlobalEvents();
this.showToast("App Initialized");
}

buildTransactionIndex() {
// Create a Map for O(1) date lookups
this.transactionIndex.clear();
this.state.transactions.forEach(t => {
const date = t[1]; // Assuming compact array [id, date, ...]
if (!this.transactionIndex.has(date)) {
this.transactionIndex.set(date, []);
}
this.transactionIndex.get(date).push(t);
});
}

bindGlobalEvents() {
// 1. Tab Switching
document.getElementById('tabStrip').addEventListener('click', (e) => {
const btn = e.target.closest('.tab-btn');
if (btn) {
const tabId = btn.dataset.tab;
this.switchTab(tabId);
}
});

// 2. Action Buttons (Delegation)
document.addEventListener('click', (e) => {
const btn = e.target.closest('[data-action]');
if (btn) {
const action = btn.dataset.action;
if (this[action]) this[action]();
}
});

// 3. Window Resize
window.addEventListener('resize', () => {
if (this.resizeTimeout) cancelAnimationFrame(this.resizeTimeout);
this.resizeTimeout = requestAnimationFrame(() => this.renderCharts());
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
const mainContent = document.getElementById('mainContent');
// Clear previous content
mainContent.innerHTML = '';

// This is where we will inject the HTML for each tab
// For now, we will just add a placeholder
const placeholder = document.createElement('div');
placeholder.className = 'view-container active';
placeholder.innerHTML = `<h2>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Tab</h2><p>Content loading...</p>`;
mainContent.appendChild(placeholder);
}

/* =========================================
   UTILITIES
   ========================================= */

showToast(msg) {
const container = document.getElementById('toastContainer');
if (!container) return;
const toast = document.createElement('div');
toast.className = 'toast';
toast.innerText = msg;
container.appendChild(toast);
setTimeout(() => toast.remove(), 3000);
}
}

// Start the app
const app = new MoneyTrackerApp();
window.onload = () => app.init();