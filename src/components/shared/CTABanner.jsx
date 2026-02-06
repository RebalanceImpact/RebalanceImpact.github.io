import { motion } from 'framer-motion';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { variants, transitions } from '../../config/motion';

/**
 * CTABanner component - Call-to-action strip
 */
const CTABanner = ({
  title = "Ready to start your ESG journey?",
  subtitle,
  ctaText = "Get a Quote",
  ctaHref = "/#contact-and-quote",
  variant = 'accent',
}) => {
  const backgrounds = {
    accent: 'bg-accent',
    forest: 'bg-forest-deep',
    gradient: 'bg-gradient-to-r from-forest-deep to-forest',
  };

  return (
    <section className={`relative overflow-hidden ${backgrounds[variant]} py-16 md:py-20`}>
      {/* Diagonal clip path decoration */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-cream transform -skew-y-1 origin-left" />

      <Container>
        <motion.div
          variants={variants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <motion.h2
            variants={variants.fadeUp}
            transition={transitions.default}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-white"
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              variants={variants.fadeUp}
              transition={transitions.default}
              className="mt-4 text-white/80 text-lg max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            variants={variants.fadeUp}
            transition={transitions.default}
            className="mt-8"
          >
            <Button
              href={ctaHref}
              variant={variant === 'accent' ? 'secondary' : 'primary'}
              size="large"
            >
              {ctaText}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTABanner;
