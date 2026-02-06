import { motion } from 'framer-motion';
import { Database, Target, LineChart, Users } from 'lucide-react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card } from '../components/ui';
import { HeroSection, StatCounter, CTABanner } from '../components/shared';
import SchemaMarkup, { generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import PowerBIEmbed from '../components/page-specific/data-kpis/PowerBIEmbed';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';
import { dataProcess, powerBIConfig } from '../data/kpis';

// Data KPIs page schemas
const dataKPIsBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com' },
  { name: 'Data & KPIs', url: 'https://www.rebalanceimpact.com/data-kpis' }
]);

const dataKPIsPageSchema = generateWebPageSchema({
  name: 'ESG Data Solutions & KPI Dashboards | Rebalance Impact',
  description: 'Transform your ESG data into actionable insights with our comprehensive data management, analytics, and interactive Power BI dashboards.',
  url: 'https://www.rebalanceimpact.com/data-kpis',
  breadcrumb: dataKPIsBreadcrumb
});

// Software Application schema for the dashboard
const dashboardSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rebalance Impact ESG Dashboard",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "Interactive ESG performance dashboard built on Power BI for monitoring and visualizing sustainability metrics.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "Rebalance Impact"
  }
};

const DataKPIsPage = () => {
  const processIcons = [Database, Target, LineChart, Users];

  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.dataKpis.title}
        description={pageMetadata.dataKpis.description}
        canonicalPath="/data-kpis"
      />
      <SchemaMarkup schemas={[dataKPIsPageSchema, dashboardSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="Data Solutions"
        subtitle="Transform your ESG data into actionable insights with our comprehensive data management and analytics capabilities."
        breadcrumb={[{ label: 'Data Solutions' }]}
      />

      {/* Intro Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container size="narrow">
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transitions.default}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-charcoal leading-relaxed">
              {powerBIConfig.description}{' '}
              <span className="font-bold text-accent">
                Dynamic insights can empower your decisions.
              </span>
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Interactive Dashboard Section */}
      <section className="py-16 md:py-20 bg-sand-light">
        <Container>
          <SectionHeading
            title="Interactive Dashboard Demo"
            subtitle="Click on elements within the dashboard to explore interactions."
            className="mb-10"
          />
          <PowerBIEmbed
            embedUrl={powerBIConfig.embedUrl}
            title={powerBIConfig.title}
          />
        </Container>
      </section>

      {/* Data Process Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Our Methodology"
            title="How We Handle Your Data"
            subtitle="A structured approach to ESG data management that ensures accuracy, transparency, and actionable outcomes."
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {dataProcess.map((step, index) => {
              const Icon = processIcons[index];
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <Card variant="default" padding="large" hover className="h-full">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-xl text-forest-deep mb-3">
                          {step.title}
                        </h3>
                        <p className="text-charcoal-light leading-relaxed">
                          {step.description.split(step.highlight)[0]}
                          <span className="font-semibold text-accent">
                            {step.highlight}
                          </span>
                          {step.description.split(step.highlight)[1]}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* KPI Metrics Section */}
      <section className="py-20 md:py-28 bg-forest-deep relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <Container className="relative z-10">
          <SectionHeading
            label="Impact"
            title="Measurable Results"
            theme="dark"
            className="mb-16"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter value={100} suffix="%" label="Data Accuracy" theme="dark" />
            <StatCounter value={50} suffix="%" label="Time Saved" theme="dark" />
            <StatCounter value={360} suffix="°" label="Visibility" theme="dark" />
            <StatCounter value={24} suffix="/7" label="Access" theme="dark" />
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="Capabilities"
            title="What Our Platform Offers"
            className="mb-16"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Centralized Data Hub',
                description: 'Consolidate ESG data from multiple sources into a single, reliable platform.',
              },
              {
                title: 'Custom Dashboards',
                description: 'Tailored visualizations that highlight the metrics most important to your stakeholders.',
              },
              {
                title: 'Automated Reporting',
                description: 'Generate reports aligned with major frameworks with minimal manual effort.',
              },
              {
                title: 'Target Tracking',
                description: 'Set, monitor, and report on ESG targets with real-time progress updates.',
              },
              {
                title: 'Scenario Modeling',
                description: 'Model the impact of strategic decisions on your ESG and financial KPIs.',
              },
              {
                title: 'Audit Trail',
                description: 'Complete transparency and traceability for all data changes and calculations.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card variant="default" padding="default" className="h-full">
                  <h4 className="font-sans font-bold text-lg text-forest-deep mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-charcoal-light text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="See what your data can tell you"
        subtitle="Let us show you how our data solutions can transform your ESG reporting."
        ctaText="Request a Demo"
        ctaHref="/#contact-and-quote"
      />
    </PageWrapper>
  );
};

export default DataKPIsPage;
