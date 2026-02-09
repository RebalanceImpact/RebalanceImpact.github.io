import { forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Button component with multiple variants
 * Supports both button and link rendering
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'default',
  href,
  external = false,
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  ...props
}, ref) => {
  const navigate = useNavigate();

  // Handle click for hash links with smooth scrolling
  const handleHashClick = (e) => {
    if (onClick) onClick(e);

    if (href && href.includes('#')) {
      e.preventDefault();
      const [path, hash] = href.split('#');
      const targetPath = path || '/';
      const currentPath = window.location.pathname;

      // If we're already on the target path, just scroll to the element
      if (currentPath === targetPath) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to the path first, then scroll will happen via ScrollToTop
        navigate(`${targetPath}#${hash}`);
      }
    }
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-sans font-semibold
    rounded-lg
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-accent text-white
      hover:bg-accent-hover
      focus:ring-accent
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-forest text-white
      hover:bg-forest-light
      focus:ring-forest
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-forest text-forest
      hover:bg-forest hover:text-white
      focus:ring-forest
    `,
    ghost: `
      text-forest
      hover:bg-forest/10
      focus:ring-forest
    `,
    link: `
      text-accent
      hover:text-accent-hover
      underline underline-offset-4
      focus:ring-accent
    `,
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </>
  );

  const MotionComponent = motion.button;

  // External link
  if (href && external) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  // Internal link with hash - use click handler for smooth scrolling
  if (href && href.includes('#')) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          ref={ref}
          to={href}
          className={combinedClassName}
          onClick={handleHashClick}
          {...props}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  // Internal link without hash
  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          ref={ref}
          to={href}
          className={combinedClassName}
          onClick={onClick}
          {...props}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  // Regular button
  return (
    <MotionComponent
      ref={ref}
      disabled={disabled || loading}
      className={combinedClassName}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {content}
    </MotionComponent>
  );
});

Button.displayName = 'Button';

export default Button;
