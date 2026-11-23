import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Clock, TrendingUp, Repeat, Users, ShieldCheck, History,
  Quote, FileSearch, Sparkles, LayoutDashboard, PlayCircle, Sprout, BookOpen,
} from 'lucide-react';
import { PageWrapper, SEOHead } from '../components/layout';
import { Container, SectionHeading, Card, Button } from '../components/ui';
import CTABanner from '../components/shared/CTABanner';
import VideoPlayer from '../components/shared/VideoPlayer';
import PageContents from '../components/page-specific/reporting/PageContents';
import StepViewer from '../components/page-specific/rebalance-reporting/StepViewer';
import { variants, transitions } from '../config/motion';
import {
  rebalanceReportingImages,
  reportTypes,
  reportTypeOrder,
  defaultReportType,
} from '../data/rebalanceReporting';

/**
 * RebalanceReporting page - unlisted.
 * Reached only by its link: it is kept out of the navigation, footer and sitemap,
 * and tells search engines not to index it (noIndex).
 * A toggle under the intro switches the whole page between impact reports (default)
 * and annual reports. /rebalance-reporting/?report=annual opens on annual reports.
 */
const PAGE_PATH = '/rebalance-reporting/';
const REPORT_PARAM = 'report';

// Brand colours of the RebalanceReporting wordmark and its app icon tile (from the product video)
const WORDMARK_ORANGE = 'text-[#E3885C]';
const ICON_TILE = 'bg-[#FCF8EF]';

// Icons named in the data file
const ICONS = { Sprout, BookOpen, ShieldCheck, History, Quote, FileSearch };

const valueProps = [
  {
    icon: Clock,
    title: 'Time back for what matters',
    description: 'Less time drafting text and designing pages, more time reviewing and improving your impact.',
  },
  {
    icon: TrendingUp,
    title: 'Lower reporting costs',
    description: 'Fewer hours on writing and layout keeps budgets focused on insight, not production.',
  },
  {
    icon: Repeat,
    title: 'Repeatable, year after year',
    description: 'The same structure and method every cycle, so each report builds on the last.',
  },
  {
    icon: Users,
    title: 'Expert review on every report',
    description: 'Our Chartered Accountants and Environmental Scientists review every draft with you.',
  },
];

const formatTime = (seconds) => {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

const ImpactOverview = ({ overview }) => (
  <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 items-center">
    <div>
      <SectionHeading
        label={overview.label}
        title={overview.title}
        subtitle={overview.subtitle}
        align="left"
        className="mb-8"
      />
      <div className="relative bg-white rounded-xl p-6 pl-7 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        <p className="font-sans font-bold text-forest-deep mb-1">{overview.callout.title}</p>
        <p className="text-charcoal-light text-sm leading-relaxed">{overview.callout.text}</p>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      {overview.reasons.map((reason, index) => {
        const isFirst = index === 0;
        const isLast = index === overview.reasons.length - 1;
        return (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card
              variant={isFirst ? 'dark' : 'flat'}
              padding="large"
              className={`h-full ${isFirst ? '' : 'border border-forest/10'}`}
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-lg mb-5 ${
                  isFirst
                    ? 'bg-white text-forest-deep'
                    : isLast
                      ? 'bg-accent text-white'
                      : 'bg-forest-deep text-white'
                }`}
              >
                {reason.number}
              </span>
              <h3 className={`font-display text-2xl mb-2 ${isFirst ? 'text-white' : 'text-forest-deep'}`}>
                {reason.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isFirst ? 'text-sand-light/85' : 'text-charcoal-light'}`}>
                {reason.description}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const AnnualOverview = ({ overview }) => (
  <>
    <SectionHeading
      label={overview.label}
      title={overview.title}
      subtitle={overview.subtitle}
      className="mb-16"
    />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overview.features.map((feature, index) => {
        const Icon = ICONS[feature.icon];
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card variant="flat" padding="default" className="h-full border border-forest/10">
              <div className="w-12 h-12 rounded-full bg-forest-deep flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-sans font-bold text-lg text-forest-deep mb-2">
                {feature.title}
              </h3>
              <p className="text-charcoal-light text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
    <div className="mt-12 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
      <span className="text-xs font-semibold text-accent-hover uppercase tracking-wider">
        Standards we work with
      </span>
      <ul className="flex flex-wrap justify-center gap-2">
        {overview.standards.map((standard) => (
          <li
            key={standard}
            className="px-3 py-1 rounded-full bg-white text-sm font-medium text-forest"
          >
            {standard}
          </li>
        ))}
      </ul>
    </div>
  </>
);

const RebalanceReportingPage = () => {
  const videoRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportType, setReportType] = useState(defaultReportType);
  // Fade the content in on a switch, but not on first load
  const [hasSwitched, setHasSwitched] = useState(false);

  // The prerendered page shows the default; a ?report= link switches after it loads
  useEffect(() => {
    const fromLink = searchParams.get(REPORT_PARAM);
    if (fromLink && fromLink !== defaultReportType && reportTypes[fromLink]) {
      setReportType(fromLink);
    }
    // Only on first load: later changes come from the toggle itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectReportType = (type) => {
    if (type === reportType) return;
    setReportType(type);
    setHasSwitched(true);
    setSearchParams(type === defaultReportType ? {} : { [REPORT_PARAM]: type }, { replace: true });
  };

  const content = reportTypes[reportType];
  const video = content.video;

  const pageSections = [
    { id: 'video', label: 'Watch the video' },
    { id: 'report-overview', label: content.overview.navLabel },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'finished-report', label: 'The finished report' },
    { id: 'why-rebalance-reporting', label: 'Why RebalanceReporting' },
    { id: 'what-you-get', label: 'What you get' },
  ];

  return (
    <PageWrapper>
      <SEOHead
        title="RebalanceReporting | Rebalance Impact"
        description="RebalanceReporting by Rebalance Impact: AI-driven drafting and a shared workspace for annual and impact reports, written in your voice, with every figure traced to its source."
        canonicalPath={PAGE_PATH}
        ogImage={rebalanceReportingImages.ogImage}
        noIndex
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-deep noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/90 via-forest/80 to-forest-light/70" />
        {/* Arcs, as in the video */}
        <div aria-hidden="true" className="absolute -right-40 -bottom-56 w-[40rem] h-[40rem] rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -right-8 -bottom-80 w-[34rem] h-[34rem] rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -left-48 -top-40 w-[30rem] h-[30rem] rounded-full border border-white/5" />

        <Container className="relative z-10 pt-32 md:pt-40 pb-44 md:pb-64 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants.fadeUp}
            transition={transitions.default}
          >
            <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 rounded-2xl ${ICON_TILE} shadow-lg flex items-center justify-center`}>
              <img
                src={rebalanceReportingImages.logoMark}
                alt=""
                width="200"
                height="200"
                className="w-[82%] h-auto"
              />
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-tight">
              Rebalance<span className={WORDMARK_ORANGE}>Reporting</span>
            </h1>
            <p className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-sand-light/70">
              By Rebalance Impact
            </p>
            <p className="mt-8 font-display text-2xl md:text-3xl text-sand-light">
              Your report. Your voice. <span className={WORDMARK_ORANGE}>Sooner.</span>
            </p>
            <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-sand-light/85 leading-relaxed">
              AI-driven drafting and a shared workspace for annual and impact reports. Drafted in your
              voice from your data, then refined, reviewed and signed off by your team and ours.
            </p>

            {/* Report type toggle: switches the video and everything below it */}
            <div
              role="group"
              aria-label="Choose a report type"
              className="mt-10 inline-flex p-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg"
            >
              {reportTypeOrder.map((type) => {
                const Icon = ICONS[reportTypes[type].icon];
                const isActive = type === reportType;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectReportType(type)}
                    className={`inline-flex items-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? 'bg-white text-forest-deep shadow-md'
                        : 'text-sand-light/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    {reportTypes[type].label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Video, overlapping the hero */}
      <section id="video" className="relative z-10 -mt-32 md:-mt-48 pb-16 md:pb-20 bg-transparent scroll-mt-28">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.default, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Keyed so a switch stops the other video and shows the new poster */}
            <VideoPlayer
              key={reportType}
              ref={videoRef}
              src={video.src}
              poster={video.poster}
              title={video.title}
              duration={video.duration}
              lightPoster
              className="shadow-2xl ring-1 ring-black/5"
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-accent-hover uppercase tracking-wider mr-1">
                Jump to
              </span>
              {video.chapters.map((chapter) => (
                <button
                  key={chapter.label}
                  type="button"
                  onClick={() => videoRef.current?.playFrom(chapter.time)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forest/20 bg-white text-sm text-forest-deep hover:border-accent hover:text-accent-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <PlayCircle className="w-4 h-4" aria-hidden="true" />
                  {chapter.label}
                  <span className="text-charcoal-light tabular-nums">{formatTime(chapter.time)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Page contents: sticky dropdown on smaller screens, sidebar on large screens.
          Keyed by report type so they track the sections of the version on screen. */}
      <div className="xl:grid xl:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="xl:hidden sticky top-[72px] md:top-20 z-30 bg-white/95 backdrop-blur-sm border-y border-forest/10 shadow-sm">
          <Container>
            <PageContents key={reportType} sections={pageSections} variant="dropdown" />
          </Container>
        </div>
        <aside className="hidden xl:block bg-cream border-r border-forest/10">
          <div className="sticky top-28 px-6 py-10">
            <PageContents key={reportType} sections={pageSections} />
          </div>
        </aside>

        <motion.div
          key={reportType}
          initial={hasSwitched ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Why this report */}
          <section id="report-overview" className="py-20 md:py-28 bg-sand-light scroll-mt-32 xl:scroll-mt-20">
            <Container>
              {reportType === 'impact'
                ? <ImpactOverview overview={content.overview} />
                : <AnnualOverview overview={content.overview} />}
            </Container>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-20 md:py-28 bg-cream scroll-mt-32 xl:scroll-mt-20">
            <Container>
              <SectionHeading
                label="How it works"
                title="From your files to a finished report"
                subtitle={content.howItWorks.subtitle}
                className="mb-16"
              />
              <StepViewer groups={content.howItWorks.steps} />
            </Container>
          </section>

          {/* The Finished Report */}
          <section id="finished-report" className="py-20 md:py-28 bg-sand-light scroll-mt-32 xl:scroll-mt-20">
            <Container>
              <SectionHeading
                label="The finished report"
                title="Every page designed in your brand"
                subtitle={content.finished.subtitle}
                className="mb-16"
              />
              <div className="grid lg:grid-cols-2 gap-8">
                {content.finished.samples.map((sample, index) => (
                  <motion.figure
                    key={sample.src}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                  >
                    <img
                      src={sample.src}
                      alt={sample.alt}
                      width={sample.width}
                      height={sample.height}
                      loading="lazy"
                      className="w-full h-auto"
                    />
                    <figcaption className="mt-3 text-center text-sm text-charcoal-light">
                      {sample.caption}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
              <div className="mt-12 max-w-5xl mx-auto text-center">
                <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider mb-4">
                  {content.finished.chaptersLabel}
                </p>
                <ol className="flex flex-wrap justify-center gap-2">
                  {content.finished.chapters.map((chapter, index) => (
                    <li
                      key={chapter}
                      className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white border border-forest/10 text-sm text-forest-deep"
                    >
                      <span className="w-6 h-6 rounded-full bg-forest-deep text-white text-xs flex items-center justify-center tabular-nums">
                        {index + 1}
                      </span>
                      {chapter}
                    </li>
                  ))}
                </ol>
              </div>
            </Container>
          </section>

          {/* Why RebalanceReporting */}
          <section id="why-rebalance-reporting" className="py-20 md:py-28 bg-forest-deep text-white relative overflow-hidden scroll-mt-32 xl:scroll-mt-20">
            <div className="absolute inset-0 noise-overlay" />
            <Container className="relative z-10">
              <SectionHeading
                label="Why RebalanceReporting"
                title="More time for review and impact"
                subtitle="With the drafting taken care of, your team can focus on accuracy, insight and impact."
                theme="dark"
                className="mb-16"
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {valueProps.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sand-light/80 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Container>
          </section>

          {/* What You Get */}
          <section id="what-you-get" className="py-20 md:py-28 bg-cream scroll-mt-32 xl:scroll-mt-20">
            <Container>
              <SectionHeading
                label="What you get"
                title="Smart drafting, one shared portal"
                className="mb-16"
              />
              <div className="grid lg:grid-cols-2 gap-8">
                {[
                  { icon: Sparkles, title: 'How your draft is built', items: content.capabilities.draft },
                  { icon: LayoutDashboard, title: 'Your team portal', items: content.capabilities.portal },
                ].map((group, index) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card variant="default" padding="large" className="h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center">
                          <group.icon className="w-6 h-6 text-forest" aria-hidden="true" />
                        </div>
                        <h3 className="font-sans font-bold text-xl text-forest-deep">
                          {group.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-charcoal-light">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button href="/#contact-and-quote" variant="primary" icon={ArrowRight}>
                  Request a Demo
                </Button>
              </div>
            </Container>
          </section>
        </motion.div>
      </div>

      <CTABanner
        title="Ready for your next report?"
        subtitle={content.cta}
        ctaText="Get in Touch"
        ctaHref="/#contact-and-quote"
        variant="accent"
      />
    </PageWrapper>
  );
};

export default RebalanceReportingPage;
