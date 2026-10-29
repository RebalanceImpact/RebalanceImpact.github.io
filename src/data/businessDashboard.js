/**
 * Demo dataset for the Business view of the dashboard on /data-kpis/.
 *
 * One row per month (2023 to 2025) for a fictional services business (all
 * client and supplier names are invented), as it
 * looks once the general ledger, bank feed and debtors ledger are joined.
 * Cash, receivables and payables roll forward month by month, and the ledger
 * transactions are generated from the same figures, so every view reconciles.
 */
import { MONTH_LABELS, mulberry32, sum } from './demoDashboard';

export const BUSINESS_YEARS = [2024, 2025];
const FIRST_YEAR = 2023;

export const CLIENTS = [
  { id: 'quillstone', name: 'Quillstone Retail', share: 0.36, payDelay: 1.25 },
  { id: 'marula', name: 'Marula Bend Freight', share: 0.24, payDelay: 0.85 },
  { id: 'thornvey', name: 'Thornvey Hospitality', share: 0.16, payDelay: 1 },
  { id: 'other', name: 'Other clients', share: 0.24, payDelay: 0.9, parties: ['Orrinvale Health', 'Pebblecrest Events', 'Saltwick Studio'] },
];

export const EXPENSES = [
  { id: 'salaries', name: 'Salaries & wages', share: 0.56, party: 'Payroll', type: 'Payroll journal', description: 'Monthly salaries', day: 25 },
  { id: 'rent', name: 'Rent & utilities', share: 0.13, party: 'Wrenfield Properties', type: 'Supplier invoice', description: 'Office rent and utilities', day: 1 },
  { id: 'software', name: 'Software & subscriptions', share: 0.08, party: 'Halcyra Software', type: 'Debit order', description: 'Software licences', day: 3 },
  { id: 'marketing', name: 'Marketing & travel', share: 0.11, party: 'Various suppliers', type: 'Supplier invoice', description: 'Campaigns and client travel', day: 14 },
  { id: 'other', name: 'Other expenses', share: 0.12, party: 'Various suppliers', type: 'Supplier invoice', description: 'Insurance, fees and sundries', day: 18 },
];

export const BUSINESS_TARGETS = { debtorDays: 45 };

const REVENUE_BASE = 2.2e6;
const OPEX_RATIO = 0.8;
const DEPRECIATION = 38000;
const GROWTH = { 2023: 1, 2024: 1.05, 2025: 1.05 * 1.11 };
const OPEX_GROWTH = { 2023: 1, 2024: 1.06, 2025: 1.12 };
const DEBTOR_DAYS = { 2023: 58, 2024: 52, 2025: 41 };
// Company-wide share of debtors that are current and 30-60 days; the rest is over 60 days.
const AGEING = { 2023: [0.52, 0.29], 2024: [0.6, 0.25], 2025: [0.71, 0.19] };
const PAYABLE_RATIO = 0.32;
const TAX_RATE = 0.27;
const DIVIDEND_SHARE = 0.8; // of prior-year profit after tax, paid in March
const SERVICES = ['Monthly retainer', 'Project delivery', 'Consulting hours', 'Workshop facilitation', 'Reporting support'];

const rand = mulberry32(20250901);
const jitter = (pct) => 1 + (rand() * 2 - 1) * pct;

export const businessRecords = (() => {
  const rows = [];
  let cash = 1.8e6;
  let prev = null;
  let profitSinceTax = 0;
  let profitThisYear = 0;
  let profitLastYear = 0;

  [FIRST_YEAR, ...BUSINESS_YEARS].forEach((year) => {
    profitLastYear = profitThisYear;
    profitThisYear = 0;

    MONTH_LABELS.forEach((_, m) => {
      const season = 1 + 0.07 * Math.sin((2 * Math.PI * (m - 1)) / 12) - (m === 0 || m === 11 ? 0.12 : 0);
      const target = REVENUE_BASE * GROWTH[year] * season * jitter(0.05);
      const raw = CLIENTS.map((c) => c.share * jitter(0.12));
      const total = raw.reduce((t, v) => t + v, 0);
      const clientRevenue = Object.fromEntries(CLIENTS.map((c, i) => [c.id, (target * raw[i]) / total]));
      const revenue = sum(Object.values(clientRevenue), (v) => v);

      const opexTotal = REVENUE_BASE * OPEX_RATIO * OPEX_GROWTH[year] * jitter(0.03);
      const expenses = Object.fromEntries(EXPENSES.map((e) => [e.id, opexTotal * e.share * (e.id === 'salaries' ? 1 : jitter(0.1))]));
      const opex = sum(Object.values(expenses), (v) => v);
      const ebitda = revenue - opex;
      const profit = ebitda - DEPRECIATION;

      // Receivables: days of sales outstanding, slower payers carry more and older debt.
      const debtors = (((prev ? (revenue + prev.revenue) / 2 : revenue) / 30.4) * DEBTOR_DAYS[year]) * jitter(0.03);
      const weights = CLIENTS.map((c) => c.share * c.payDelay);
      const weightTotal = weights.reduce((t, v) => t + v, 0);
      const [currentShare, midShare] = AGEING[year];
      const overdueShare = 1 - currentShare;
      const clientDebtors = Object.fromEntries(
        CLIENTS.map((c, i) => {
          const balance = (debtors * weights[i]) / weightTotal;
          const overdue = Math.min(0.9, overdueShare * c.payDelay * jitter(0.05));
          const mid = balance * overdue * (midShare / overdueShare);
          return [c.id, { balance, current: balance * (1 - overdue), mid, late: balance * overdue - mid }];
        })
      );

      const payables = opex * PAYABLE_RATIO;
      const cashIn = revenue - (debtors - (prev ? prev.debtors : debtors));
      profitSinceTax += profit;
      profitThisYear += profit;
      const tax = m === 1 || m === 7 ? Math.max(0, profitSinceTax) * TAX_RATE : 0;
      if (tax) profitSinceTax = 0;
      const dividend = m === 2 ? Math.max(0, profitLastYear) * (1 - TAX_RATE) * DIVIDEND_SHARE : 0;
      const cashOut = opex - (payables - (prev ? prev.payables : payables)) + tax + dividend;
      cash += cashIn - cashOut;

      const row = {
        year,
        month: m,
        revenue,
        clientRevenue,
        opex,
        expenses,
        depreciation: DEPRECIATION,
        ebitda,
        profit,
        tax,
        dividend,
        cashIn,
        cashOut,
        cashBalance: cash,
        debtors,
        clientDebtors,
        debtorsCurrent: sum(Object.values(clientDebtors), 'current'),
        debtors30: sum(Object.values(clientDebtors), 'mid'),
        debtors60: sum(Object.values(clientDebtors), 'late'),
        payables,
      };
      rows.push(row);
      prev = row;
    });
  });

  return rows;
})();

// ---------------------------------------------------------------------------
// General ledger lines, generated from the monthly figures above.
// ---------------------------------------------------------------------------

const pad = (n, width) => String(n).padStart(width, '0');

export const ledger = (() => {
  const gl = mulberry32(777);
  const day = () => 2 + Math.floor(gl() * 26);
  let invoiceNo = 1040;
  let receiptNo = 610;
  let billNo = 2210;
  const lines = [];

  businessRecords.forEach((r) => {
    const month = [];
    const push = (line) => month.push({ year: r.year, month: r.month, ...line });

    CLIENTS.forEach((c) => {
      const parties = c.parties || [c.name];
      const splits = c.parties ? [0.45, 0.35, 0.2] : c.share > 0.2 ? [0.6, 0.4] : [1];
      const invoices = c.parties ? parties.map((p, i) => [p, splits[i]]) : splits.map((s) => [c.name, s]);
      invoices.forEach(([party, share]) => {
        invoiceNo += 1;
        push({
          day: day(),
          account: 'Sales',
          party,
          reference: `INV${pad(invoiceNo, 6)}`,
          type: 'Tax invoice',
          description: SERVICES[Math.floor(gl() * SERVICES.length)],
          debit: 0,
          credit: r.clientRevenue[c.id] * share,
        });
      });
      const receiptShare = r.clientRevenue[c.id] / r.revenue;
      parties.forEach((party, i) => {
        receiptNo += 1;
        push({
          day: day(),
          account: 'Bank',
          party,
          reference: `RCT${pad(receiptNo, 5)}`,
          type: 'Receipt',
          description: 'EFT received',
          debit: r.cashIn * receiptShare * (c.parties ? [0.45, 0.35, 0.2][i] : 1),
          credit: 0,
        });
      });
    });

    EXPENSES.forEach((e) => {
      billNo += 1;
      push({
        day: e.day,
        account: e.name,
        party: e.party,
        reference: e.id === 'salaries' ? `PAY-${r.year}${pad(r.month + 1, 2)}` : `BILL${pad(billNo, 5)}`,
        type: e.type,
        description: e.description,
        debit: r.expenses[e.id],
        credit: 0,
      });
    });

    if (r.tax) {
      push({ day: 28, account: 'Income tax', party: 'SARS', reference: `ITR-${r.year}${pad(r.month + 1, 2)}`, type: 'Payment', description: 'Provisional tax', debit: r.tax, credit: 0 });
    }
    if (r.dividend) {
      push({ day: 20, account: 'Dividends paid', party: 'Shareholders', reference: `DIV-${r.year}`, type: 'Payment', description: 'Annual dividend', debit: r.dividend, credit: 0 });
    }

    lines.push(...month.sort((a, b) => a.day - b.day));
  });

  return lines;
})();

// ---------------------------------------------------------------------------
// Selection helpers. `month` is 'all' for the full year or 0-11.
// ---------------------------------------------------------------------------

const inPeriod = (r, year, month) => r.year === year && (month === 'all' || r.month === month);

export const selectBusiness = (year, month = 'all') => businessRecords.filter((r) => inPeriod(r, year, month));
export const ledgerFor = (year, month) => ledger.filter((l) => inPeriod(l, year, month));

/** The record at the end of the period, for balances. */
export const periodEnd = (year, month) => selectBusiness(year, month === 'all' ? MONTH_LABELS.length - 1 : month)[0];

/** Average month-end receivables as days of revenue over the period. */
export const debtorDays = (rows) => {
  const revenue = sum(rows, 'revenue');
  return revenue ? (sum(rows, 'debtors') / revenue) * 30.4 : 0;
};

export const clientTotals = (rows) =>
  CLIENTS.map((c) => ({ ...c, value: sum(rows, (r) => r.clientRevenue[c.id]) }));
