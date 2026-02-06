import { Helmet } from 'react-helmet-async';
import { siteMetadata } from '../../config/siteMetadata';

/**
 * SEOHead component - Helmet wrapper for meta tags
 */
const SEOHead = ({
  title,
  description,
  ogImage,
  ogType = 'website',
  canonicalPath = '',
  noIndex = false,
}) => {
  const pageTitle = title || siteMetadata.defaultTitle;
  const pageDescription = description || siteMetadata.defaultDescription;
  const pageOgImage = ogImage || siteMetadata.defaultOgImage;
  const canonicalUrl = `${siteMetadata.siteUrl}${canonicalPath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${siteMetadata.siteUrl}${pageOgImage}`} />
      <meta property="og:site_name" content={siteMetadata.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteMetadata.siteUrl}${pageOgImage}`} />
      {siteMetadata.twitterHandle && (
        <meta name="twitter:creator" content={siteMetadata.twitterHandle} />
      )}
    </Helmet>
  );
};

export default SEOHead;
