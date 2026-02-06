import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../config/motion';

/**
 * PageWrapper component - Wraps pages with enter/exit animations
 */
const PageWrapper = ({ children, className = '' }) => {
  return (
    <motion.main
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.main>
  );
};

export default PageWrapper;
