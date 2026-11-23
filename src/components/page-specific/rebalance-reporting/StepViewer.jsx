import { useState } from 'react';

/**
 * StepViewer - "How it works" for the RebalanceReporting page.
 * Large screens: pick a step on the left to see that screen of the app on the right.
 * Smaller screens: every step is listed with its screen.
 * groups: [{ group, steps: [{ number, title, description, image, width, height, alt }] }]
 */
const StepViewer = ({ groups }) => {
  const steps = groups.flatMap((group) => group.steps);
  const [activeNumber, setActiveNumber] = useState(steps[0]?.number);

  const groupLabel = (label) => (
    <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider mb-3">
      {label}
    </p>
  );

  return (
    <>
      {/* Large screens */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 items-center">
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.group}>
              {groupLabel(group.group)}
              <ul className="space-y-2">
                {group.steps.map((step) => {
                  const isActive = step.number === activeNumber;
                  return (
                    <li key={step.number}>
                      <button
                        type="button"
                        onClick={() => setActiveNumber(step.number)}
                        aria-pressed={isActive}
                        className={`w-full text-left rounded-xl px-5 py-4 border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          isActive
                            ? 'bg-white border-forest/10 shadow-md'
                            : 'border-transparent hover:bg-white/60'
                        }`}
                      >
                        <span className="flex items-baseline gap-4">
                          <span
                            className={`font-display text-2xl transition-colors ${
                              isActive ? 'text-accent' : 'text-sage'
                            }`}
                          >
                            {step.number}
                          </span>
                          <span>
                            <span className="block font-sans font-bold text-lg text-forest-deep">
                              {step.title}
                            </span>
                            {isActive && (
                              <span className="block mt-1 text-sm text-charcoal-light leading-relaxed">
                                {step.description}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* All screens load together so switching is instant; only the chosen one shows */}
        <div className="relative" style={{ aspectRatio: `${steps[0].width} / ${steps[0].height}` }}>
          {steps.map((step) => {
            const isActive = step.number === activeNumber;
            return (
              <img
                key={step.number}
                src={step.image}
                alt={isActive ? step.alt : ''}
                aria-hidden={!isActive}
                width={step.width}
                height={step.height}
                loading="lazy"
                className={`absolute top-0 left-0 w-full h-auto rounded-xl shadow-xl transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Smaller screens */}
      <div className="lg:hidden space-y-12">
        {groups.map((group) => (
          <div key={group.group}>
            {groupLabel(group.group)}
            <ol className="space-y-10">
              {group.steps.map((step) => (
                <li key={step.number}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-2xl text-accent">{step.number}</span>
                    <h3 className="font-sans font-bold text-lg text-forest-deep">{step.title}</h3>
                  </div>
                  <p className="text-charcoal-light leading-relaxed mb-4">{step.description}</p>
                  <img
                    src={step.image}
                    alt={step.alt}
                    width={step.width}
                    height={step.height}
                    loading="lazy"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
};

export default StepViewer;
