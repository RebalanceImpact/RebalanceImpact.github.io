import {
  Database, Target, LineChart, Users, Workflow, ArrowRight,
  Zap, Truck, Landmark, ScanText, Receipt, PackageCheck, BellRing,
} from 'lucide-react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card } from '../components/ui';
import { HeroSection, CTABanner } from '../components/shared';
import SchemaMarkup, { generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import DemoDashboard from '../components/page-specific/data-kpis/DemoDashboard';
import SectionNav from '../components/page-specific/data-kpis/SectionNav';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';
import { dataProcess, dataServices, automationTasks, capabilities } from '../data/kpis';
import { motion } from 'framer-motion';

// Data KPIs page schemas
const dataKPIsBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com/' },
  { name: 'Data & KPIs', url: 'https://www.rebalanceimpact.com/data-kpis/' }
]);

const dataKPIsPageSchema = generateWebPageSchema({
  name: 'Data Solutions | Rebalance Impact',
  description: 'Transform your data into actionable insights with comprehensive data management, analytics, interactive dashboards and automation.',
  url: 'https://www.rebalanceimpact.com/data-kpis/',
  breadcrumb: dataKPIsBreadcrumb
});

// "On this page" groups for the section bar
const pageSections = [
  {
    id: 'data-group',
    label: 'Data & Insights',
    children: [
      { id: 'dashboard', label: 'Interactive Dashboard' },
      { id: 'methodology', label: 'How We Handle Your Data' },
    ],
  },
  {
    id: 'automation-group',
    label: 'Automation',
    children: [
      { id: 'automation', label: 'What We Automate' },
      { id: 'capabilities', label: 'Platform Capabilities' },
    ],
  },
];

// Software Application schema for the dashboard
const dashboardSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rebalance Impact Dashboard",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "Interactive performance dashboards for monitoring sustainability, health and safety, climate-related financial metrics and day-to-day business performance.",
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
  const serviceIcons = [LineChart, Workflow];
  const taskIcons = [Zap, Truck, Landmark, ScanText, Receipt, PackageCheck, BellRing];

  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.dataKpis.title}
        description={pageMetadata.dataKpis.description}
        canonicalPath="/data-kpis/"
      />
      <SchemaMarkup schemas={[dataKPIsPageSchema, dashboardSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="Data Solutions"
        subtitle="Transform your data into actionable insights, and free up your team's time, with our data management, analytics and automation capabilities."
        breadcrumb={[{ label: 'Data Solutions' }]}
      />

      {/* Page contents: grouped links on large screens, dropdown on smaller screens */}
      <SectionNav sections={pageSections} />

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
              We bring your financial and non-financial data together in one place, monitor it through
              interactive dashboards, and automate the routine work around it.{' '}
              <span className="font-bold text-accent">
                Dynamic insights can empower decisions.
              </span>
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {dataServices.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <motion.a
                  key={service.id}
                  href={service.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group block rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">{service.title}</h3>
                  <p className="text-charcoal-light text-sm leading-relaxed mb-4">{service.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:text-accent-hover">
                    Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Interactive Dashboard Section */}
      <section id="dashboard" className="scroll-mt-32 py-20 md:py-28 bg-sand-light">
        <Container size="wide">
          <SectionHeading
            label="Data & Insights"
            title="Interactive Dashboard Demo"
            subtitle="Click on elements within the dashboard to explore interactions."
            className="mb-10"
          />
          <DemoDashboard />
          <p className="mt-8 max-w-3xl mx-auto text-center text-charcoal-light leading-relaxed">
            These dashboards are examples. Every solution we build is tailored to what you want to see and the
            measures that matter most to your business.
          </p>
        </Container>
      </section>

      {/* Data Process Section */}
      <section id="methodology" className="scroll-mt-32 py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Our Methodology"
            title="How We Handle Your Data"
            subtitle="A structured approach to data management and analysis that ensures accuracy, transparency, and actionable outcomes from our insights."
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

      {/* Automation Section */}
      <section id="automation" className="scroll-mt-32 py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="Automation"
            title="Less Time on Routine Work"
            subtitle="Data capture, reconciliations and reporting can take days every month. We automate these repetitive tasks so your team can focus on what matters."
            className="mb-16"
          />

          {/* Flex rather than grid so a part-filled last row sits centred */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {automationTasks.map((task, index) => {
              const Icon = taskIcons[index];
              return (
                <motion.div
                  key={task.id}
                  className="w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
                >
                  <Card variant="default" padding="default" hover className="h-full">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-forest" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">
                      {task.title}
                    </h3>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                      {task.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="capabilities" className="scroll-mt-32 py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Capabilities"
            title="What Our Platform Offers"
            className="mb-16"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((feature, index) => (
              <motion.div
                key={feature.title}
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
        subtitle="Let us show you how our data solutions can transform your reporting."
        ctaText="Request a Demo"
        ctaHref="/#contact-and-quote"
      />
    </PageWrapper>
  );
};

export default DataKPIsPage;
