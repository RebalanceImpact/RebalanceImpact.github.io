import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../../hooks';
import { vennDiagramData } from '../../../data/team';

const VennDiagram = () => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });
  const [hoveredCircle, setHoveredCircle] = useState(null);

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (delay) => ({
      scale: 1,
      opacity: 1,
      transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { delay: delay + 0.3, duration: 0.5 },
    }),
  };

  // Circle configurations with updated colors
  const circles = [
    {
      id: 'top',
      data: vennDiagramData.topCircle,
      position: 'absolute top-0 left-1/2 -translate-x-1/2',
      borderColor: 'border-forest-deep',
      bgColor: 'bg-forest-deep/5',
      hoverBgColor: 'bg-forest-deep/15',
      delay: 0,
    },
    {
      id: 'bottomLeft',
      data: vennDiagramData.bottomLeftCircle,
      position: 'absolute bottom-0 left-[10%]',
      borderColor: 'border-accent',
      bgColor: 'bg-accent/5',
      hoverBgColor: 'bg-accent/15',
      delay: 0.2,
    },
    {
      id: 'bottomRight',
      data: vennDiagramData.bottomRightCircle,
      position: 'absolute bottom-0 right-[10%]',
      borderColor: 'border-sage',
      bgColor: 'bg-sage/20',
      hoverBgColor: 'bg-sage/40',
      delay: 0.4,
    },
  ];

  return (
    <div ref={ref} className="relative w-full max-w-3xl mx-auto py-8">
      {/* Desktop Venn Layout */}
      <div className="hidden md:block relative" style={{ height: '500px' }}>
        {circles.map((circle) => (
          <motion.div
            key={circle.id}
            custom={circle.delay}
            variants={circleVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            onMouseEnter={() => setHoveredCircle(circle.id)}
            onMouseLeave={() => setHoveredCircle(null)}
            className={`
              ${circle.position}
              w-72 h-72 rounded-full border-8 ${circle.borderColor}
              ${hoveredCircle === circle.id ? circle.hoverBgColor : circle.bgColor}
              bg-white shadow-lg flex flex-col items-center justify-center p-6
              cursor-pointer transition-all duration-300 ease-out
            `}
            style={{
              zIndex: hoveredCircle === circle.id ? 30 : 10,
              transform: hoveredCircle === circle.id
                ? `${circle.id === 'top' ? 'translateX(-50%)' : ''} scale(1.15)`
                : `${circle.id === 'top' ? 'translateX(-50%)' : ''} scale(1)`,
            }}
            whileHover={{
              scale: 1.15,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              custom={circle.delay}
              variants={textVariants}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="text-center"
            >
              <h4 className="font-sans font-bold text-lg text-forest-deep mb-3">
                {circle.data.title}
              </h4>
              <ul className="text-sm text-charcoal-light space-y-1">
                {circle.data.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}

        {/* Center Intersection Label - Removed per client request */}
      </div>

      {/* Mobile Layout - Stacked Cards */}
      <div className="md:hidden space-y-6">
        {[
          { data: vennDiagramData.topCircle, borderColor: 'border-forest-deep', bgColor: 'bg-forest-deep/5' },
          { data: vennDiagramData.bottomLeftCircle, borderColor: 'border-accent', bgColor: 'bg-accent/5' },
          { data: vennDiagramData.bottomRightCircle, borderColor: 'border-sage', bgColor: 'bg-sage/10' },
        ].map((circle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`p-6 rounded-xl bg-white shadow-lg border-l-4 ${circle.borderColor}`}
          >
            <h4 className="font-sans font-bold text-lg text-forest-deep mb-3">
              {circle.data.title}
            </h4>
            <ul className="text-sm text-charcoal-light space-y-1">
              {circle.data.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Mobile Intersection Card - Removed per client request */}
      </div>
    </div>
  );
};

export default VennDiagram;
