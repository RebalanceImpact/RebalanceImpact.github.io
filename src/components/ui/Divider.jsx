/**
 * Divider component - Decorative section divider
 */
const Divider = ({
  variant = 'line',
  color = 'sage',
  className = '',
}) => {
  const colors = {
    sage: 'border-sage',
    forest: 'border-forest',
    sandstone: 'border-sandstone',
    charcoal: 'border-charcoal/20',
    accent: 'border-accent',
  };

  const bgColors = {
    sage: 'bg-sage',
    forest: 'bg-forest',
    sandstone: 'bg-sandstone',
    charcoal: 'bg-charcoal/20',
    accent: 'bg-accent',
  };

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center gap-2 py-8 ${className}`}>
        <span className={`w-2 h-2 rounded-full ${bgColors[color]}`} />
        <span className={`w-2 h-2 rounded-full ${bgColors[color]}`} />
        <span className={`w-2 h-2 rounded-full ${bgColors[color]}`} />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div
        className={`h-px bg-gradient-to-r from-transparent via-${color} to-transparent my-8 ${className}`}
      />
    );
  }

  // Default line variant
  return (
    <hr
      className={`
        border-0 border-t
        ${colors[color]}
        my-8
        ${className}
      `.trim()}
    />
  );
};

export default Divider;
