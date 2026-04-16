import { motion } from 'framer-motion';
import { FileCheck, Shield, Globe, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card, Button } from '../components/ui';
import { HeroSection, CTABanner } from '../components/shared';
import SchemaMarkup, { generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';

// Sustainable Reporting page schemas
const sustainableReportingBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com' },
  { name: 'Sustainable Reporting', url: 'https://www.rebalanceimpact.com/sustainable-reporting' }
]);

const sustainableReportingPageSchema = generateWebPageSchema({
  name: 'Sustainable Reporting Services | Rebalance Impact',
  description: 'Expert guidance on sustainability reporting frameworks including GRI, SASB, TCFD, ISSB, and CDP. Create impactful integrated reports that meet compliance requirements.',
  url: 'https://www.rebalanceimpact.com/sustainable-reporting',
  breadcrumb: sustainableReportingBreadcrumb
});

// HowTo schema for sustainability reporting
const sustainabilityReportingHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create a Sustainability Report",
  "description": "A structured approach to developing comprehensive integrated reports that meet stakeholder expectations and regulatory requirements.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Framework Selection",
      "text": "Choose the appropriate reporting frameworks (GRI, SASB, ISSB, etc.) based on your industry, stakeholders, and regulatory requirements."
    },
    {
      "@type": "HowToStep",
      "name": "Materiality Assessment",
      "text": "Identify the topics most relevant to your organization and stakeholders through a structured materiality assessment."
    },
    {
      "@type": "HowToStep",
      "name": "Data Collection",
      "text": "Gather quantitative and qualitative data across environmental, social, and governance dimensions with quality assurance measures."
    },
    {
      "@type": "HowToStep",
      "name": "Report Development",
      "text": "Structure and write the report content, ensuring compliance with chosen frameworks while telling a compelling sustainability story."
    },
    {
      "@type": "HowToStep",
      "name": "Stakeholder Review",
      "text": "Engage key stakeholders in reviewing the report for accuracy, completeness, and alignment with expectations."
    },
    {
      "@type": "HowToStep",
      "name": "Assurance & Publication",
      "text": "Obtain third-party assurance if required and publish the report through appropriate channels."
    }
  ]
};

const SustainableReportingPage = () => {
  const frameworks = [
    {
      name: 'GRI',
      fullName: 'Global Reporting Initiative',
      description: 'The most widely used sustainability reporting standards globally.',
    },
    {
      name: 'ISSB',
      fullName: 'International Sustainability Standards Board',
      description: 'IFRS S1 and S2 - New global baseline for sustainability disclosures.',
    },
    {
      name: 'SASB',
      fullName: 'Sustainability Accounting Standards Board',
      description: 'Industry-specific standards focused on financial materiality.',
    },
    {
      name: 'TCFD',
      fullName: 'Task Force on Climate-related Financial Disclosures',
      description: 'Climate-related financial risk disclosures. Now integrated into ISSB standards.',
    },
    {
      name: 'CSRD',
      fullName: 'Corporate Sustainability Reporting Directive',
      description: 'EU directive requiring comprehensive sustainability reporting from companies.',
    },
    {
      name: 'CSDDD',
      fullName: 'Corporate Sustainability Due Diligence Directive',
      description: 'EU directive on environmental and human rights due diligence.',
    },
    {
      name: 'OECD',
      fullName: 'OECD Guidelines for Multinational Enterprises',
      description: 'International standards for responsible business conduct.',
    },
    {
      name: 'CDP',
      fullName: 'Carbon Disclosure Project',
      description: 'Environmental disclosure system for companies and cities.',
    },
    {
      name: 'UN SDGs',
      fullName: 'UN Sustainable Development Goals',
      description: 'Framework for aligning business impact with global goals.',
    },
  ];

  const reportingBenefits = [
    {
      icon: TrendingUp,
      title: 'Investor Confidence',
      description: 'Build trust with investors through transparent, standardized reporting.',
    },
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Identify and address risks before they impact your business.',
    },
    {
      icon: Globe,
      title: 'Regulatory Compliance',
      description: 'Stay ahead of evolving disclosure requirements across jurisdictions.',
    },
    {
      icon: FileCheck,
      title: 'Stakeholder Trust',
      description: 'Demonstrate commitment to sustainability through credible reporting.',
    },
  ];

  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.sustainableReporting.title}
        description={pageMetadata.sustainableReporting.description}
        canonicalPath="/sustainable-reporting"
      />
      <SchemaMarkup schemas={[sustainableReportingPageSchema, sustainabilityReportingHowToSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="Sustainable Reporting"
        subtitle="Expert guidance on sustainability reporting practices, frameworks, and compliance requirements."
        breadcrumb={[{ label: 'Sustainable Reporting' }]}
      />

      {/* Introduction Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container size="narrow">
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transitions.default}
          >
            <blockquote className="text-center mb-12">
              <p className="font-display text-2xl md:text-3xl text-forest-deep leading-relaxed">
                &ldquo;Sustainability reporting is not just about compliance — it&apos;s about communicating your organization&apos;s values, impact, and vision for the future.&rdquo;
              </p>
            </blockquote>

            <div className="prose prose-lg max-w-none text-charcoal-light">
              <p>
                Effective sustainability reporting goes beyond ticking boxes. It requires understanding
                which frameworks apply to your organization, what information your stakeholders need,
                and how to present complex data in a meaningful way.
              </p>
              <p>
                Our team of Chartered Accountants and Environmental Scientists brings the unique
                combination of financial rigor and technical expertise needed to produce reports
                that are both compliant and compelling.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="The Value"
            title="Why Sustainable Reporting Matters"
            className="mb-16"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reportingBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="default" padding="large" hover className="h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-charcoal-light text-sm">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Frameworks Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Key Frameworks"
            title="Reporting Standards We Work With"
            subtitle="We help organizations navigate the complex landscape of sustainability reporting frameworks."
            className="mb-16"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map((framework, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card variant="outlined" padding="default" hover className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <span className="font-sans font-bold text-lg text-forest">
                      {framework.name}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal mb-2">
                    {framework.fullName}
                  </p>
                  <p className="text-charcoal-light text-sm">
                    {framework.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 md:py-28 bg-forest-deep text-white relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <Container className="relative z-10">
          <SectionHeading
            label="Our Approach"
            title="How We Help"
            theme="dark"
            className="mb-16"
          />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                'Framework selection and materiality assessment',
                'Data collection and quality assurance',
                'Report structure and content development',
                'Stakeholder engagement and communication',
                'Third-party assurance preparation',
                'Continuous improvement and benchmarking',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 rounded-xl p-8 backdrop-blur-sm"
            >
              <p className="font-display text-2xl leading-relaxed mb-6">
                &ldquo;Reports that inform, engage, and inspire action.&rdquo;
              </p>
              <p className="text-sand-light/80">
                We don&apos;t just help you comply — we help you communicate your
                sustainability journey in a way that resonates with stakeholders
                and drives real change.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Ready to elevate your reporting?"
        subtitle="Let's discuss how we can help you create impactful sustainability reports."
        ctaText="Get Started"
        ctaHref="/#contact-and-quote"
        variant="accent"
      />
    </PageWrapper>
  );
};

export default SustainableReportingPage;
