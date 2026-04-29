export const esgArticles = {
  "Global Industry Leaders": [
    {
      title: "Microsoft Scales Carbon Removal with Record 45M Tonne Agreements",
      url: "https://news.microsoft.com/source/features/sustainability/from-farms-to-oceans-how-microsoft-is-working-to-scale-carbon-dioxide-removal/",
      blurb: "In early 2026, Microsoft reported signing agreements to remove a record 45 million metric tonnes of CO2 in fiscal year 2025. This scale-up leverages biochar, enhanced rock weathering, and BECCS to meet its 2030 carbon-negative goal.",
    },
    {
      title: "Schneider Electric Surpasses 2025 Sustainability Impact Goals",
      url: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/Schneider-Electric-completes-its-Sustainability-Impact-SSI-20212025-program-setting-the-stage-for-the-next-chapter-699d9ef70c43e12f770ab803/",
      blurb: "Schneider Electric concluded its 2021-2025 program with a score of 8.86/10. The company also expanded clean energy access to over 61 million people globally in addition to having saved or avoided 862 million tonnes of CO2 for customers.",
    },
    {
      title: "Apple Reaches 100% Recycled Cobalt for All Apple-Designed Batteries",
      url: "https://www.apple.com/newsroom/2026/04/apple-accelerates-progress-with-highest-ever-recycled-material-in-its-products/",
      blurb: "As of April 2026, Apple reached 100% recycled cobalt in all batteries and 100% recycled rare earth elements in magnets. This progress is anchored by the new MacBook Neo, which features 60% total recycled content.",
    },
  ],
  "South African Leaders": [
    {
      title: "Woolworths 'Farming for the Future' Hailed as Global Sustainability Benchmark",
      url: "https://www.woolworthsholdings.co.za/woolworths-farming-for-the-future-named-among-worlds-top-sustainability-programmes/",
      blurb: "In March 2026, a comprehensive independent study recognized Woolworths' 'Farming for the Future' as a world-leading standard. The program has driven measurable environmental upgrading and supplier resilience across 16 years of data.",
    },
    {
      title: "Investec 2026 Report: Navigating the Energy Transition via Coalitions",
      url: "https://www.investec.com/en_za/focus/what-next/making-the-transition-investable.html",
      blurb: "In its March 2026 'What Next?' analysis, Investec advocates for 'pre-competitive' coalitions to accelerate South Africa's infrastructure projects. The report emphasizes that policy predictability and coordinated capital are the primary catalysts for scaling the country's green growth.",
    },
    {
      title: "Shoprite Secures R1.5 Billion ESG-Linked Financing for Growth from RMB",
      url: "https://www.rmb.co.za/deal/rmb-lender-and-sustainability-agent-for-shoprite-to-meet-their-esg-goals",
      blurb: "Granted R1.5 billion (R700 million green loan + R800 million sustainability-linked) in light of ESG targets such as recycling and installation of renewable energy.",
    },
  ],
  "Regulatory Updates": [
    {
      title: "Australia Launches First Mandatory Climate Reports Under CRFD Regime",
      url: "https://www.allens.com.au/insights-news/insights/2024/09/mandatory-climate-related-financial-reporting-legislation/",
      blurb: "Following the 2025 commencement of Australia’s climate-related financial disclosure (CRFD), the first wave of mandatory reports from Group 1 companies is being filed in 2026. The regime aligns Australia with the ISSB's global baseline for climate risk transparency.",
    },
    {
      title: "California Climate Disclosure Laws: Scope 3 Reporting Begins in 2026",
      url: "https://viewpoint.pwc.com/us/en/pwc/in-depth/california-sb-253-sb-261-for-2026.html#whatdo",
      blurb: "California’s landmark SB 253 and SB 261 require large companies to disclose Scope 1, 2, and 3 emissions and climate-related financial risks. The first wave of compliance begins in 2026 for entities with total annual revenues exceeding $1 billion that do business in the state.",
    },
    {
      title: "ISSB Adoption Reaches 21 Jurisdictions as of January 2026",
      url: "https://www.spglobal.com/sustainable1/en/insights/research-reports/issb-january-2026",
      blurb: "A January 2026 report reveals that 21 jurisdictions—including Mexico, Chile, and Qatar—have now adopted ISSB standards. As the framework becomes a global cornerstone, the board is shifting its focus toward harmonizing nature-related disclosures and human capital reporting.",
    },
  ],
};

export const articleCategories = Object.keys(esgArticles);

export function getArticlesByCategory(category) {
  return esgArticles[category] || [];
}

export function getAllArticles() {
  return Object.entries(esgArticles).flatMap(([category, articles]) =>
    articles.map((article) => ({ ...article, category }))
  );
}

export default esgArticles;
