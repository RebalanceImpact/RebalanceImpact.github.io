import { motion } from 'framer-motion';
import { variants, transitions } from '../../config/motion';

/**
 * SectionHeading component - Consistent section title treatment
 */
const SectionHeading = ({
  title,
  subtitle,
  label,
  align = 'center',
  size = 'default',
  theme = 'light',
  animate = true,
  className = '',
}) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const sizes = {
    small: {
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-base md:text-lg',
      label: 'text-xs',
    },
    default: {
      title: 'text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-lg md:text-xl',
      label: 'text-sm',
    },
    large: {
      title: 'text-4xl md:text-5xl lg:text-6xl',
      subtitle: 'text-xl md:text-2xl',
      label: 'text-sm',
    },
  };

  const themes = {
    light: {
      title: 'text-forest-deep',
      subtitle: 'text-charcoal-light',
      label: 'text-accent',
    },
    dark: {
      title: 'text-white',
      subtitle: 'text-sand-light',
      label: 'text-sandstone',
    },
  };

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.3 },
        variants: variants.fadeUp,
        transition: transitions.default,
      }
    : {};

  return (
    <Wrapper
      className={`max-w-3xl ${alignments[align]} ${className}`}
      {...wrapperProps}
    >
      {label && (
        <span
          className={`
            block mb-3
            font-sans font-semibold uppercase tracking-widest
            ${sizes[size].label}
            ${themes[theme].label}
          `}
        >
          {label}
        </span>
      )}
      <h2
        className={`
          font-display font-normal leading-tight
          ${sizes[size].title}
          ${themes[theme].title}
        `}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`
            mt-4 font-sans leading-relaxed
            ${sizes[size].subtitle}
            ${themes[theme].subtitle}
          `}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
};

export default SectionHeading;
