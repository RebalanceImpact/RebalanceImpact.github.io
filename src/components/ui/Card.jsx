import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Card component - Elevated content card
 */
const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'default',
  hover = false,
  animate = false,
  className = '',
  as: Component = 'div',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white shadow-lg',
    elevated: 'bg-white shadow-xl',
    flat: 'bg-white',
    outlined: 'bg-white border border-sage/50',
    filled: 'bg-sand-light',
    dark: 'bg-forest-deep text-white',
  };

  const paddings = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8 lg:p-10',
  };

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
    : '';

  const Wrapper = animate ? motion.div : Component;
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <Wrapper
      ref={ref}
      className={`
        rounded-xl
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `.trim()}
      {...wrapperProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
});

Card.displayName = 'Card';

export default Card;
