import { MONTH_LABELS, fmt } from '../../../../data/demoDashboard';

const money = (v) => (v ? fmt.rand(v) : '–');
const cell = 'whitespace-nowrap px-3 py-1.5';

/**
 * Scrollable general ledger listing with a sticky header and debit/credit
 * totals. Amounts sit next to the party so they stay visible on narrow screens.
 * With `onParty`, client parties (`isClient`) are clickable filters, and with
 * `onAccount`, so are filterable accounts (`isAccount`).
 */
const filterButton =
  'rounded font-medium text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

const LedgerTable = ({ lines, onParty, isClient = () => false, onAccount, isAccount = () => false }) => {
  const debit = lines.reduce((t, l) => t + l.debit, 0);
  const credit = lines.reduce((t, l) => t + l.credit, 0);

  return (
    <div className="max-h-[320px] overflow-auto rounded-lg ring-1 ring-black/5">
      <table className="w-full min-w-[720px] text-xs md:text-sm tabular-nums">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-black/10 text-left text-xs text-charcoal-light">
            <th className={`${cell} font-medium`}>Date</th>
            <th className={`${cell} font-medium`}>Account</th>
            <th className={`${cell} font-medium`}>Party</th>
            <th className={`${cell} text-right font-medium`}>Debit</th>
            <th className={`${cell} text-right font-medium`}>Credit</th>
            <th className={`${cell} font-medium`}>Reference</th>
            <th className={`${cell} font-medium`}>Type</th>
            <th className={`${cell} font-medium`}>Description</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={`${l.reference}-${l.party}-${l.account}`} className="border-b border-black/5 text-charcoal">
              <td className={`${cell} text-charcoal-light`}>
                {String(l.day).padStart(2, '0')} {MONTH_LABELS[l.month]}
              </td>
              <td className={cell}>
                {onAccount && isAccount(l.account) ? (
                  <button type="button" onClick={() => onAccount(l.account)} className={filterButton}>
                    {l.account}
                  </button>
                ) : (
                  l.account
                )}
              </td>
              <td className={cell}>
                {onParty && isClient(l.party) ? (
                  <button type="button" onClick={() => onParty(l.party)} className={filterButton}>
                    {l.party}
                  </button>
                ) : (
                  l.party
                )}
              </td>
              <td className={`${cell} text-right`}>{money(l.debit)}</td>
              <td className={`${cell} text-right`}>{money(l.credit)}</td>
              <td className={`${cell} text-charcoal-light`}>{l.reference}</td>
              <td className={`${cell} text-charcoal-light`}>{l.type}</td>
              <td className={`${cell} text-charcoal-light`}>{l.description}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="sticky bottom-0 bg-white">
          <tr className="border-t border-black/10 font-semibold text-forest-deep">
            <td className="px-3 py-2" colSpan={3}>
              {lines.length} transactions
            </td>
            <td className={`${cell} py-2 text-right`}>{fmt.rand(debit)}</td>
            <td className={`${cell} py-2 text-right`}>{fmt.rand(credit)}</td>
            <td colSpan={3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LedgerTable;
