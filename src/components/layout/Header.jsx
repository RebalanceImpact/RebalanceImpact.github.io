import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { mainNavLinks, ctaLink } from '../../config/navigation';
import Container from '../ui/Container';
import Button from '../ui/Button';
import MobileNav from './MobileNav';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Handle scroll detection for header style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleDropdownToggle = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${
            isScrolled
              ? 'bg-forest-deep shadow-lg'
              : 'bg-white shadow-sm'
          }
        `}
      >
        <Container>
          <nav className="flex items-center justify-between h-[72px] md:h-[80px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <img
                src={isScrolled ? "/assets/images/small_white.png" : "/assets/images/small_transparent.png"}
                alt="Rebalance Impact"
                className="h-10 w-auto rounded-md transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = isScrolled
                    ? 'https://placehold.co/40x40/FFFFFF/334C33?text=R'
                    : 'https://placehold.co/40x40/334C33/FFFFFF?text=R';
                }}
              />
              <span
                className={`
                  text-xl md:text-2xl font-display font-normal
                  transition-colors duration-300
                  ${isScrolled ? 'text-white' : 'text-forest-deep'}
                `}
              >
                Rebalance Impact
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
              {mainNavLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.children ? (
                    // Dropdown menu item
                    <>
                      <button
                        onClick={() => handleDropdownToggle(link.label)}
                        className={`
                          relative font-sans font-medium text-base
                          transition-colors duration-300 flex items-center gap-1
                          ${isScrolled ? 'hover:text-sand-light' : 'hover:text-forest'}
                          ${
                            isActive(link.href) || link.children.some(child => isActive(child.href))
                              ? isScrolled ? 'text-sand-light' : 'text-forest'
                              : isScrolled ? 'text-white/90' : 'text-charcoal'
                          }
                        `}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-sage/20 overflow-hidden"
                          >
                            <Link
                              to={link.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`
                                block px-4 py-3 text-sm font-medium transition-colors
                                ${isActive(link.href) ? 'bg-forest/10 text-forest' : 'text-charcoal hover:bg-sand-light'}
                              `}
                            >
                              {link.label} Overview
                            </Link>
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className={`
                                  block px-4 py-3 text-sm font-medium transition-colors
                                  ${isActive(child.href) ? 'bg-forest/10 text-forest' : 'text-charcoal hover:bg-sand-light'}
                                `}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Active indicator */}
                      {(isActive(link.href) || link.children.some(child => isActive(child.href))) && (
                        <motion.span
                          layoutId="activeNav"
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isScrolled ? 'bg-sand-light' : 'bg-accent'}`}
                        />
                      )}
                    </>
                  ) : (
                    // Regular menu item
                    <Link
                      to={link.href}
                      className={`
                        relative font-sans font-medium text-base
                        transition-colors duration-300
                        ${isScrolled ? 'hover:text-sand-light' : 'hover:text-forest'}
                        ${
                          isActive(link.href)
                            ? isScrolled ? 'text-sand-light' : 'text-forest'
                            : isScrolled ? 'text-white/90' : 'text-charcoal'
                        }
                      `}
                    >
                      {link.label}
                      {/* Active indicator */}
                      {isActive(link.href) && (
                        <motion.span
                          layoutId="activeNav"
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isScrolled ? 'bg-sand-light' : 'bg-accent'}`}
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
              <Button
                href={ctaLink.href}
                variant="primary"
                size="small"
              >
                {ctaLink.label}
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 -mr-2 transition-colors ${isScrolled ? 'text-white hover:text-sand-light' : 'text-forest-deep hover:text-forest'}`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </Container>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
