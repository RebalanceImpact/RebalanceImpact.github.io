import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container } from '../components/ui';
import SchemaMarkup from '../components/SchemaMarkup';
import { getArticleBySlug } from '../data/articleContent';

const ArticlePage = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/news-media" replace />;
  }

  // Generate dynamic schema for the active article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Organization",
      "name": article.author
    },
    "datePublished": article.datePublished,
    "description": article.blurb,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.rebalanceimpact.com/insights/${slug}`
    }
  };

  return (
    <PageWrapper>
      <SEOHead
        title={`${article.title} | Rebalance Impact`}
        description={article.blurb}
        canonicalPath={`/insights/${slug}`}
      />
      <SchemaMarkup schemas={[articleSchema]} />

      <header className="bg-forest-deep text-white pt-32 pb-20 px-6">
        <Container size="narrow">
          <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-4">
            {article.category}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center text-sm text-sand-light gap-4">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.datePublished).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </Container>
      </header>

      <section className="py-16 bg-cream text-charcoal font-sans leading-relaxed">
        <Container size="narrow">
          {/* The prose class triggers Tailwind Typography to style the markdown */}
          <div className="
            prose prose-lg max-w-none mb-20
            /* Targeting Subheadings explicitly */
            prose-headings:font-display 
            prose-h2:text-sandstone 
            prose-h3:text-sandstone
            /* Forcing Link Visibility */
            prose-a:text-forest 
            prose-a:font-bold 
            prose-a:underline 
            prose-a:decoration-accent
            hover:prose-a:text-accent
            /* Blockquote styling */
            prose-blockquote:border-l-accent 
            prose-blockquote:bg-white 
            prose-blockquote:p-4 
            prose-blockquote:rounded-r
          ">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default ArticlePage;