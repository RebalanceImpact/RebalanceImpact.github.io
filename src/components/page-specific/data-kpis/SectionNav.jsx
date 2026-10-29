import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '../../ui/Container';

/**
 * "On this page" contents for the Data Solutions page: a sticky sidebar on
 * large screens and a sticky dropdown at the top on smaller screens. Render it
 * as the first children of a `xl:grid-cols-[14rem_minmax(0,1fr)]` grid, with
 * the page sections in the second column.
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

  const list = (
    <ul className="space-y-5">
      {sections.map((group) => (
        <li key={group.id}>
          <a
            href={`#${group.children[0].id}`}
            onClick={(e) => go(e, group.children[0].id)}
            className={`block text-sm font-bold transition-colors ${
              group.children.some((c) => c.id === activeId) ? 'text-forest-deep' : 'text-forest hover:text-forest-deep'
            }`}
          >
            {group.label}
          </a>
          <ul className="mt-2 space-y-0.5">
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
  );

  return (
    <>
      <div className="xl:hidden sticky top-[72px] md:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-forest/10 shadow-sm">
        <Container>
          <div className="relative">
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
                {list}
              </div>
            )}
          </div>
        </Container>
      </div>

      <aside className="hidden xl:block bg-cream border-r border-forest/10">
        <nav aria-label="On this page" className="sticky top-28 px-6 py-10">
          <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider mb-4">On this page</p>
          {list}
        </nav>
      </aside>
    </>
  );
};

export default SectionNav;
