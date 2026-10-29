import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '../../ui/Container';

/**
 * Sticky "On this page" bar for the Data Solutions page: grouped links in one
 * row on large screens, and a dropdown of the same groups on smaller screens.
 */
const SectionNav = ({ sections }) => {
  const items = sections.flatMap((s) => s.children);
  const [activeId, setActiveId] = useState(items[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveId(entry.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
    setActiveId(id);
    setMenuOpen(false);
  };

  return (
    <div className="sticky top-[72px] md:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-forest/10 shadow-sm">
      <Container>
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="w-full flex items-center justify-between gap-3 py-3 text-left"
            aria-expanded={menuOpen}
          >
            <span className="text-sm">
              <span className="font-semibold text-accent-hover uppercase tracking-wider text-xs mr-2">On this page</span>
              <span className="text-forest-deep font-medium">{items.find((i) => i.id === activeId)?.label}</span>
            </span>
            <ChevronDown className={`w-5 h-5 text-forest flex-shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {menuOpen && (
            <div className="absolute left-0 right-0 top-full bg-white border border-forest/10 rounded-b-xl shadow-lg p-4 max-h-[60vh] overflow-y-auto">
              <ul className="space-y-3">
                {sections.map((group) => (
                  <li key={group.id}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">{group.label}</p>
                    <ul className="mt-1 space-y-0.5">
                      {group.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={(e) => go(e, child.id)}
                            className={`block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                              child.id === activeId
                                ? 'border-accent font-semibold text-forest-deep'
                                : 'border-forest/10 text-charcoal-light hover:text-forest'
                            }`}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <nav aria-label="On this page" className="hidden lg:flex items-center gap-10 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-hover">On this page</span>
          {sections.map((group) => {
            const groupActive = group.children.some((c) => c.id === activeId);
            return (
              <div key={group.id} className="flex items-center gap-4">
                <a
                  href={`#${group.children[0].id}`}
                  onClick={(e) => go(e, group.children[0].id)}
                  className={`text-sm font-bold transition-colors ${groupActive ? 'text-forest-deep' : 'text-forest hover:text-forest-deep'}`}
                >
                  {group.label}
                </a>
                <span className="h-4 w-px bg-forest/15" aria-hidden="true" />
                {group.children.map((child) => (
                  <a
                    key={child.id}
                    href={`#${child.id}`}
                    onClick={(e) => go(e, child.id)}
                    className={`border-b-2 pb-0.5 text-sm transition-colors ${
                      child.id === activeId
                        ? 'border-accent font-semibold text-forest-deep'
                        : 'border-transparent text-charcoal-light hover:text-forest'
                    }`}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
      </Container>
    </div>
  );
};

export default SectionNav;
