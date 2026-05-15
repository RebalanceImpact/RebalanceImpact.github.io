import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card } from '../components/ui';
import { HeroSection, CTABanner } from '../components/shared';
import SchemaMarkup, { organizationSchema, generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import VennDiagram from '../components/page-specific/about/VennDiagram';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';
import { teamExperience } from '../data/team';
import { motion } from 'framer-motion';

// About page schemas
const aboutBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com' },
  { name: 'About Us', url: 'https://www.rebalanceimpact.com/about-us/' }
]);

const aboutPageSchema = generateWebPageSchema({
  name: 'About Rebalance Impact | Sustainability Consulting Experts',
  description: 'Learn about Rebalance Impact - where financial expertise meets environmental science. Our team of Chartered Accountants and Environmental Scientists deliver practical integrated solutions.',
  url: 'https://www.rebalanceimpact.com/about-us/',
  breadcrumb: aboutBreadcrumb
});

const AboutPage = () => {
  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.about.title}
        description={pageMetadata.about.description}
        canonicalPath="/about-us/"
      />
      <SchemaMarkup schemas={[organizationSchema, aboutPageSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="About Rebalance Impact"
        subtitle="Where financial expertise meets environmental science."
        breadcrumb={[{ label: 'About Us' }]}
      />

      {/* Mission Statement */}
      <section className="py-20 md:py-28 bg-cream">
        <Container size="narrow">
          <motion.blockquote
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transitions.default}
            className="text-center"
          >
            <p className="font-display text-3xl md:text-4xl lg:text-5xl text-forest-deep leading-tight">
              &ldquo;Delivering practical sustainable solutions that connect technical insights with strategic business goals.&rdquo;
            </p>
          </motion.blockquote>
        </Container>
      </section>

      {/* Our Experience Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="Our Expertise"
            title={teamExperience.headline}
            subtitle={teamExperience.description}
            className="mb-16"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              variants={variants.fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={transitions.default}
              className="space-y-8"
            >
              {teamExperience.pillars.map((pillar, index) => (
                <Card
                  key={pillar.id}
                  variant="default"
                  padding="default"
                  className="border-l-4 border-forest"
                >
                  <h3 className="font-sans font-bold text-xl text-forest-deep mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-charcoal-light leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </motion.div>

            {/* Venn Diagram */}
            <VennDiagram />
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Our Approach"
            title="Built on Strong Foundations"
            subtitle="Our unique combination of skills ensures comprehensive, practical, sustainable and financially sound solutions."
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Chartered Accountants',
                description: 'Bringing financial rigor, reporting expertise, and investor communication skills to sustainability initiatives.',
              },
              {
                title: 'Environmental Scientists',
                description: 'Providing technical depth in climate research, climate modeling, emissions accounting, and sustainability impact analysis.',
              },
              {
                title: 'Industry Specialists',
                description: 'Deep sector knowledge across mining, financial services, manufacturing, retail, and technology.',
              },
              {
                title: 'Data Analysts',
                description: 'Transforming complex data into clear, actionable insights through advanced analytics.',
              },
              {
                title: 'Strategy Consultants',
                description: 'Aligning sustainability initiatives with business strategy for sustainable competitive advantage.',
              },
              {
                title: 'Compliance Experts',
                description: 'Navigating regulatory requirements and ensuring adherence to reporting standards.',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  variant="default"
                  padding="default"
                  hover
                  className="h-full"
                >
                  <div className="w-full h-1 bg-gradient-to-r from-forest to-accent mb-4 rounded-full" />
                  <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">
                    {member.title}
                  </h3>
                  <p className="text-charcoal-light text-sm leading-relaxed">
                    {member.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Let's work together"
        subtitle="Partner with our expert team to achieve your sustainability and financial goals."
        ctaText="Get in Touch"
        ctaHref="/#contact-and-quote"
        variant="forest"
      />
    </PageWrapper>
  );
};

export default AboutPage;
