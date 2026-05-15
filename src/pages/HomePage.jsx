import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, Button, SectionHeading, Card } from '../components/ui';
import { ContactForm, StatCounter, ServiceCard, CTABanner } from '../components/shared';
import SchemaMarkup, { organizationSchema, websiteSchema, generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';
import { heroSlides } from '../data/heroSlides';
import { services } from '../data/services';
import { stats } from '../data/kpis';
import { articles } from '../data/articleContent';
// Home page schemas
const homePageBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com/' }
]);

const homePageSchema = generateWebPageSchema({
  name: 'Rebalance Impact | Sustainability Consulting & Integrated Solutions',
  description: 'Expert consulting services combining financial expertise, climate research, and ESG data to deliver practical integrated solutions for businesses.',
  url: 'https://www.rebalanceimpact.com/',
  breadcrumb: homePageBreadcrumb
});

// Hero Carousel Component
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative min-h-[90vh] bg-forest-deep overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest to-forest-light opacity-90" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center"
        >
          <Container className="relative z-10 pt-24">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-4xl"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-sand-light/90 max-w-2xl"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8"
            >
              <Button
                href={heroSlides[currentSlide].ctaHref}
                variant="primary"
                size="large"
                icon={ArrowRight}
              >
                {heroSlides[currentSlide].ctaText}
              </Button>
            </motion.div>
          </Container>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
          key={`progress-${currentSlide}-${isPaused}`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

// Updated: FeaturedInsightSection
// Added `articles` and `featuredSlug` as props to allow manual overrides.
const FeaturedInsightSection = ({ articles = [], featuredSlug = null }) => {
  // 1. Check for a manually featured article first
  const manuallyFeatured = featuredSlug 
    ? articles.find((a) => a.slug === featuredSlug) 
    : null;

  // 2. Sort articles by date (newest first) for the fallback
  const latestArticle = [...articles].sort(
    (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
  )[0];

  // 3. Determine which article to display
  const displayArticle = manuallyFeatured || latestArticle;

  // Render nothing if no articles exist
  if (!displayArticle) return null;

  return (
    <section className="py-12 bg-cream border-b border-forest/10">
      <Container>
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-forest/10 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          {/* Decorative left accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-forest" />
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-forest/10 text-forest font-semibold text-xs rounded-full tracking-wider uppercase">
                {manuallyFeatured ? 'Featured Insight' : 'Latest Insight'}
              </span>
              <span className="text-charcoal-light text-sm font-medium">
                {new Date(displayArticle.datePublished).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-forest-deep mb-3 leading-tight">
              {displayArticle.title}
            </h2>
            <p className="text-charcoal-light leading-relaxed max-w-3xl">
              {displayArticle.blurb}
            </p>
          </div>
          
          <div className="shrink-0 lg:mt-0 mt-4">
            <Button
              href={`/insights/${displayArticle.slug}`}
              variant="primary"
              icon={ArrowRight}
            >
              Read Article
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// Value Props Section
const ValueProps = () => {
  const props = [
    {
      number: '01',
      title: 'Expert Team',
      description: 'Chartered Accountants and Environmental Scientists bringing both financial rigor and climate expertise.',
    },
    {
      number: '02',
      title: 'Practical Solutions',
      description: 'We bridge technical insights with strategic business goals to deliver actionable, sustainable strategies.',
    },
    {
      number: '03',
      title: 'Data-Driven',
      description: 'Transform your financial and non-financial data into compelling insights with our analytics and visualization capabilities.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-cream">
      <Container>
        <motion.div
          variants={variants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {props.map((prop, index) => (
            <motion.div
              key={index}
              variants={variants.fadeUp}
              transition={{ ...transitions.default, delay: index * 0.1 }}
              className="group"
            >
              <span className="block font-display text-6xl md:text-7xl text-sage/30 mb-4 group-hover:text-accent/40 transition-colors">
                {prop.number}
              </span>
              <h3 className="font-sans font-bold text-xl text-forest-deep mb-3">
                {prop.title}
              </h3>
              <p className="text-charcoal-light leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

// Services Preview Section
const ServicesPreview = () => {
  const previewServices = services.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-sand-light">
      <Container>
        <SectionHeading
          label="What We Do"
          title="Our Services"
          subtitle="Comprehensive integrated consulting services tailored to your business needs."
          className="mb-16"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {previewServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              index={index}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/esg-services" variant="outline">
            View All Services
          </Button>
        </div>
      </Container>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-forest-deep relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              theme="dark"
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section id="contact-and-quote" className="py-20 md:py-28 bg-cream scroll-mt-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Info */}
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transitions.default}
          >
            <SectionHeading
              label="Get in Touch"
              title="Start Your Journey"
              subtitle="Ready to transform your business approach? Let's discuss how we can help your organization leverage its financial and non-financial data for a robust long-term strategy."
              align="left"
              animate={false}
            />
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-forest/10 rounded-lg">
                  <Mail className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-deep">Email Us</h4>
                  <a
                    href="mailto:info@rebalanceimpact.com"
                    className="text-charcoal-light hover:text-accent transition-colors"
                  >
                    info@rebalanceimpact.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-forest/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-deep">Location</h4>
                  <p className="text-charcoal-light">South Africa</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <Card variant="default" padding="large">
            <h3 className="font-sans font-bold text-xl text-forest-deep mb-6">
              Request a Quote
            </h3>
            <ContactForm />
          </Card>
        </div>
      </Container>
    </section>
  );
};

// Main HomePage Component
const HomePage = () => {
  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.home.title}
        description={pageMetadata.home.description}
        canonicalPath="/"
      />
      <SchemaMarkup schemas={[organizationSchema, websiteSchema, homePageSchema]} />
      <HeroCarousel />
      <FeaturedInsightSection articles={articles} featuredSlug="private-non-listed-companies-and-ISSB" />
      <ValueProps />
      <ServicesPreview />
      <StatsSection />
      <CTABanner
        title={
          <>
            Ready to make an <span className="text-forest">Impact?</span>
          </>
        }
        subtitle="Partner with us to build business practices that drive real results."
        ctaText="Get Started"
        ctaHref="/#contact-and-quote"
      />
      <ContactSection />
    </PageWrapper>
  );
};

export default HomePage;
