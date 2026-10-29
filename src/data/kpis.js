export const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Industry Sectors' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 20, suffix: '+', label: 'Countries' },
];

export const dataProcess = [
  {
    id: 1,
    title: "Data Collection",
    description: "At Rebalance Impact, we begin by centralizing and collecting non-financial and financial data into a unified platform. This consolidation eliminates silos and ensures data integrity to support accurate tracking and informed, integrated decision-making.",
    highlight: "accurate tracking and informed, integrated decision-making",
  },
  {
    id: 2,
    title: "Target Setting",
    description: "We help you establish transparent, measurable target setting processes that build stakeholder trust and enable clear tracking of your financial and non-financial performance progress.",
    highlight: "build stakeholder trust",
  },
  {
    id: 3,
    title: "Forecasting",
    description: "Model the impact of any operational changes or desired targets to analyze potential impacts on financial and non-financial KPIs. Our scenario analysis provides insights into cost-effectiveness and helps align sustainability goals for long-term business performance.",
    highlight: "align sustainability goals for long-term business performance",
  },
  {
    id: 4,
    title: "Shared Accountability",
    description: "We promote collaborative data governance by aligning internal teams and suppliers around shared accountability for data quality, driving continuous improvements and strengthening financial and sustainable performance across your entire value chain.",
    highlight: "strengthening financial and sustainable performance across your entire value chain",
  },
];

export const dataServices = [
  {
    id: 'data',
    title: 'Data & Insights',
    description: 'Centralise your sustainability, operational and financial data, and track it against your targets on interactive dashboards.',
    href: '#dashboard',
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Take repetitive tasks such as data capture, reconciliations and stock ordering off your team’s desk.',
    href: '#automation',
  },
];

export const automationTasks = [
  {
    id: 'utilities',
    title: 'Utility & Fuel Data Capture',
    description: 'Electricity, water and fuel figures are captured from bills and fuel cards each month and converted to emissions, ready for reporting.',
  },
  {
    id: 'suppliers',
    title: 'Supplier Data Requests',
    description: 'Supplier questionnaires are issued, followed up and collected on a schedule, with responses checked as they arrive.',
  },
  {
    id: 'reconciliations',
    title: 'Reconciliations',
    description: 'Bank and ledger lines are matched automatically, leaving your team to review only the exceptions.',
  },
  {
    id: 'documents',
    title: 'Invoice & Document Capture',
    description: 'Invoices and supporting documents are read, validated and coded automatically, with duplicates flagged before they post.',
  },
  {
    id: 'expenses',
    title: 'Expense Claims & Approvals',
    description: 'Receipts are captured from email or a phone photo, checked against policy and routed for approval before they post to the ledger.',
  },
  {
    id: 'stock',
    title: 'Inventory & Reordering',
    description: 'Stock on hand is matched against upcoming jobs and orders, and reorders are raised in time, so you never over-order or run short.',
  },
  {
    id: 'checks',
    title: 'Data Checks & Alerts',
    description: 'Missing, late or unusual figures are flagged as they arrive, so issues are resolved before they reach a report.',
  },
];

export const capabilities = [
  {
    title: 'Centralized Data Hub',
    description: 'Consolidate data from multiple sources into a single, reliable platform.',
  },
  {
    title: 'Custom Dashboards',
    description: 'Tailored visualizations that highlight the metrics most important to your stakeholders, accessible anytime, from any device.',
  },
  {
    title: 'Target Tracking',
    description: 'Set, monitor, and report on financial and non-financial targets with real-time progress updates.',
  },
  {
    title: 'Scenario Modeling',
    description: 'Model the impact of strategic decisions on your Sustainability and financial KPIs.',
  },
  {
    title: 'Audit Trail',
    description: 'Complete transparency and traceability for all data changes and calculations.',
  },
  {
    title: 'No Licence Lock-In',
    description: 'Dashboards and automations built for you to own, without ongoing licence commitments.',
  },
];

// Kept for reference while the Power BI subscription is active; the page now uses DemoDashboard.
export const powerBIConfig = {
  embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiMmI3ZWMwNzEtZTFmZS00NmQ2LTk1ZmEtOGVhZTQxYmRmMjMyIiwidCI6IjYzOGRlYjljLTEwZDQtNGZiYi1hMjc2LWY0NWM1Y2ZkYWE5MiJ9",
  title: "ESG Performance Dashboard",
  description: "See how your data is monitored and transformed with this interactive template. Built on trusted visualization platforms like Power BI, our dashboards showcase how dynamic insights can empower your decisions.",
};

export default stats;
