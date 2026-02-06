import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { variants, transitions } from '../../config/motion';

/**
 * ContactForm component - Form with validation
 */
const ContactForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'message':
        return value.trim() ? '' : 'Message is required';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, company: true, message: true });

    if (Object.keys(newErrors).length > 0) return;

    setStatus('loading');

    // Simulate form submission - replace with actual endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTouched({});
    } catch (error) {
      setStatus('error');
    }
  };

  const inputClasses = (name) => `
    w-full px-4 py-3
    bg-white border-2 rounded-lg
    font-sans text-charcoal placeholder:text-charcoal-light/50
    transition-all duration-300
    focus:outline-none focus:ring-0
    ${
      errors[name] && touched[name]
        ? 'border-red-400 focus:border-red-500'
        : 'border-sage/30 focus:border-accent'
    }
  `;

  return (
    <motion.form
      variants={variants.staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {/* Name Field */}
      <motion.div variants={variants.fadeUp} transition={transitions.default}>
        <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your full name"
          className={inputClasses('name')}
        />
        {errors.name && touched.name && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </motion.div>

      {/* Email Field */}
      <motion.div variants={variants.fadeUp} transition={transitions.default}>
        <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your.email@company.com"
          className={inputClasses('email')}
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </motion.div>

      {/* Company Field */}
      <motion.div variants={variants.fadeUp} transition={transitions.default}>
        <label htmlFor="company" className="block text-sm font-semibold text-charcoal mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your company name"
          className={inputClasses('company')}
        />
      </motion.div>

      {/* Message Field */}
      <motion.div variants={variants.fadeUp} transition={transitions.default}>
        <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="How can we help you with your ESG journey?"
          className={`${inputClasses('message')} resize-none`}
        />
        {errors.message && touched.message && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.message}
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={variants.fadeUp} transition={transitions.default}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
          loading={status === 'loading'}
          disabled={status === 'loading'}
          icon={status === 'success' ? CheckCircle : Send}
          iconPosition="right"
        >
          {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
        </Button>
      </motion.div>

      {/* Success/Error Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Thank you! We&apos;ll be in touch soon.
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          Something went wrong. Please try again.
        </motion.div>
      )}
    </motion.form>
  );
};

export default ContactForm;
