import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal, useCountUp } from '../../hooks';
import { variants, transitions } from '../../config/motion';

/**
 * StatCounter component - Animated number with label
 */
const StatCounter = ({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2000,
  theme = 'light',
}) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.5 });
  const { formattedCount, start } = useCountUp({
    end: value,
    duration,
    prefix,
    suffix,
    decimals,
  });

  useEffect(() => {
    if (isVisible) {
      start();
    }
  }, [isVisible, start]);

  const themes = {
    light: {
      value: 'text-forest-deep',
      label: 'text-charcoal-light',
    },
    dark: {
      value: 'text-white',
      label: 'text-sand-light/80',
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants.fadeUp}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={transitions.default}
      className="text-center"
    >
      <span
        className={`
          block font-display text-4xl md:text-5xl lg:text-6xl
          ${themes[theme].value}
        `}
      >
        {formattedCount}
      </span>
      <span
        className={`
          block mt-2 font-sans font-medium text-sm md:text-base uppercase tracking-wider
          ${themes[theme].label}
        `}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default StatCounter;
