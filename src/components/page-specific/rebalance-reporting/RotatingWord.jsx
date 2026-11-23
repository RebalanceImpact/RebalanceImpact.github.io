import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * RotatingWord - shows each word for `interval` ms, then rolls to the next, in a loop.
 * The box is as wide as the longest word, so the line around it does not shift.
 * Screen readers hear the full list once instead of every change.
 */
const RotatingWord = ({ words, interval = 1000, className = '' }) => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <span className={`relative inline-grid align-bottom overflow-hidden text-left ${className}`}>
      <span className="sr-only">{words.join(', ')}</span>
      {/* Invisible longest word sets the width and height */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{longest}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1"
          initial={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingWord;
