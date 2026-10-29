import { useState } from 'react';
import { MONTH_LABELS, COLORS, sum, monthly, fmt } from '../../../../data/demoDashboard';
import {
  BUSINESS_YEARS,
  BUSINESS_TARGETS,
  CLIENTS,
  EXPENSES,
  selectBusiness,
  ledgerFor,
  periodEnd,
  debtorDays,
  clientTotals,
} from '../../../../data/businessDashboard';
import TrendChart from './TrendChart';
import ColumnChart from './ColumnChart';
import Donut from './Donut';
import LocationBars from './LocationBars';
import Gauge from './Gauge';
import AccountSummary from './AccountSummary';
import LedgerTable from './LedgerTable';
import { Legend, Segmented, MonthSelect, FilterChip, Report } from './ui';

const SERIES_COLORS = [COLORS.first, COLORS.second, COLORS.third, COLORS.prior];
// Money in is green and money out is brown: client revenue in shades of
// green, expense types in shades of brown, largest category darkest.
const CLIENT_COLORS = ['#334C33', '#5E7F5B', '#8BA888', '#C3D5C0'];
const EXPENSE_COLORS = ['#4F341F', '#7A5232', '#A36F47', '#C99D73', '#E3D3BF'];
const EXPENSE_LINE = '#4F341F';
const rand = (v, short) => fmt.rand(v, short);
const partiesOf = (client) => client.parties || [client.name];
const clientOfParty = (party) => CLIENTS.find((c) => partiesOf(c).includes(party));
const expenseOfAccount = (account) => EXPENSES.find((e) => e.name === account);
const costOf = (id) => (r) => r.expenses[id];

/**
 * Business view: profit, cash and receivables from the general ledger, bank
 * feed and debtors ledger. The month filter, chart clicks and the client and
 * expense filters scope the cards, charts and ledger. `onAction` reports
 * interactions to the guide beside the dashboard.
 */
const BusinessDashboard = ({ tab, onAction = () => {} }) => {
  const [year, setYear] = useState(BUSINESS_YEARS[BUSINESS_YEARS.length - 1]);
  const [month, setMonth] = useState('all');
  const [clientId, setClientIdState] = useState(null);
  const [expenseId, setExpenseIdState] = useState(null);

  const selectMonth = (i) => {
    setMonth(i === null ? 'all' : i);
    if (i !== null) onAction('month');
  };
  // The ledger filters by client or by expense account, so one replaces the other.
  const setClientId = (id) => {
    setClientIdState(id);
    if (id) {
      setExpenseIdState(null);
      onAction('client');
    }
  };
  const setExpenseId = (id) => {
    setExpenseIdState(id);
    if (id) {
      setClientIdState(null);
      onAction('expense');
    }
  };
  const toggleExpense = (id) => setExpenseId(expenseId === id ? null : id);
  const client = CLIENTS.find((c) => c.id === clientId) || null;
  const expense = EXPENSES.find((e) => e.id === expenseId) || null;

  const rows = selectBusiness(year, month);
  const yearRows = selectBusiness(year);
  const end = periodEnd(year, month);
  const periodLabel = month === 'all' ? String(year) : `${MONTH_LABELS[month]} ${year}`;
  const priorLabel = month === 'all' ? String(year - 1) : `${MONTH_LABELS[month]} ${year - 1}`;
  const endLabel = `${MONTH_LABELS[month === 'all' ? MONTH_LABELS.length - 1 : month]} ${year}`;
  const months = MONTH_LABELS.map((m) => ({ key: m, short: m, long: `${m} ${year}` }));
  const selectedMonth = month === 'all' ? null : month;

  const lines = (defs) =>
    defs.map((d, i) => ({ id: d.name, name: d.name, color: d.color || SERIES_COLORS[i], values: monthly(yearRows, d.fn) }));
  const withLegend = (items, chart, shape) => (
    <>
      <Legend items={items} shape={shape} />
      {chart}
    </>
  );

  const renderOverview = () => {
    const revenue = sum(rows, 'revenue');
    const opex = sum(rows, 'opex');
    const ebitda = sum(rows, 'ebitda');
    const clients = clientTotals(rows).map((c, i) => ({ id: c.id, name: c.name, color: CLIENT_COLORS[i], value: c.value }));
    const focus = client ? clients.find((c) => c.id === client.id) : clients.reduce((a, b) => (b.value > a.value ? b : a));
    const costs = EXPENSES.map((e, i) => ({ id: e.id, name: e.name, color: EXPENSE_COLORS[i], value: sum(rows, costOf(e.id)) }));
    const costFocus = expense ? costs.find((c) => c.id === expense.id) : costs.reduce((a, b) => (b.value > a.value ? b : a));
    const priorCost = sum(selectBusiness(year - 1, month), costOf(costFocus.id));
    const costChange = priorCost ? ((costFocus.value - priorCost) / priorCost) * 100 : 0;
    const trend = [
      ...lines([
        { name: 'Revenue', fn: 'revenue', color: COLORS.first },
        { name: 'Operating expenses', fn: 'opex', color: COLORS.third },
      ]),
      ...(expense ? [{ id: expense.id, name: expense.name, color: EXPENSE_LINE, area: false, values: monthly(yearRows, costOf(expense.id)) }] : []),
    ];
    const ledger = ledgerFor(year, month).filter((l) =>
      client ? partiesOf(client).includes(l.party) : expense ? l.account === expense.name : true
    );
    const ledgerFilter = client ? ` · ${client.name}` : expense ? ` · ${expense.name}` : '';

    const accounts = [
      {
        id: 'pl',
        label: 'Profit & Loss',
        total: sum(rows, 'profit'),
        lines: [
          { label: 'Revenue', value: revenue },
          ...EXPENSES.map((e) => ({
            label: e.name,
            value: -sum(rows, costOf(e.id)),
            active: e.id === expenseId,
            onSelect: () => toggleExpense(e.id),
          })),
          { label: 'EBITDA', value: ebitda, subtotal: true },
          { label: 'Depreciation', value: -sum(rows, 'depreciation') },
          { label: 'Net profit before tax', value: sum(rows, 'profit'), subtotal: true },
        ],
      },
      {
        id: 'bs',
        label: `Balance Sheet · ${endLabel}`,
        total: end.cashBalance + end.debtors - end.payables,
        lines: [
          { label: 'Bank', value: end.cashBalance },
          { label: 'Accounts receivable', value: end.debtors },
          { label: 'Accounts payable', value: -end.payables },
          { label: 'Net current assets', value: end.cashBalance + end.debtors - end.payables, subtotal: true },
        ],
      },
    ];

    return (
      <Report
        cardsOnTop
        cards={[
          { label: 'Total Revenue', unit: `R · ${periodLabel}`, value: fmt.rand(revenue) },
          { label: 'Total OPEX', unit: `R · ${periodLabel}`, value: fmt.rand(opex) },
          { label: 'EBITDA', unit: `R · ${fmt.pct(revenue ? (ebitda / revenue) * 100 : 0)} margin`, value: fmt.rand(ebitda) },
          { label: 'Cash Balance (Bank)', unit: `R · ${endLabel}`, value: fmt.rand(end.cashBalance) },
          { label: 'Accounts Receivable', unit: `R · ${endLabel}`, value: fmt.rand(end.debtors) },
        ]}
        panels={[
          {
            title: `Revenue vs Operating Expenses · ${year}`,
            size: 'full',
            body: (
              <>
                <Legend items={trend} />
                <TrendChart
                  labels={months}
                  series={trend}
                  format={rand}
                  area="all"
                  height={240}
                  selected={selectedMonth}
                  onSelect={selectMonth}
                  ariaLabel={`Revenue and operating expenses by month, ${year}`}
                />
                <p className="mt-2 text-xs text-charcoal-light">The gap between the two shaded areas is EBITDA.</p>
              </>
            ),
          },
          {
            title: month === 'all' ? 'Revenue by Client' : `Revenue by Client · ${periodLabel}`,
            body: (
              <>
                <Donut
                  segments={clients}
                  format={(v) => fmt.rand(v)}
                  totalLabel="revenue"
                  selected={client ? client.name : null}
                  onSelect={(name) => setClientId(name ? clients.find((c) => c.name === name).id : null)}
                />
                <p className="mt-4 text-xs text-charcoal-light">
                  {focus.name} {client ? 'is' : 'is the largest client at'} {fmt.pct(revenue ? (focus.value / revenue) * 100 : 0)} of revenue.
                </p>
              </>
            ),
          },
          {
            title: month === 'all' ? 'Operating Expenses by Type' : `Operating Expenses by Type · ${periodLabel}`,
            body: (
              <>
                <Donut
                  segments={costs}
                  format={(v) => fmt.rand(v)}
                  totalLabel="opex"
                  selected={expense ? expense.name : null}
                  onSelect={(name) => setExpenseId(name ? costs.find((c) => c.name === name).id : null)}
                />
                <p className="mt-4 text-xs text-charcoal-light">
                  {costFocus.name} {expense ? 'is' : 'is the largest cost at'} {fmt.pct(opex ? (costFocus.value / opex) * 100 : 0)} of
                  operating expenses, {costChange >= 0 ? 'up' : 'down'} {fmt.pct(Math.abs(costChange))} on {priorLabel}.
                </p>
              </>
            ),
          },
          {
            title: 'Account Summary',
            size: 'row',
            body: <AccountSummary groups={accounts} format={(v) => fmt.rand(v)} onToggle={() => onAction('account')} />,
          },
          {
            title: `General Ledger Transactions · ${periodLabel}${ledgerFilter}`,
            size: 'full',
            body: (
              <LedgerTable
                lines={ledger}
                onParty={(party) => {
                  const c = clientOfParty(party);
                  if (c) setClientId(clientId === c.id ? null : c.id);
                }}
                isClient={(party) => Boolean(clientOfParty(party))}
                onAccount={(account) => toggleExpense(expenseOfAccount(account).id)}
                isAccount={(account) => Boolean(expenseOfAccount(account))}
              />
            ),
          },
        ]}
      />
    );
  };

  const renderCash = () => {
    const flows = [
      { name: 'Cash in', fn: 'cashIn', color: COLORS.first },
      { name: 'Cash out', fn: 'cashOut', color: COLORS.third },
    ];
    const ageing = [
      { name: 'Current', value: end.debtorsCurrent },
      { name: '30–60 days', value: end.debtors30 },
      { name: 'Over 60 days', value: end.debtors60 },
    ].map((s, i) => ({ ...s, color: SERIES_COLORS[i] }));
    const clientRows = CLIENTS.map((c) => {
      const d = end.clientDebtors[c.id];
      return {
        id: c.id,
        name: c.name,
        segments: [d.current, d.mid, d.late].map((value, i) => ({ name: ageing[i].name, color: SERIES_COLORS[i], value })),
      };
    });
    const dd = debtorDays(rows);
    const priorDd = debtorDays(selectBusiness(year - 1));
    const yearOnYear = [
      { id: 'prior', name: String(year - 1), color: COLORS.prior, values: monthly(selectBusiness(year - 1), 'cashBalance') },
      { id: 'current', name: String(year), color: COLORS.first, values: monthly(yearRows, 'cashBalance') },
    ];
    const overdue = client
      ? end.clientDebtors[client.id].mid + end.clientDebtors[client.id].late
      : end.debtors30 + end.debtors60;

    return (
      <Report
        cardsOnTop
        cards={[
          { label: 'Cash Balance (Bank)', unit: `R · ${endLabel}`, value: fmt.rand(end.cashBalance) },
          { label: 'Cash Generated', unit: `R net cash flow · ${periodLabel}`, value: fmt.rand(sum(rows, 'cashIn') - sum(rows, 'cashOut')) },
          { label: 'Debtor Days', unit: `Days · ${periodLabel}`, value: dd.toFixed(1) },
          { label: 'Overdue Debtors', unit: `R over 30 days · ${client ? client.name : endLabel}`, value: fmt.rand(overdue) },
          { label: 'On Track for Target', unit: `Debtor days at or below ${BUSINESS_TARGETS.debtorDays}`, status: dd <= BUSINESS_TARGETS.debtorDays },
        ]}
        panels={[
          {
            title: `Cash In vs Cash Out · ${year}`,
            size: 'wide',
            body: withLegend(
              lines(flows),
              <ColumnChart labels={months} series={lines(flows)} format={rand} selected={selectedMonth} onSelect={selectMonth} ariaLabel={`Cash in and cash out by month, ${year}`} />,
              'square'
            ),
          },
          { title: `Debtors Ageing · ${endLabel}`, body: <Donut segments={ageing} format={(v) => fmt.rand(v)} totalLabel="receivables" /> },
          {
            title: 'Receivables by Client',
            body: withLegend(
              ageing,
              <LocationBars rows={clientRows} format={rand} selected={clientId || 'all'} onSelect={(id) => setClientId(id === 'all' ? null : id)} />,
              'square'
            ),
          },
          {
            title: 'Comparison to Target',
            body: (
              <Gauge
                value={dd}
                target={BUSINESS_TARGETS.debtorDays}
                max={Math.max(priorDd, dd, BUSINESS_TARGETS.debtorDays) * 1.2}
                format={(v) => v.toFixed(1)}
                caption="Debtor days"
              />
            ),
          },
          {
            title: `Bank Balance: ${year} vs ${year - 1}`,
            body: withLegend(
              yearOnYear,
              <TrendChart
                labels={months}
                series={yearOnYear}
                format={rand}
                area
                height={200}
                selected={selectedMonth}
                onSelect={selectMonth}
                ariaLabel={`Month-end bank balance, ${year} against ${year - 1}`}
              />
            ),
          },
        ]}
      />
    );
  };

  const views = { overview: renderOverview, cash: renderCash };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Year" value={year} onChange={setYear} options={BUSINESS_YEARS.map((y) => ({ value: y, label: String(y) }))} />
        <MonthSelect value={month} onChange={selectMonth} months={MONTH_LABELS} />
        {client && <FilterChip label={`Client: ${client.name}`} onClear={() => setClientId(null)} />}
        {expense && tab === 'overview' && <FilterChip label={`Expense: ${expense.name}`} onClear={() => setExpenseId(null)} />}
      </div>
      {views[tab]()}
    </>
  );
};

export default BusinessDashboard;
