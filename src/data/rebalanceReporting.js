// RebalanceReporting (formerly ReportForge) product content, shared by the home page feature,
// the Annual Reporting page and the unlisted /rebalance-reporting/ page.
// The unlisted page has an Annual / Impact toggle: reportTypes (at the end) holds each version.
// Steps, chapters and stills follow each version's product video.

const IMAGES = '/assets/images/rebalance-reporting';

export const rebalanceReportingVideos = {
  // 65-second overview (impact reports), shown on all three pages
  overview: {
    src: '/assets/videos/rebalance-reporting.mp4',
    poster: `${IMAGES}/poster-logo.jpg`,
    // The video's pale title card, used where the page around it already shows the logo
    titleCardPoster: `${IMAGES}/poster-title-card.jpg`,
    duration: '1 min',
    title: 'RebalanceReporting overview',
    // Start times (seconds) of each part of the video, for the chapter links
    chapters: [
      { label: 'Why impact reports', time: 8.4 },
      { label: 'How we draft', time: 18.2 },
      { label: 'Your team', time: 33.7 },
      { label: 'The finished report', time: 48.6 },
    ],
  },
  // Detailed walkthrough for the Annual Reporting page.
  // Until a walkthrough file is added, src stays null and the overview video is shown instead.
  walkthrough: {
    src: null,
    poster: `${IMAGES}/poster-logo.jpg`,
    duration: '2 min',
    title: 'RebalanceReporting walkthrough',
  },
};

export const rebalanceReportingImages = {
  logoMark: `${IMAGES}/logo-mark.png`,
  ogImage: `${IMAGES}/og-image.jpg`,
  // "Every figure has a source" screen, used on the Annual Reporting page
  sources: {
    src: `${IMAGES}/step-03-sources.jpg`,
    width: 1048,
    height: 884,
    alt: 'RebalanceReporting draft with each figure linked to its source file, and a missing figure marked "to come" and requested from the team',
  },
};

// Pages from the sample impact report in the video
const impactReportSamples = [
  {
    src: `${IMAGES}/report-spread-welcome.jpg`,
    width: 1035,
    height: 733,
    caption: 'At a glance and a note from the MD',
    alt: 'Sample impact report spread: "A year to be proud of" with headline figures on people and the planet, beside "Why we\'re telling our story", a note from the managing director',
  },
  {
    src: `${IMAGES}/report-spread-people.jpg`,
    width: 1035,
    height: 735,
    caption: 'A chapter opener and a story page',
    alt: 'Sample impact report spread: the "Caring for our planet" chapter opener beside "Sunshine in, less waste out", a page on solar power and food waste with linked figures',
  },
];

// The impact report chapters shown in the video's sample report
const impactReportChapters = [
  'Welcome',
  'Who we are',
  'People and communities',
  'Caring for our planet',
  'Voices and partners',
  'Looking ahead',
];

const impactReportReasons = [
  {
    number: '1',
    title: 'Earn trust',
    description: 'Show investors, clients and communities what your business gives back, with evidence.',
  },
  {
    number: '2',
    title: 'Win work',
    description: 'Bring your impact into tenders, proposals and supplier assessments.',
  },
  {
    number: '3',
    title: 'Attract and keep people',
    description: 'Give employees and future hires a purpose they can see.',
  },
  {
    number: '4',
    title: 'Plan what comes next',
    description: 'See what is working, and set clear goals for next year.',
  },
];

const annualReportStandards = ['GRI', 'ISSB (IFRS S1 & S2)', 'SASB', 'TNFD', 'CSRD', 'CDP', 'UN SDGs'];

const impactReportSteps = [
  {
    group: 'How we draft your report',
    steps: [
      {
        number: '01',
        title: 'Learns your voice',
        description: 'Upload past reports, your website, company profile, brand guidelines and data. No impact report yet? Start with what you have already published.',
        image: `${IMAGES}/step-01-voice.jpg`,
        width: 1048,
        height: 884,
        alt: 'RebalanceReporting Files page with a company profile, website, annual review, brand guidelines and initiatives data uploaded, and a summary of what it learned: voice, spelling, audience and look',
      },
      {
        number: '02',
        title: 'Answers become the draft',
        description: 'Quick, guided questions about your initiatives go to the right people. Their answers and stories flow into your first draft.',
        image: `${IMAGES}/step-02-answers.jpg`,
        width: 1048,
        height: 884,
        alt: 'RebalanceReporting Questions page where a community manager answers "What changed for the farmers who grow with you this year?"',
      },
      {
        number: '03',
        title: 'Grounded in your data',
        description: 'Every figure is linked to its source, so your story holds up when people ask. Anything missing is requested from your team, never estimated.',
        image: `${IMAGES}/step-03-sources.jpg`,
        width: 1048,
        height: 884,
        alt: 'A draft paragraph with each figure linked to its source file, and a missing yield figure marked "to come" and requested from the agronomy team',
      },
    ],
  },
  {
    group: 'How your team works',
    steps: [
      {
        number: '04',
        title: 'One portal. Your whole team.',
        description: 'Invite colleagues and give each the right access. Everyone gets their chapters and due dates.',
        image: `${IMAGES}/step-04-team.jpg`,
        width: 1048,
        height: 884,
        alt: 'The report team page listing an impact lead, finance, HR, community and operations managers and Rebalance Impact, each with their role',
      },
      {
        number: '05',
        title: 'Edit your report',
        description: 'Edit text, figures and images in place. Change a figure once and it updates everywhere it appears.',
        image: `${IMAGES}/step-05-edit.jpg`,
        width: 1228,
        height: 884,
        alt: 'The page editor showing a solar share figure updated in three places across the report',
      },
      {
        number: '06',
        title: 'Review and sign off',
        description: 'A clear status for every page, from draft to final, through to sign-off. Our reporting experts review every report with you.',
        image: `${IMAGES}/step-06-signoff.jpg`,
        width: 1048,
        height: 884,
        alt: 'The review page for the People and communities chapter, with every page marked Final and signed off by the impact lead',
      },
    ],
  },
];

const impactReportCapabilities = {
  draft: [
    'Written in your voice, tone and structure, learned from what you have published',
    'Narrative shaped by your data, your chosen standards and your team\'s answers',
    'Every figure and statement linked to its source document',
    'Data gaps flagged and requested, never estimated',
    'Year-on-year changes flagged and explained',
    'Reviewed by our reporting experts before it reaches you',
  ],
  portal: [
    'One secure workspace for your draft, files, questions and tasks',
    'Role-based access, with chapters and due dates for every contributor',
    'Edit, suggest and change text, figures and images in place',
    'Linked figures, so a change flows through the whole report',
    'Comments and page-by-page approvals with a clear review status',
    'A finished report designed in your brand, ready to publish',
  ],
};

// Annual Reporting page: how RebalanceReporting works for annual reports
export const annualReportSteps = [
  {
    number: '01',
    title: 'Share your past reports and data',
    description: "Upload past reports, media and data, past and present. Narrative and structure are then set from your uploads, chosen standards and your team's answers to quick guided questions.",
  },
  {
    number: '02',
    title: 'Drafted and traced',
    description: 'Your report is drafted in your voice, with every figure and statement linked to its source. Gaps are flagged, never estimated.',
  },
  {
    number: '03',
    title: 'Compliance checked',
    description: 'The draft is checked against your chosen standards and relevant legal frameworks, with any missing disclosures flagged.',
  },
  {
    number: '04',
    title: 'Collaborate in the RebalanceReporting portal',
    description: 'Your draft arrives in a secure, shared portal, with quality checks and initial reviews already complete.',
  },
  {
    number: '05',
    title: 'Edit with AI support',
    description: 'Edit, suggest and change text, figures and images. AI assistance keeps metrics consistent across every page.',
  },
  {
    number: '06',
    title: 'Review and sign off',
    description: 'Approve page by page, with expert review from our team, through to a finished report designed in your brand and ready to publish.',
  },
];

export const annualReportCapabilities = {
  draft: [
    'Written in your voice, tone and structure, learned from past reports',
    'Narrative shaped by your data, chosen standards and team input',
    'Every figure and statement linked to its source document',
    'Data gaps flagged, never estimated',
    'Year-on-year changes flagged and explained',
    'Status words kept exact, so "planned" never becomes "achieved"',
    'Coverage checked against relevant standards and frameworks, such as GRI, ISSB and CDP',
    'Reviewed by our reporting experts before it reaches you',
  ],
  portal: [
    'One secure workspace for your draft, files and tasks',
    'Role-based access for every contributor',
    'Edit, suggest and change text, figures and images in place',
    'AI assistance when updating figures and metrics, so changes flow through the report',
    'Comments and page-by-page approvals with a clear review status',
    'A finished report designed in your brand, ready to publish',
  ],
};

// ---------------------------------------------------------------------------
// Annual reports version of the unlisted page, following the annual video.
// (65.5 seconds, WebM: VP9 video with Opus audio)

const annualReportVideo = {
  src: '/assets/videos/rebalance-reporting-annual.webm',
  poster: `${IMAGES}/annual-poster-title-card.jpg`,
  duration: '1 min',
  title: 'RebalanceReporting for annual reports',
  chapters: [
    { label: 'How we draft', time: 8.8 },
    { label: 'Built for assurance', time: 26.8 },
    { label: 'Your team', time: 31.3 },
    { label: 'The finished report', time: 52.2 },
  ],
};

const annualReportFeatures = [
  {
    icon: 'ShieldCheck',
    title: 'Checked against your standards',
    description: 'The draft is checked against your chosen standards and relevant legal frameworks, with any missing disclosures flagged.',
  },
  {
    icon: 'History',
    title: 'Year-on-year changes explained',
    description: 'Changes from last year are flagged and explained, so every movement in your numbers has a reason.',
  },
  {
    icon: 'Quote',
    title: 'Status words kept exact',
    description: '"Planned" never becomes "achieved". Every commitment reads exactly as your evidence supports.',
  },
  {
    icon: 'FileSearch',
    title: 'Ready for your assurer',
    description: 'Every figure is linked to your data workbooks, with a record of every change, edit and approval.',
  },
];

const annualStill = (file) => ({ image: `${IMAGES}/${file}`, width: 1048, height: 884 });

const annualReportVideoSteps = [
  {
    group: 'How we draft your report',
    steps: [
      {
        number: '01',
        title: 'Learns your voice',
        description: 'Upload past reports, interim updates, brand guidelines and your data pack. RebalanceReporting learns how you write: your voice, spelling, structure and look.',
        ...annualStill('annual-step-01-voice.jpg'),
        alt: 'Files page with the 2025 and 2024 sustainability reports, an interim update, brand guidelines and a data pack uploaded, and what was learned from them: voice, spelling, structure and look',
      },
      {
        number: '02',
        title: 'Answers become the draft',
        description: 'Quick, guided questions go to the right people. Their answers and data flow straight into your first draft.',
        ...annualStill('annual-step-02-answers.jpg'),
        alt: 'Question 14 of 22, "What helped you reduce lost-time injuries this year?", being answered by the safety manager',
      },
      {
        number: '03',
        title: 'Every figure traced',
        description: 'Each number is linked to its source. Gaps are flagged and requested from your team, never estimated.',
        ...annualStill('annual-step-03-sources.jpg'),
        alt: 'A draft paragraph on emissions with each figure linked to its source, and the Scope 3 figure marked "to come" and requested from Finance',
      },
      {
        number: '04',
        title: 'Built for assurance',
        description: "One systematic method, the same every year. The draft is checked against your chosen standards, such as GRI, IFRS S2 and CDP, ready for your assurer's review.",
        ...annualStill('annual-step-04-assurance.jpg'),
        alt: 'Quality checks: every figure matched to its source, year-on-year changes explained, status words exact, and coverage of GRI Standards, IFRS S2 Climate and CDP Climate',
      },
    ],
  },
  {
    group: 'How your team works',
    steps: [
      {
        number: '05',
        title: 'One portal. Your whole team.',
        description: 'Invite colleagues and give each the right access, with their chapters and due dates.',
        ...annualStill('annual-step-05-team.jpg'),
        alt: 'The report team page listing a sustainability lead, finance, HR, safety and operations managers and Rebalance Impact, each with their role',
      },
      {
        number: '06',
        title: 'Edit your report',
        description: 'Every word, number and image can be changed in place. Change a figure once and it updates everywhere it appears.',
        image: `${IMAGES}/annual-step-06-edit.jpg`,
        width: 1228,
        height: 884,
        alt: 'The page editor showing an emissions figure updated in six places across the report',
      },
      {
        number: '07',
        title: 'Review and sign off',
        description: 'Comment, suggest and approve page by page, with a clear status for every page through to final sign-off.',
        ...annualStill('annual-step-07-signoff.jpg'),
        alt: 'The review page for the Environment chapter, with every page marked Final and signed off by the finance manager',
      },
    ],
  },
];

const annualReportSamples = [
  {
    src: `${IMAGES}/annual-page-at-a-glance.jpg`,
    width: 1036,
    height: 736,
    caption: '2026 at a glance',
    alt: 'Sample sustainability report page "2026 at a glance", with eight headline figures on people, emissions, energy and procurement',
  },
  {
    src: `${IMAGES}/annual-page-narrative.jpg`,
    width: 1036,
    height: 736,
    caption: 'A narrative page',
    alt: 'Sample sustainability report page "Enterprise development", with two columns of text on tax transparency, infrastructure partnerships and economic value, a photo and a headline figure',
  },
];

const annualReportChapters = ['Overview', 'Environment', 'People', 'Prosperity', 'Governance', 'Appendices'];

// The two versions of the unlisted page, in toggle order. Impact is shown first.
export const reportTypeOrder = ['annual', 'impact'];
export const defaultReportType = 'impact';

export const reportTypes = {
  impact: {
    label: 'Impact Reports',
    icon: 'Sprout',
    video: {
      ...rebalanceReportingVideos.overview,
      poster: rebalanceReportingVideos.overview.titleCardPoster,
    },
    overview: {
      navLabel: 'Why an impact report',
      label: 'Impact reports',
      title: 'Show the difference you make',
      subtitle: 'An impact report tells the story behind your work: the people, places and partners who are better off because of it.',
      reasons: impactReportReasons,
      callout: {
        title: 'No impact report yet?',
        text: 'Start with what you have already published: your website, company profile or annual review. RebalanceReporting learns your voice from them.',
      },
    },
    howItWorks: {
      subtitle: 'Six steps from your files to a finished impact report. Our experts and your team stay in control at every step.',
      steps: impactReportSteps,
    },
    finished: {
      subtitle: 'Ready to share with your stakeholders. These spreads come from a sample impact report made with RebalanceReporting.',
      samples: impactReportSamples,
      chaptersLabel: 'Inside the sample impact report',
      chapters: impactReportChapters,
    },
    capabilities: impactReportCapabilities,
    cta: "Let's talk about your impact report, and how RebalanceReporting can help.",
  },
  annual: {
    label: 'Annual Reports',
    icon: 'BookOpen',
    video: annualReportVideo,
    overview: {
      navLabel: 'Annual reports',
      label: 'Annual reports',
      title: 'Your annual report, drafted faster',
      subtitle: 'Integrated, annual and sustainability reports, built with the same method and checked against the standards you report to.',
      features: annualReportFeatures,
      standards: annualReportStandards,
    },
    howItWorks: {
      subtitle: "Seven steps from last year's report to this year's. Our experts and your team stay in control at every step.",
      steps: annualReportVideoSteps,
    },
    finished: {
      subtitle: 'Ready to publish. These pages come from a 236-page sample sustainability report made with RebalanceReporting.',
      samples: annualReportSamples,
      chaptersLabel: 'Inside the sample annual report',
      chapters: annualReportChapters,
    },
    capabilities: annualReportCapabilities,
    cta: "Let's talk about your annual report, and how RebalanceReporting can help.",
  },
};
