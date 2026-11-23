import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * PageContents - "On this page" navigation for the Annual Reporting page.
 * Renders a sticky sidebar on large screens and a sticky dropdown on small screens.
 * Each section is { id, label, children? }; a parent's link scrolls to its first child.
 */
const flatten = (sections) =>
  sections.flatMap((section) => (section.children ? section.children : [section]));

const PageContents = ({ sections, variant = 'sidebar' }) => {
  const allItems = flatten(sections);
  const [activeId, setActiveId] = useState(allItems[0]?.id);
  const [expanded, setExpanded] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Highlight the section currently in view
  useEffect(() => {
    const elements = allItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (event, id) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
    setActiveId(id);
    setIsMenuOpen(false);
  };

  const isGroupActive = (section) =>
    section.children?.some((child) => child.id === activeId);

  // Parents stay open while one of their sections is in view, or when toggled open
  const isExpanded = (section) =>
    expanded[section.id] ?? isGroupActive(section) ?? false;

  const toggle = (section) =>
    setExpanded((prev) => ({ ...prev, [section.id]: !isExpanded(section) }));

  const linkClass = (active, nested = false) => `
    block py-1.5 text-sm transition-colors
    ${nested ? 'pl-4 border-l-2' : ''}
    ${active
      ? `text-forest-deep font-semibold ${nested ? 'border-accent' : ''}`
      : `text-charcoal-light hover:text-forest ${nested ? 'border-forest/10' : ''}`}
  `;

  const list = (
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          {section.children ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`#${section.children[0].id}`}
                  onClick={(e) => {
                    setExpanded((prev) => ({ ...prev, [section.id]: true }));
                    scrollTo(e, section.children[0].id);
                  }}
                  className={linkClass(isGroupActive(section))}
                >
                  {section.label}
                </a>
                <button
                  type="button"
                  onClick={() => toggle(section)}
                  className="p-1 text-charcoal-light hover:text-forest"
                  aria-label={`${isExpanded(section) ? 'Collapse' : 'Expand'} ${section.label}`}
                  aria-expanded={isExpanded(section)}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded(section) ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              {isExpanded(section) && (
                <ul className="mt-1 mb-2 space-y-0.5">
                  {section.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        onClick={(e) => scrollTo(e, child.id)}
                        className={linkClass(child.id === activeId, true)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <a
              href={`#${section.id}`}
              onClick={(e) => scrollTo(e, section.id)}
              className={linkClass(section.id === activeId)}
            >
              {section.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  if (variant === 'dropdown') {
    const activeLabel = allItems.find((item) => item.id === activeId)?.label;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="w-full flex items-center justify-between gap-3 py-3 text-left"
          aria-expanded={isMenuOpen}
        >
          <span className="text-sm">
            <span className="font-semibold text-accent-hover uppercase tracking-wider text-xs mr-2">
              On this page
            </span>
            <span className="text-forest-deep font-medium">{activeLabel}</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-forest flex-shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border border-forest/10 rounded-b-xl shadow-lg p-4 max-h-[60vh] overflow-y-auto">
            {list}
          </div>
        )}
      </div>
    );
  }

  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider mb-4">
        On this page
      </p>
      {list}
    </nav>
  );
};

export default PageContents;
