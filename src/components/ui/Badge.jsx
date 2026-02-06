/**
 * Badge component - Category/tag labels
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-sage/30 text-forest-deep',
    primary: 'bg-forest text-white',
    accent: 'bg-accent/20 text-accent-hover',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    neutral: 'bg-charcoal/10 text-charcoal',
    outline: 'bg-transparent border border-forest text-forest',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-sans font-medium
        rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
};

export default Badge;
