import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card, Button } from '../components/ui';
import { HeroSection, CTABanner } from '../components/shared';
import SchemaMarkup, { esgServicesSchema, professionalServiceSchema, generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';
import { coreServices } from '../data/services';

// ESG Services page schemas
const servicesBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com' },
  { name: 'ESG Services', url: 'https://www.rebalanceimpact.com/esg-services' }
]);

const servicesPageSchema = generateWebPageSchema({
  name: 'ESG Consulting Services | Rebalance Impact',
  description: 'Comprehensive ESG consulting services including sustainability reporting, climate risk assessment, ESG data analytics, and stakeholder engagement.',
  url: 'https://www.rebalanceimpact.com/esg-services',
  breadcrumb: servicesBreadcrumb
});

const ESGServicesPage = () => {
  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.esgServices.title}
        description={pageMetadata.esgServices.description}
        canonicalPath="/esg-services"
      />
      <SchemaMarkup schemas={[esgServicesSchema, professionalServiceSchema, servicesPageSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="Enhance Your ESG Journey"
        subtitle="Comprehensive consulting services that transform sustainability challenges into business opportunities."
        breadcrumb={[{ label: 'Core Services' }]}
      />

      {/* Core Services Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Our Services"
            title="What We Offer"
            subtitle="Expert guidance across all aspects of ESG strategy, reporting, and implementation."
            className="mb-16"
          />

          <div className="space-y-16">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 !== 0 ? 'lg:order-2' : ''}>
                  <span className="inline-block font-display text-5xl text-sage/40 mb-4">
                    0{service.id}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-forest-deep mb-4">
                    {service.title}
                  </h3>
                  <p className="text-charcoal-light text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Replace the old <Card> block with this: */}
                <motion.div 
                  className={`relative h-64 md:h-[400px] overflow-hidden rounded-2xl bg-sage/10 ${
                    index % 2 !== 0 ? 'lg:order-1' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src={service.image} 
                    alt={`${service.title} - Rebalance Impact ESG Services`}
                    className="w-full h-full object-cover shadow-xl"
                    loading="lazy"
                  />
                  {/* A subtle overlay to ensure the brand's 'forest' tones feel integrated */}
                  <div className="absolute inset-0 bg-forest-deep/5 mix-blend-multiply pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="Our Process"
            title="How We Work"
            subtitle="A structured approach to delivering measurable ESG outcomes."
            className="mb-16"
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-sage/30 -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, title: 'Discovery', description: 'Understanding your business, challenges, and ESG goals.' },
                { step: 2, title: 'Assessment', description: 'Analyzing current state and identifying opportunities.' },
                { step: 3, title: 'Strategy', description: 'Developing tailored roadmaps aligned with your objectives.' },
                { step: 4, title: 'Implementation', description: 'Executing plans with ongoing support and monitoring.' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-forest text-white font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                    {item.step}
                  </div>
                  <Card variant="default" padding="default" className="text-center">
                    <h4 className="font-sans font-bold text-lg text-forest-deep mb-2">
                      {item.title}
                    </h4>
                    <p className="text-charcoal-light text-sm">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={variants.fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={transitions.default}
            >
              <SectionHeading
                label="Why Rebalance Impact"
                title="The Difference We Make"
                align="left"
                animate={false}
              />
              <div className="mt-8 space-y-4">
                {[
                  'Deep expertise across multiple industry sectors',
                  'Chartered Accountants ensuring financial rigor',
                  'Environmental Scientists providing technical depth',
                  'Practical solutions aligned with business goals',
                  'Data-driven approach with measurable outcomes',
                  'Long-term partnership beyond initial engagement',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-charcoal">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <Card variant="filled" padding="large" className="text-center">
              <p className="font-display text-2xl md:text-3xl text-forest-deep leading-relaxed">
                &ldquo;We don&apos;t just advise — we partner with you to achieve lasting impact.&rdquo;
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Ready to elevate your ESG strategy?"
        subtitle="Let's discuss how our services can help your organization."
        ctaText="Get a Quote"
        ctaHref="/#contact-and-quote"
      />
    </PageWrapper>
  );
};

export default ESGServicesPage;
