import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import Card from '../../ui/Card';

/**
 * PowerBIEmbed component - Responsive Power BI iframe wrapper
 */
const PowerBIEmbed = ({ embedUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        {/* Loading State */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand-light">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-forest animate-spin mx-auto mb-3" />
              <p className="text-charcoal-light">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand-light">
            <div className="text-center max-w-md px-6">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h4 className="font-semibold text-forest-deep mb-2">
                Dashboard Unavailable
              </h4>
              <p className="text-charcoal-light text-sm">
                The interactive dashboard is temporarily unavailable.
                Please contact us for a personalized demonstration.
              </p>
            </div>
          </div>
        )}

        {/* Power BI iframe */}
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </Card>
  );
};

export default PowerBIEmbed;
