import { Helmet } from 'react-helmet-async';

// Organization schema - used site-wide
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Rebalance Impact",
  "alternateName": "Rebalance Impact Consulting",
  "url": "https://www.rebalanceimpact.com",
  "logo": "https://www.rebalanceimpact.com/assets/images/rebalance-logo.png",
  "description": "Expert ESG consulting services combining climate research, financial expertise, and environmental data to deliver practical sustainable solutions for businesses.",
  "sameAs": [
    "https://www.linkedin.com/company/rebalance-impact"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@rebalanceimpact.com",
    "availableLanguage": ["English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZA"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "geoRadius": "5000"
  },
  "knowsAbout": [
    "ESG Consulting",
    "Sustainability Reporting",
    "Climate Risk Assessment",
    "Environmental Data Analytics",
    "Carbon Footprint Analysis",
    "Sustainable Finance"
  ]
};

// Website schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rebalance Impact",
  "url": "https://www.rebalanceimpact.com",
  "description": "ESG Consulting & Sustainable Solutions",
  "publisher": {
    "@type": "Organization",
    "name": "Rebalance Impact"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.rebalanceimpact.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Service schemas for ESG services
export const esgServicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "ESG Consulting",
  "provider": {
    "@type": "Organization",
    "name": "Rebalance Impact"
  },
  "name": "ESG Consulting Services",
  "description": "Comprehensive Environmental, Social, and Governance consulting services including sustainability reporting, climate risk assessment, and ESG data analytics.",
  "areaServed": {
    "@type": "Country",
    "name": "South Africa"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "ESG Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sustainability Reporting",
          "description": "Expert guidance on ESG reporting frameworks including GRI, SASB, and TCFD compliance."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Climate Risk Assessment",
          "description": "Comprehensive analysis of climate-related risks and opportunities for your business."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "ESG Data Analytics",
          "description": "Advanced data analytics and KPI tracking for environmental and social metrics."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Stakeholder Engagement",
          "description": "Strategic stakeholder communication and ESG disclosure support."
        }
      }
    ]
  }
};

// Professional Service schema
export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Rebalance Impact",
  "image": "https://www.rebalanceimpact.com/assets/images/rebalance-logo.png",
  "url": "https://www.rebalanceimpact.com",
  "description": "Expert ESG consulting services for businesses seeking sustainable solutions.",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZA"
  }
};

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Generate webpage schema
export const generateWebPageSchema = ({ name, description, url, breadcrumb }) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": name,
  "description": description,
  "url": url,
  "isPartOf": {
    "@type": "WebSite",
    "name": "Rebalance Impact",
    "url": "https://www.rebalanceimpact.com"
  },
  "breadcrumb": breadcrumb,
  "publisher": {
    "@type": "Organization",
    "name": "Rebalance Impact",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.rebalanceimpact.com/assets/images/rebalance-logo.png"
    }
  }
});

// FAQ Schema for New to ESG page
export const newToESGFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ESG?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ESG stands for Environmental, Social, and Governance. It's a framework used to assess an organization's business practices and performance on various sustainability and ethical issues."
      }
    },
    {
      "@type": "Question",
      "name": "Why is ESG important for businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ESG is important because it helps businesses identify risks, improve operational efficiency, attract investors, meet regulatory requirements, and build trust with stakeholders."
      }
    },
    {
      "@type": "Question",
      "name": "How do I start with ESG reporting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start by understanding your stakeholders' expectations, identifying material ESG issues for your industry, collecting relevant data, and choosing an appropriate reporting framework like GRI, SASB, or TCFD."
      }
    },
    {
      "@type": "Question",
      "name": "What ESG frameworks should I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common frameworks include GRI (Global Reporting Initiative), SASB (Sustainability Accounting Standards Board), TCFD (Task Force on Climate-related Financial Disclosures), and the UN Sustainable Development Goals."
      }
    }
  ]
};

// Article schema for news/media
export const generateArticleSchema = ({ headline, description, datePublished, author, image }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": headline,
  "description": description,
  "datePublished": datePublished,
  "author": {
    "@type": "Organization",
    "name": author || "Rebalance Impact"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Rebalance Impact",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.rebalanceimpact.com/assets/images/rebalance-logo.png"
    }
  },
  "image": image,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.rebalanceimpact.com/news-media"
  }
});

// Schema component that renders JSON-LD
export default function SchemaMarkup({ schemas }) {
  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
