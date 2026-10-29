import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * Headline figure card. Pass `status` (true/false) for an on-track card.
 */
const StatCard = ({ label, unit, value, status }) => {
  const isStatus = typeof status === 'boolean';

  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
      <div className="text-sm font-semibold text-forest-deep">{label}</div>
      <div className="text-xs text-charcoal-light">{unit}</div>
      {isStatus ? (
        <div className={`mt-2 flex items-center gap-2 text-2xl font-semibold ${status ? 'text-forest' : 'text-accent-hover'}`}>
          {status ? <CheckCircle2 className="h-6 w-6" aria-hidden="true" /> : <XCircle className="h-6 w-6" aria-hidden="true" />}
          {status ? 'Yes' : 'No'}
        </div>
      ) : (
        <div className="mt-2 whitespace-nowrap text-2xl font-semibold leading-tight text-forest-deep">{value}</div>
      )}
    </div>
  );
};

export default StatCard;
