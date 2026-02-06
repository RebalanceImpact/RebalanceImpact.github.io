import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, Button } from '../components/ui';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <SEOHead
        title="Page Not Found | Rebalance Impact"
        description="The page you're looking for doesn't exist."
        noIndex
      />

      <section className="min-h-[70vh] flex items-center justify-center bg-cream py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Number */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="block font-display text-8xl md:text-9xl text-sage/30 mb-6"
            >
              404
            </motion.span>

            {/* Heading */}
            <h1 className="font-display text-3xl md:text-4xl text-forest-deep mb-4">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="text-charcoal-light text-lg mb-10 max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                icon={ArrowLeft}
                iconPosition="left"
              >
                Go Back
              </Button>
              <Button href="/" variant="primary" icon={Home} iconPosition="left">
                Return Home
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-16 pt-8 border-t border-sage/30">
              <p className="text-charcoal-light text-sm mb-4">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/esg-services"
                  className="text-forest hover:text-accent transition-colors text-sm"
                >
                  Our Services
                </Link>
                <Link
                  to="/about-us"
                  className="text-forest hover:text-accent transition-colors text-sm"
                >
                  About Us
                </Link>
                <Link
                  to="/news-media"
                  className="text-forest hover:text-accent transition-colors text-sm"
                >
                  Industry Insights
                </Link>
                <Link
                  to="/#contact-and-quote"
                  className="text-forest hover:text-accent transition-colors text-sm"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default NotFoundPage;
