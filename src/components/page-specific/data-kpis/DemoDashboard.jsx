import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import SustainabilityDashboard from './dashboard/SustainabilityDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';
import DashboardGuide from './dashboard/DashboardGuide';

const VIEWS = {
  sustainability: {
    Component: SustainabilityDashboard,
    tabs: [
      { id: 'ghg', label: 'GHG Emissions' },
      { id: 'energy', label: 'Energy & Water' },
      { id: 'safety', label: 'Health & Safety' },
      { id: 'finance', label: 'Climate & Financial Risk' },
    ],
    switchTo: 'business',
    switchLabel: 'View Business Dashboard',
    steps: [
      { id: 'month', title: 'Click a point on a line chart', detail: 'Every card, doughnut and bar updates to that month.' },
      { id: 'location', title: 'Click a location bar', detail: 'The whole dashboard filters to that location.' },
      { id: 'highlight', title: 'Click a doughnut segment or legend item', detail: 'That series stands out across the charts.' },
      { id: 'yearly', title: 'Switch the trend to Year on year', detail: 'Compare actuals and the dotted forecast with the 2030 target.' },
      { id: 'initiative', title: 'Change the planned initiatives', detail: 'Forecasts, costs and risks shift on every tab.' },
      { id: 'financeView', title: 'Explore Climate & Financial Risk', detail: 'Switch to Climate Risk for hazards and heat by site.' },
    ],
  },
  business: {
    Component: BusinessDashboard,
    tabs: [
      { id: 'overview', label: 'Executive Overview' },
      { id: 'cash', label: 'Cash & Debtors' },
    ],
    switchTo: 'sustainability',
    switchLabel: 'View Sustainability Dashboard',
    steps: [
      { id: 'month', title: 'Click a month on a chart', detail: 'The cards, doughnuts, account summary and ledger follow.' },
      { id: 'client', title: 'Click a client', detail: 'In the doughnut or ledger, to filter to that client.' },
      { id: 'expense', title: 'Click an expense type', detail: 'Its trend shows on the chart and the ledger filters to it.' },
      { id: 'account', title: 'Expand or collapse the Account Summary', detail: 'Drill from the bottom line into each account.' },
      { id: 'cash', title: 'Open Cash & Debtors', detail: 'See collections, ageing and the bank balance.' },
    ],
  },
};

/**
 * Interactive dashboard demo with two example dashboards (sustainability
 * reporting, and day-to-day business performance) and a guide beside it that
 * ticks off each interaction as the visitor tries it.
 */
const DemoDashboard = () => {
  const [viewId, setViewId] = useState('sustainability');
  const [tabs, setTabs] = useState({ sustainability: 'ghg', business: 'overview' });
  const [done, setDone] = useState({ sustainability: [], business: [] });

  const view = VIEWS[viewId];
  const tab = tabs[viewId];
  const { Component } = view;

  const track = (id) =>
    setDone((prev) => (prev[viewId].includes(id) ? prev : { ...prev, [viewId]: [...prev[viewId], id] }));
  const selectTab = (id) => {
    setTabs((prev) => ({ ...prev, [viewId]: id }));
    if (viewId === 'business' && id === 'cash') track('cash');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-start">
      {/* The header stacks by the dashboard's own width, so the tabs never scroll beside the page contents */}
      <div className="@container order-2 min-w-0 overflow-hidden rounded-2xl bg-cream shadow-xl ring-1 ring-black/5 xl:order-1">
        <div className="flex flex-col-reverse gap-2 bg-forest-deep px-4 pt-3 @min-[52rem]:flex-row @min-[52rem]:items-end @min-[52rem]:justify-between md:px-6">
          <div role="tablist" aria-label="Dashboard pages" className="-mx-4 flex min-w-0 gap-1 overflow-x-auto px-4 @min-[52rem]:mx-0 @min-[52rem]:px-0">
            {view.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tab}
                onClick={() => selectTab(t.id)}
                className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  t.id === tab ? 'bg-cream text-forest-deep' : 'text-sand-light/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setViewId(view.switchTo)}
            className="inline-flex flex-shrink-0 items-center gap-2 self-end rounded-lg bg-accent px-3 py-1.5 text-xs md:text-sm font-semibold text-white shadow-md transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-sandstone @min-[52rem]:mb-2 @min-[52rem]:self-auto"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            {view.switchLabel}
          </button>
        </div>

        <div key={viewId} className="space-y-4 p-4 md:p-6">
          <Component tab={tab} onAction={track} />
        </div>
      </div>

      <div className="order-1 xl:sticky xl:top-28 xl:order-2">
        <DashboardGuide steps={view.steps} done={done[viewId]} />
      </div>
    </div>
  );
};

export default DemoDashboard;
