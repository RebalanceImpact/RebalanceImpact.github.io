import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading } from '../components/ui';
import { HeroSection, ArticleCard } from '../components/shared';
import SchemaMarkup, { generateWebPageSchema, generateBreadcrumbSchema } from '../components/SchemaMarkup';
import { pageMetadata } from '../config/siteMetadata';
import { articleCategories, getArticlesByCategory, getAllArticles } from '../data/esgArticles';
// Pull the original articles directly from Markdown data store
import { getRebalanceArticlesList } from '../data/articleContent';

// News & Media page schemas
const newsMediaBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.rebalanceimpact.com/' },
  { name: 'News & Media', url: 'https://www.rebalanceimpact.com/news-media/' }
]);

const newsMediaPageSchema = generateWebPageSchema({
  name: 'News & Industry Insights | Rebalance Impact',
  description: 'Stay informed with the latest sustainability news, regulatory updates, and success stories from global and South African leaders.',
  url: 'https://www.rebalanceimpact.com/news-media/',
  breadcrumb: newsMediaBreadcrumb
});

// CollectionPage schema for the articles listing
const articlesCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Industry Insights",
  "description": "Curated collection of sustainability news, regulatory updates, and industry analysis.",
  "url": "https://www.rebalanceimpact.com/news-media/",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Rebalance Impact"
  },
  "about": {
    "@type": "Thing",
    "name": "Environmental, Social, and Governance (ESG)"
  }
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <button
        onClick={() => onCategoryChange('all')}
        className={`
          px-4 py-2 rounded-full font-sans font-medium text-sm transition-all
          ${
            activeCategory === 'all'
              ? 'bg-forest text-white'
              : 'bg-white text-charcoal hover:bg-sand-light border border-sage/30'
          }
        `}
      >
        All Articles
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
            px-4 py-2 rounded-full font-sans font-medium text-sm transition-all
            ${
              activeCategory === category
                ? 'bg-forest text-white'
                : 'bg-white text-charcoal hover:bg-sand-light border border-sage/30'
            }
          `}
        >
          {category}
        </button>
      ))}
      {/* Active indicator line */}
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 h-0.5 bg-accent rounded-full"
      />
    </div>
  );
};

const NewsMediaPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const getFilteredArticles = () => {
    if (activeCategory === 'all') {
      return getAllArticles();
    }
    return getArticlesByCategory(activeCategory).map((article) => ({
      ...article,
      category: activeCategory,
    }));
  };

  const filteredArticles = getFilteredArticles();
  const rebalanceArticles = getRebalanceArticlesList();

  return (
    <PageWrapper>
      <SEOHead
        title={pageMetadata.newsMedia.title}
        description={pageMetadata.newsMedia.description}
        canonicalPath="/news-media/"
      />
      <SchemaMarkup schemas={[newsMediaPageSchema, articlesCollectionSchema]} />

      {/* Hero Section */}
      <HeroSection
        variant="inner"
        title="Industry Insights"
        subtitle="Stay informed with the latest news, regulatory updates, and success stories from global and South African leaders."
        breadcrumb={[{ label: 'Industry Insights' }]}
      />

      {/* Rebalance Impact Original Insights Section */}
      {rebalanceArticles && rebalanceArticles.length > 0 && (
        <section className="py-16 bg-white border-b border-sage/20">
          <Container>
            <SectionHeading
              label="Our Perspective"
              title="Insights by Rebalance Impact"
              subtitle="Proprietary research, thought leadership, and strategic analysis from our team of experts."
              className="mb-10"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rebalanceArticles.map((article, index) => (
                <ArticleCard
                  key={`rebalance-${article.title}`}
                  title={article.title}
                  url={article.url}
                  blurb={article.blurb}
                  category="Original Insight"
                  index={index}
                  // Consider passing a special prop like `isFeatured={true}` to style these cards distinctly (e.g., a subtle border or different background)
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Articles Section */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            label="Latest Updates"
            title="Sustainability News & Articles"
            subtitle="Curated insights from industry leaders and regulatory bodies."
            className="mb-12"
          />

          {/* Category Filter */}
          <CategoryFilter
            categories={articleCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Articles Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={`${article.category}-${article.title}`}
                  title={article.title}
                  url={article.url}
                  blurb={article.blurb}
                  category={article.category}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-charcoal-light">
                No articles found in this category.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 md:py-20 bg-sand-light">
        <Container size="narrow">
          <div className="text-center">
            <h3 className="font-display text-2xl md:text-3xl text-forest-deep mb-4">
              Stay Updated
            </h3>
            <p className="text-charcoal-light mb-8">
              Want to receive the latest insights directly? Get in touch to
              discuss how we can keep you informed.
            </p>
            <motion.a
              href="/#contact-and-quote"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
            >
              Contact Us
            </motion.a>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default NewsMediaPage;
