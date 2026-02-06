import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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
  const categoryColors = {
    'Global Industry Leaders': 'accent',
    'South African Leaders': 'primary',
    'Regulatory Updates': 'neutral',
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

        {/* Link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold text-sm transition-colors group/link"
        >
          Read Article
          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </a>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
