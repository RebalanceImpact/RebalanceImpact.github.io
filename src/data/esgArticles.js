export const esgArticles = {
  "Global Industry Leaders": [
    {
      title: "Unilever's Sustainable Living Plan Delivers 46% Faster Growth",
      url: "https://www.bsm.upf.edu/documents/2024-case-study-unilever.pdf",
      blurb: "Unilever's sustainable living brands outperformed others, growing 46% faster and delivering 70% of turnover growth while achieving zero waste to landfill and 100% renewable electricity.",
    },
    {
      title: "IKEA Achieves 30% Emissions Reduction with 20% Revenue Growth",
      url: "https://www.impactx.earth/post/ikea-australia-proves-sustainability-drives-profit-not-costs",
      blurb: "IKEA demonstrated that sustainability drives profit, achieving 20% revenue growth since 2016 while reducing emissions by 30% through renewable energy and zero-emission delivery vehicles.",
    },
    {
      title: "Ørsted's Q1 2025 EBITDA Rises 18% on Renewable Pivot",
      url: "https://www.ainvest.com/news/rsted-strategic-turnaround-path-renewable-energy-leadership-deep-dive-q1-2025-performance-capital-discipline-2508/",
      blurb: "Group EBITDA climbed 18% in Q1 2025 driven by 99% renewable generation and the commissioning of Gode Wind 3; greenhouse‐gas intensity fell 7% year-on-year after fully exiting coal.",
    },
  ],
  "South African Leaders": [
    {
      title: "Nedbank Named Africa's Sustainable Bank of the Year 2025",
      url: "https://group.nedbank.co.za/news-and-insights/press/2025/nedbank-named-africas-sustainable-bank-of-the-year-for-2025.html",
      blurb: "Committed R183 billion (19% of loan book) to sustainable finance and issued a record-low-cost Sustainability Tier 2 bond, earning back-to-back Sustainable Bank awards.",
    },
    {
      title: "MTN Reports Strong 2024 Progress in Driving Africa's Digital Future",
      url: "https://www.telecomreviewafrica.com/articles/11815-mtn-reports-strong-2024-progress-in-driving-africas-digital-future/",
      blurb: "Achieved a 46% reduction in Scope 1 and 2 emissions from baseline. Achieved cost-savings of $5.06 million from the reuse of equipment by operating companies.",
    },
    {
      title: "Shoprite Secures R1.5 Billion ESG-Linked Financing for Growth from RMB",
      url: "https://www.rmb.co.za/deal/rmb-lender-and-sustainability-agent-for-shoprite-to-meet-their-esg-goals",
      blurb: "Granted R1.5 billion (R700 million green loan + R800 million sustainability-linked) in light of ESG targets such as recycling and installation of renewable energy.",
    },
  ],
  "Regulatory Updates": [
    {
      title: "ISO and GHG Protocol Unify Emissions Accounting Standards",
      url: "https://www.esgtoday.com/iso-ghg-protocol-unify-standards-for-measuring-and-reporting-emissions/",
      blurb: "ISO and GHG Protocol formed a strategic partnership to harmonize ISO 1406X series with GHG Protocol Corporate and Scope standards into co-branded global benchmarks, simplifying reporting and aligning methodologies.",
    },
    {
      title: "China to Impose Absolute Emissions Caps from 2027",
      url: "https://www.reuters.com/sustainability/climate-energy/chinas-carbon-market-introduce-absolute-emissions-caps-2027-2025-08-26/",
      blurb: "China's national ETS will replace intensity targets with fixed absolute caps for chemicals, petrochemicals, papermaking, and domestic aviation from 2027, expanding to cover most major polluters by 2030.",
    },
    {
      title: "ISSB Standards Adopted by 20 Jurisdictions Covering 60% of Global GDP",
      url: "https://www.iss-corporate.com/resources/blog/global-interest-in-issb-standards-rises-amid-eu-uncertainty/",
      blurb: "Twenty countries integrating IFRS S1 & S2 into national regimes now represent over 60% of world GDP, establishing consistent baseline sustainability disclosures focused on financial materiality and connectivity.",
    },
  ],
};

// Rebalance Impact's Proprietary Insights
export const rebalanceOriginalArticles = [
  {
    title: "Navigating Scope 3 Emissions: A Practical Guide for South African SMEs",
    url: "/insights/navigating-scope-3-emissions", // Replace with your actual routing
    blurb: "Demystifying the complexities of supply chain carbon accounting to help local enterprises align with global GRI and GHG Protocol standards.",
  },
];

export const articleCategories = Object.keys(esgArticles);

export function getArticlesByCategory(category) {
  return esgArticles[category] || [];
}

export function getAllArticles() {
  return Object.entries(esgArticles).flatMap(([category, articles]) =>
    articles.map((article) => ({ ...article, category }))
  );
}

// Function to fetch Rebalance Impact proprietary articles
export function getRebalanceArticles() {
  return rebalanceOriginalArticles.map((article) => ({
    ...article,
    category: "Original Insight"
  }));
}

export default esgArticles;
