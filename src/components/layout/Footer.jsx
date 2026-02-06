import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { footerLinks, contactInfo } from '../../config/navigation';
import Container from '../ui/Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-forest-deep text-white">
      {/* Main Footer Content */}
      <Container className="py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src="/assets/images/small_white.png"
                alt="Rebalance Impact"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/40x40/FFFFFF/334C33?text=R';
                }}
              />
              <span className="text-xl font-display">Rebalance Impact</span>
            </Link>
            <p className="text-sand-light/80 text-sm leading-relaxed">
              Expert ESG consulting combining climate research, financial expertise,
              and environmental data to deliver practical sustainable solutions.
            </p>
          </motion.div>

          {/* Services Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-sans font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sand-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-sans font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sand-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-sans font-semibold text-lg mb-4 mt-8">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sand-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-sans font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-sand-light/80 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 text-accent" />
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sand-light/80 text-sm">
                <MapPin className="w-5 h-5 text-accent" />
                {contactInfo.location}
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-sans font-semibold text-lg mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sand-light/60">
            <p>© {currentYear} Rebalance Impact. All rights reserved.</p>
            <p>
              Designed with purpose for sustainable impact.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
