import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articleContent'; // Adjust this path if needed

const FeaturedInsight = () => {
  // Sort the articles by date (newest first) and grab the very first one
  const latestArticle = [...articles].sort(
    (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
  )[0];

  if (!latestArticle) return null;

  return (
    <section className="featured-insight-container">
      <div className="featured-insight-box">
        {/* Category Badge */}
        <span className="insight-badge">{latestArticle.category}</span>
        
        {/* Dynamic Content */}
        <h2 className="insight-title">{latestArticle.title}</h2>
        <p className="insight-blurb">{latestArticle.blurb}</p>
        
        {/* The SEO-Friendly React Router Link */}
        <Link to={`/insights/${latestArticle.slug}`} className="insight-button">
          Read the Full Insight <span>&rarr;</span>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedInsight;