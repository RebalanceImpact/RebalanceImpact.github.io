import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { mainNavLinks, ctaLink } from '../../config/navigation';
import Button from '../ui/Button';

const MobileNav = ({ onClose }) => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

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

  const toggleExpand = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  // Flatten links for index calculation
  let linkIndex = 0;

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
          <div className="flex-1 space-y-2 overflow-y-auto">
            {mainNavLinks.map((link) => {
              const currentIndex = linkIndex++;
              const hasChildren = link.children && link.children.length > 0;
              const isExpanded = expandedMenu === link.label;

              return (
                <motion.div
                  key={link.href}
                  custom={currentIndex}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {hasChildren ? (
                    // Menu item with dropdown
                    <div>
                      <button
                        onClick={() => toggleExpand(link.label)}
                        className={`
                          w-full flex items-center justify-between
                          py-4 px-4 rounded-lg
                          font-sans font-medium text-lg
                          transition-all duration-200
                          ${
                            isActive(link.href) || link.children.some(child => isActive(child.href))
                              ? 'bg-forest/10 text-forest'
                              : 'text-charcoal hover:bg-sand-light'
                          }
                        `}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-5 h-5 opacity-50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-1 mt-1">
                              <Link
                                to={link.href}
                                onClick={onClose}
                                className={`
                                  block py-3 px-4 rounded-lg
                                  font-sans font-medium text-base
                                  transition-all duration-200
                                  ${
                                    isActive(link.href) && !link.children.some(child => isActive(child.href))
                                      ? 'bg-forest text-white'
                                      : 'text-charcoal-light hover:bg-sand-light'
                                  }
                                `}
                              >
                                {link.label} Overview
                              </Link>
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  onClick={onClose}
                                  className={`
                                    block py-3 px-4 rounded-lg
                                    font-sans font-medium text-base
                                    transition-all duration-200
                                    ${
                                      isActive(child.href)
                                        ? 'bg-forest text-white'
                                        : 'text-charcoal-light hover:bg-sand-light'
                                    }
                                  `}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular menu item
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
                  )}
                </motion.div>
              );
            })}
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
