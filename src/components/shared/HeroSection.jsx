import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { variants, transitions } from '../../config/motion';

/**
 * HeroSection component - Reusable hero with variants
 * Variants: 'home' (full height), 'inner' (shorter, with breadcrumb)
 */
const HeroSection = ({
  variant = 'inner',
  title,
  subtitle,
  ctaText,
  ctaHref,
  breadcrumb,
  backgroundClass = 'bg-forest-deep',
  children,
}) => {
  const isHome = variant === 'home';

  return (
    <section
      className={`
        relative overflow-hidden
        ${isHome ? 'min-h-[90vh]' : 'min-h-[40vh] md:min-h-[45vh]'}
        ${backgroundClass}
        noise-overlay
      `}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/90 via-forest/80 to-forest-light/70" />

      {/* Content */}
      <Container
        className={`
          relative z-10
          flex flex-col justify-center
          ${isHome ? 'min-h-[90vh] pt-24' : 'min-h-[40vh] md:min-h-[45vh] pt-32 pb-12'}
        `}
      >
        {/* Breadcrumb for inner pages */}
        {!isHome && breadcrumb && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6"
          >
            <ol className="flex items-center gap-2 text-sand-light/80 text-sm">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 opacity-50" />
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* Title */}
        <motion.h1
          variants={variants.fadeUp}
          initial="hidden"
          animate="visible"
          transition={transitions.default}
          className={`
            font-display text-white leading-tight
            ${isHome ? 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl' : 'text-3xl md:text-4xl lg:text-5xl'}
            ${isHome ? 'max-w-4xl' : 'max-w-3xl'}
          `}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            variants={variants.fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.default, delay: 0.1 }}
            className={`
              mt-6 text-sand-light/90 font-sans leading-relaxed
              ${isHome ? 'text-lg md:text-xl max-w-2xl' : 'text-base md:text-lg max-w-2xl'}
            `}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA Button */}
        {ctaText && ctaHref && (
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.default, delay: 0.2 }}
            className="mt-8"
          >
            <Button href={ctaHref} variant="primary" size={isHome ? 'large' : 'default'}>
              {ctaText}
            </Button>
          </motion.div>
        )}

        {/* Custom children content */}
        {children}
      </Container>

      {/* Decorative bottom curve */}
      {isHome && (
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z"
              fill="currentColor"
              className="text-cream"
            />
          </svg>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
