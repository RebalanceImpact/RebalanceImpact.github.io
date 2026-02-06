import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { mainNavLinks, ctaLink } from '../../config/navigation';
import Button from '../ui/Button';

const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <motion.nav
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 lg:hidden shadow-2xl"
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            {mainNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={link.href}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between
                    py-4 px-4 rounded-lg
                    font-sans font-medium text-lg
                    transition-all duration-200
                    ${
                      isActive(link.href)
                        ? 'bg-forest text-white'
                        : 'text-charcoal hover:bg-sand-light'
                    }
                  `}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            custom={mainNavLinks.length}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            className="pt-6 border-t border-sage/30"
          >
            <Button
              href={ctaLink.href}
              variant="primary"
              size="large"
              className="w-full"
              onClick={onClose}
            >
              {ctaLink.label}
            </Button>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            custom={mainNavLinks.length + 1}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            className="pt-6 text-center text-sm text-charcoal-light"
          >
            <p>info@rebalanceimpact.com</p>
            <p className="mt-1">South Africa</p>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default MobileNav;
