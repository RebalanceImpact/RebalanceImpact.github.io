import { forwardRef } from 'react';

/**
 * Container component - Max-width content wrapper with consistent padding
 */
const Container = forwardRef(({
  children,
  className = '',
  as: Component = 'div',
  size = 'default',
  ...props
}, ref) => {
  const sizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <Component
      ref={ref}
      className={`
        mx-auto px-4 sm:px-6 lg:px-8
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </Component>
  );
});

Container.displayName = 'Container';

export default Container;
