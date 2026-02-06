import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Shield, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card, Button } from '../components/ui';
import { HeroSection, CTABanner } from '../components/shared';
import SchemaMarkup, { newToESGFaqSchema, generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import { pageMetadata } from '../config/siteMetadata';
import { variants, transitions } from '../config/motion';

// New to ESG page schemas
const newToESGBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com' },
  { name: 'New to ESG', url: 'https://www.rebalanceimpact.com/new-to-esg-reporting' }
]);

const newToESGPageSchema = generateWebPageSchema({
  name: 'New to ESG Reporting? | Beginner Guide | Rebalance Impact',
  description: 'Learn the fundamentals of ESG reporting. Understand Environmental, Social, and Governance factors and why they matter for your business.',
  url: 'https://www.rebalanceimpact.com/new-to-esg-reporting',
  breadcrumb: newToESGBreadcrumb
});

// Accordion component for FAQ
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card variant="default" padding="none" className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sand-light/50 transition-colors"
            >
              <span className="font-sans font-semibold text-forest-deep">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-charcoal-light transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? 'auto' : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4 text-charcoal-light leading-relaxed">
                {item.answer}
              </div>
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const NewToESGPage = () => {
  const esgPillars = [
    {
      title: 'Environmental',
      icon: Lightbulb,
      description: 'Climate impact, resource use, pollution, waste management, and biodiversity.',
      examples: ['Carbon emissions', 'Energy efficiency', 'Water usage', 'Waste reduction'],
    },
    {
      title: 'Social',
      icon: Users,
      description: 'Employee relations, diversity, community impact, and human rights.',
      examples: ['Workplace safety', 'Employee wellbeing', 'Community investment', 'Supply chain labor'],
    },
    {
      title: 'Governance',
      icon: Shield,
      description: 'Board structure, ethics, transparency, and risk management.',
      examples: ['Board diversity', 'Executive compensation', 'Anti-corruption', 'Data privacy'],
    },
  ];

  const benefits = [
    {
      title: 'Investor Attraction',
      description: 'ESG-focused funds represent over $40 trillion in assets globally. Strong ESG performance opens doors to capital.',
    },
    {
      title: 'Risk Management',
      description: 'Identify and mitigate environmental and social risks before they become costly problems.',
    },
    {
      title: 'Operational Efficiency',
      description: 'Sustainability initiatives often reduce costs through energy savings and waste reduction.',
    },
    {
      title: 'Talent Attraction',
      description: 'Purpose-driven companies attract and retain top talent, especially among younger generations.',
    },
    {
      title: 'Customer Loyalty',
      description: 'Consumers increasingly prefer brands that align with their values on sustainability.',
    },
    {
      title: 'Regulatory Readiness',
      description: 'Stay ahead of evolving regulations and disclosure requirements across jurisdictions.',
    },
  ];

  const faqItems = [
    {
      question: 'How do I know if my company needs ESG reporting?',
      answer: 'If you have stakeholders asking about sustainability, are seeking investment, operate in regulated industries, or want to future-proof your business, ESG reporting is likely beneficial. Many jurisdictions are also introducing mandatory disclosure requirements.',
    },
    {
      question: 'What frameworks should we use?',
      answer: 'Common frameworks include GRI (Global Reporting Initiative), SASB (Sustainability Accounting Standards Board), TCFD (Task Force on Climate-related Financial Disclosures), and the new ISSB standards. The right choice depends on your industry, stakeholders, and regulatory environment.',
    },
    {
      question: 'How long does it take to implement ESG reporting?',
      answer: 'Initial implementation typically takes 6-12 months, depending on your current data maturity and the scope of reporting. We help streamline this process by focusing on what matters most to your stakeholders.',
    },
    {
      question: 'Is ESG only for large corporations?',
      answer: 'No. While large companies often lead, SMEs are increasingly adopting ESG practices. Many find that even simple sustainability initiatives improve efficiency and attract customers who value responsible business practices.',
    },
  ];

  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.newToEsg.title}
        description={pageMetadata.newToEsg.description}
        canonicalPath="/new-to-esg-reporting"
      />
      <SchemaMarkup schemas={[newToESGFaqSchema, newToESGPageSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="New to ESG Reporting?"
        subtitle="Understanding ESG doesn't have to be complicated. We'll guide you through the fundamentals."
        breadcrumb={[{ label: 'New to ESG' }]}
        backgroundClass="bg-gradient-to-br from-forest-deep via-forest to-sage"
      />

      {/* What is ESG Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container size="narrow">
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transitions.default}
            className="prose prose-lg max-w-none"
          >
            <SectionHeading
              title="What is ESG?"
              subtitle="ESG stands for Environmental, Social, and Governance — three central pillars used to measure the sustainability and ethical impact of an investment or business."
              className="mb-12"
            />
            <p className="text-charcoal-light text-lg leading-relaxed">
              ESG reporting has evolved from a &ldquo;nice-to-have&rdquo; to a business imperative.
              Investors, customers, employees, and regulators increasingly demand transparency
              on how companies manage their environmental footprint, treat their people, and
              govern themselves ethically.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container>
          <SectionHeading
            label="The Pillars"
            title="Understanding E, S, and G"
            className="mb-16"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {esgPillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card variant="default" padding="large" hover className="h-full">
                  <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center mb-6">
                    <pillar.icon className="w-7 h-7 text-forest" />
                  </div>
                  <h3 className="font-display text-2xl text-forest-deep mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-charcoal-light mb-4">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.examples.map((example, i) => (
                      <li key={i} className="text-sm text-charcoal-light flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="The Value"
            title="Why ESG Matters for Your Business"
            subtitle="ESG isn't just about compliance — it's about creating long-term value."
            className="mb-16"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card variant="outlined" padding="default" className="h-full">
                  <TrendingUp className="w-6 h-6 text-accent mb-4" />
                  <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-charcoal-light text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-sand-light">
        <Container size="narrow">
          <SectionHeading
            label="Common Questions"
            title="ESG FAQ"
            subtitle="Answers to questions we hear most often from organizations starting their ESG journey."
            className="mb-12"
          />
          <Accordion items={faqItems} />
        </Container>
      </section>

      {/* Next Steps CTA */}
      <CTABanner
        title="Ready to take the first step?"
        subtitle="Let us help you understand what ESG means for your specific business."
        ctaText="Talk to an Expert"
        ctaHref="/#contact-and-quote"
        variant="gradient"
      />
    </PageWrapper>
  );
};

export default NewToESGPage;
