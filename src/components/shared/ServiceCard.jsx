import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

/**
 * ServiceCard component - Service offering card
 */
const ServiceCard = ({
  title,
  description,
  icon: Icon,
  href,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={href}>
        <Card
          variant="filled"
          padding="large"
          hover
          className="h-full group cursor-pointer"
        >
          {/* Icon */}
          {Icon && (
            <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center mb-6 group-hover:bg-forest group-hover:text-white transition-all duration-300">
              <Icon className="w-7 h-7 text-forest group-hover:text-white transition-colors" />
            </div>
          )}

          {/* Title */}
          <h3 className="font-sans font-semibold text-xl text-forest-deep mb-3 group-hover:text-forest transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-charcoal-light leading-relaxed mb-4">
            {description}
          </p>

          {/* Arrow Link */}
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            Learn More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
