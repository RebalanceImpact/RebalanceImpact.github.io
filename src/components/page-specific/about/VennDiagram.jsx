import { motion } from 'framer-motion';
import { useScrollReveal } from '../../../hooks';
import { vennDiagramData } from '../../../data/team';

const VennDiagram = () => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });

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

  return (
    <div ref={ref} className="relative w-full max-w-3xl mx-auto py-8">
      {/* Desktop Venn Layout */}
      <div className="hidden md:block relative" style={{ height: '500px' }}>
        {/* Top Circle - Industry Experience */}
        <motion.div
          custom={0}
          variants={circleVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border-8 border-forest bg-white/90 shadow-lg flex flex-col items-center justify-center p-6 z-10"
        >
          <motion.div
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="text-center"
          >
            <h4 className="font-sans font-bold text-lg text-forest-deep mb-3">
              {vennDiagramData.topCircle.title}
            </h4>
            <ul className="text-sm text-charcoal-light space-y-1">
              {vennDiagramData.topCircle.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Left Circle - Financial Expertise */}
        <motion.div
          custom={0.2}
          variants={circleVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="absolute bottom-0 left-[10%] w-72 h-72 rounded-full border-8 border-accent bg-white/90 shadow-lg flex flex-col items-center justify-center p-6 z-10"
        >
          <motion.div
            custom={0.2}
            variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="text-center"
          >
            <h4 className="font-sans font-bold text-lg text-forest-deep mb-3">
              {vennDiagramData.bottomLeftCircle.title}
            </h4>
            <ul className="text-sm text-charcoal-light space-y-1">
              {vennDiagramData.bottomLeftCircle.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Right Circle - Environmental Science */}
        <motion.div
          custom={0.4}
          variants={circleVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="absolute bottom-0 right-[10%] w-72 h-72 rounded-full border-8 border-sage bg-white/90 shadow-lg flex flex-col items-center justify-center p-6 z-10"
        >
          <motion.div
            custom={0.4}
            variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="text-center"
          >
            <h4 className="font-sans font-bold text-lg text-forest-deep mb-3">
              {vennDiagramData.bottomRightCircle.title}
            </h4>
            <ul className="text-sm text-charcoal-light space-y-1">
              {vennDiagramData.bottomRightCircle.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Center Intersection Label */}
        <motion.div
          custom={0.8}
          variants={textVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-forest text-white px-6 py-4 rounded-xl shadow-xl z-20 max-w-[200px] text-center"
        >
          <p className="font-semibold text-sm">{vennDiagramData.intersection.title}</p>
        </motion.div>
      </div>

      {/* Mobile Layout - Stacked Cards */}
      <div className="md:hidden space-y-6">
        {[
          { data: vennDiagramData.topCircle, borderColor: 'border-forest' },
          { data: vennDiagramData.bottomLeftCircle, borderColor: 'border-accent' },
          { data: vennDiagramData.bottomRightCircle, borderColor: 'border-sage' },
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

        {/* Intersection Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-6 rounded-xl bg-forest text-white text-center"
        >
          <p className="font-semibold">{vennDiagramData.intersection.title}</p>
          <p className="text-sm text-sand-light/80 mt-2">
            {vennDiagramData.intersection.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VennDiagram;
