// src/data/articleContent.js

export const articles = [
  {
    slug: 'navigating-new-scope-2-guidance',
    title: 'Navigating the New Scope 2 Guidance',
    category: 'Original Insight',
    datePublished: '2026-03-20',
    author: 'Rebalance Impact',
    blurb: 'Discover how the GHG Protocol\'s shift to hourly matching and geographic deliverability closes greenwashing loopholes, and learn how to future-proof your corporate energy strategy.',
    // We use backticks (`) to allow for multi-line markdown text
    content: `
The [GHG Protocol’s Scope 2 Guidance](https://ghgprotocol.org/scope-2-guidance) has been the bedrock for how companies account for the electricity powering their operations. But as our grids have evolved and become more complex, and the demand for transparency hits an all-time high, the rulebook is getting a significant facelift. **This is the first update in over a decade**, which in the context of how rapidly the reporting space evolves - is a lifetime.

With standards such as [ESRS](https://www.efrag.org/en/draft-simplified-esrs) and [ISSB](https://www.ifrs.org/sustainability/knowledge-hub/introduction-to-issb-and-ifrs-sustainability-disclosure-standards/) becoming mandatory, the amount of available data has exploded globally, bringing with it more insights on how different companies and industries actually approach decarbonisation. These insights have shown that the current Scope 2 guidance does not present a real-world picture of the energy grids that keep our economies running. This has led to companies taking advantage of the system - either deliberately, or unknowingly due to unclear and ambiguous guidance.

The GHG Protocol has recently wrapped up a **major public consultation** on proposed updates that aim to tighten the link between corporate reporting and physical reality. We’re now moving away from broad annual averages and toward a world of **hourly matching and geographic deliverability.**

## Why the Change? Closing the ***“Greenwashing”*** Loopholes

Under the 2015 rules, many companies could claim ***"100% renewable"*** status by purchasing unbundled **Renewable Energy Certificates (RECs)** from, for example, a wind farm in a different region - or even a different continent - to offset fossil-fuel power used at midnight in a local office. While this helped seed early renewable markets, it didn't reflect the physical reality of the grid.
The new guidance finally addresses these two major “loopholes”:

* **The Temporal Gap:** Solar power generated at high noon doesn’t actually offset the coal-based grid power you use at 2:00AM.
* **The Geographic Gap:** Buying credits from a renewable-heavy grid (like the Nordics) does nothing to decarbonize the carbon-heavy grid where your office actually sits (for example, in the US).

## The Two Pillars of the Revision

The core of the proposed revision rests on two mandatory shifts for market-based reporting to deal with these two gaps.

### 1. Temporal Granularity

Complex grids that accommodate a wide variety of energy sources typically do not yet have enough battery storage to store all renewable energy generated. Rather, as renewable energy is generated, it’s supplied to the grid for immediate use. 

> **The Problem:** If a company requires 100MW of electricity for the full 24-hour day to run their operations, but their 100MW solar REC only provided power to the grid during an 18-hour window, the company still relied on the coal-powered grid for the remaining 8 hours. 

> **The Shift:** Companies will now be required to match their electricity consumption with carbon-free energy (CFE) generation on an hourly basis rather than applying a blanket REC saving. This moves the needle from “buying credits” to “changing how we consume”.

### 2. Spatial Granularity and Deliverability

> **The Problem:** Consider a high-emitting US-based company missing their emission reduction target. The company purchases RECs from Norway to avoid a financial penalty on a sustainability-linked loan. While they meet their target on paper, the physical reality is that the energy used in the US was still carbon-intensive. 

> **The Shift:** To count a renewable purchase in the new guidance, that energy must now be generated within the same "market boundary" as the consumption. In short, the power must be physically able to reach your door.

## A New Metric: Marginal Emissions Impact (MEI)

The proposed adjustments allow for an additional reporting metric: Marginal Emissions Impact (MEI). This provides stakeholders information around the impact that a company has physically made on their grid. If a company in South Africa (a coal-dependent grid) enters a PPA with a solar company, their impact is far greater than if they were based in Sweden. MEI gives a better reflection of this impact, driving actual, quantifiable change.

## What This Means for Your Business Strategy

### The PPA Puzzle: “What if I already have a contract?”

A common concern is the impact on PPAs signed prior to the proposed changes. Does this make you non-compliant?
The short answer: No. The guidance has implemented a legacy clause for active PPAs. You are permitted to apply the original Scope 2 guidance for the remainder of that contract term.

***Pro Tip:*** *While you have this "grace period," best practice is to implement the new guidance now if the data is obtainable without "undue cost or effort." It’s better to build the muscle of granular reporting before you are forced to.*

### The Data Hurdle: “What if I don’t have smart meters?”

Installing hourly smart meters at multiple individual sites isn't just expensive - it’s an administrative mountain. To address this, the GHG Protocol allows for statistical estimation based on load profiles. Day-time peaking is one of three primary profiles identified by the Protocol:

1. **Baseload:** Ideal for Data Centers or Industrial Parks where energy use is consistent 24/7.
2. **Day-time Peaking:** Typical for retail or office spaces where energy spikes during business hours and drops off significantly at night.
3. **Variable:** Common in mixed-use facilities (offices + warehouses + processing). This is the most complex profile.

### The Silver Lining: A Strategic Pivot for Long-Term Business Longevity

While the complexity of these updates has increased, so has the strategic reward. By transitioning to a more granular, local, and 24/7 carbon-free energy model, you are fundamentally de-risking your future business model.

1. **Precision Forecasting and Operational Resilience:** Moving toward hourly data tracking forces operational visibility. You can identify precisely where energy waste occurs and predict future costs with a degree of accuracy that monthly utility bills cannot provide.
2. **Identifying "Hidden" Risks and Cost Savings:** Identifying facilities on carbon-heavy grids early allows you to transition to PPA structures before local carbon taxes or "border adjustment" mechanisms (like the EU's CBAM) drive up costs.
3. **Future-Proofing Your Business Plan:** Companies that wait until 2027 to adapt will find themselves scrambling for limited high-quality local credits. Those who pivot now secure long-term price stability.

---
*The Greenhouse Gas Protocol aims to finalize these standards by 2027 with the early adoption period beginning in 2028. The window to audit your current energy contracts and prepare your data systems is open right now.*
`
  },
];

export const getArticleBySlug = (slug) => {
  return articles.find(article => article.slug === slug);
};

export const getRebalanceArticlesList = () => {
  return articles.map(article => ({
    title: article.title,
    // Dynamically build the URL from the slug
    url: `/insights/${article.slug}`,
    blurb: article.blurb,
    category: article.category
  }));
};