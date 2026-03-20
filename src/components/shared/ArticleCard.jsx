import { motion } from 'framer-motion';
// Added ArrowRight for internal links
import { ExternalLink, ArrowRight } from 'lucide-react'; 
// Added Link for internal SPA routing
import { Link } from 'react-router-dom'; 
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * ArticleCard component - News/article preview card
 */
const ArticleCard = ({
  title,
  url,
  blurb,
  category,
  index = 0,
}) => {
  // Check if the URL is an internal insight or an external news piece
  const isInternal = url.startsWith('/');

  const categoryColors = {
    'Global Industry Leaders': 'accent',
    'South African Leaders': 'primary',
    'Regulatory Updates': 'neutral',
    // NEW: Added a specific color badge for your proprietary content
    'Original Insight': 'accent', 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      layout
    >
      <Card
        variant="outlined"
        padding="default"
        hover
        className="h-full flex flex-col group"
      >
        {/* Category Badge */}
        <Badge variant={categoryColors[category] || 'default'} size="small" className="mb-4">
          {category}
        </Badge>

        {/* Title */}
        <h3 className="font-sans font-semibold text-lg text-forest-deep mb-3 group-hover:text-forest transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Blurb */}
        <p className="text-charcoal-light text-sm leading-relaxed flex-grow line-clamp-3 mb-4">
          {blurb}
        </p>

        {/* SMART ROUTING LOGIC */}
        {isInternal ? (
          <Link
            to={url}
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold text-sm transition-colors group/link mt-auto"
          >
            Read Insight
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-forest hover:text-forest-deep font-semibold text-sm transition-colors group/link mt-auto"
          >
            Read Article
            <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        )}
      </Card>
    </motion.div>
  );
};

export default ArticleCard;