import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Droplets, 
  Camera, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Star,
  Menu,
  X,
  ArrowRight,
  Shield,
  Wrench,
  TreePine
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// Schema Markup for SEO
const SchemaMarkup = () => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": ["Plumber", "LocalBusiness"],
    "name": "Plumber Blocked Drains Melbourne",
    "url": "https://plumberblockeddrains.vercel.app/",
    "description": "Blocked drain specialists in Melbourne. Hydro-jetting, CCTV inspections, same-day service. No call-out fees.",
    "telephone": "+61400123456",
    "areaServed": {
      "@type": "City",
      "name": "Melbourne",
      "containedIn": "Victoria, Australia"
    },
    "serviceType": ["Blocked Drain Clearing", "Hydro-Jetting", "CCTV Drain Inspection", "Tree Root Removal"],
    "priceRange": "$$",
    "openingHours": "Mo-Su 00:00-23:59",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Drain Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Blocked Drain Clearing"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CCTV Drain Inspection"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hydro-Jetting"
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast can you get here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer fast same-day service across Melbourne. If your drain is backing up or overflowing, we treat it as urgent and can often arrive within the hour, depending on your location."
        }
      },
      {
        "@type": "Question",
        "name": "Do you charge call-out fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No call-out fees ever. We diagnose the problem and tell you the price before starting any work. No surprises. No hidden extras."
        }
      },
      {
        "@type": "Question",
        "name": "Will you show me what's causing the blockage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes we use a CCTV drain inspection camera and show you live footage of exactly what's going on. You'll see the issue clearly before approving anything."
        }
      },
      {
        "@type": "Question",
        "name": "How do you clear blocked drains?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use high-pressure Hydro-Jetting to blast through tree roots, grease, wipes and built-up debris inside the pipe. This gives a proper long-lasting clear solution not just a short-term unblock."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
};

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "0400 123 456";

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-white text-lg leading-tight">Plumber Blocked Drains</div>
              <div className="text-xs text-brand-blue">Melbourne Specialists</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="text-gray-300 hover:text-white transition">Services</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
            <a href="#areas" className="text-gray-300 hover:text-white transition">Areas</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2 rounded-full font-semibold text-sm transition"
            >
              <Phone className="w-4 h-4" />
              {phoneNumber}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            <nav className="flex flex-col gap-3">
              <a href="#services" onClick={() => setIsOpen(false)} className="text-gray-300">Services</a>
              <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-300">How It Works</a>
              <a href="#faq" onClick={() => setIsOpen(false)} className="text-gray-300">FAQ</a>
              <a href="#areas" onClick={() => setIsOpen(false)} className="text-gray-300">Areas</a>
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full font-semibold w-fit"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

// Hero Component
const Hero = () => {
  const phoneNumber = "0400 123 456";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-dark to-slate-900 py-16 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Same-Day Service Available
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Blocked Drains{' '}
              <span className="text-gradient">Cleared Fast</span>
            </h1>

            <p className="text-gray-300 text-lg mb-6">
              Melbourne's blocked drain specialists. Hydro-jetting & CCTV inspection. 
              No call-out fees. We show you exactly what's causing the blockage before we start.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-6 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-brand-green/25"
              >
                <Phone className="w-5 h-5" />
                Call {phoneNumber}
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-full font-semibold transition"
              >
                Get a Quote
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-green" />
                <span>No Call-Out Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-green" />
                <span>Upfront Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-green" />
                <span>24/7 Available</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Service Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Our No-BS Guarantee</div>
                  <div className="text-sm text-gray-400">Honest service, every time</div>
                </div>
              </div>

              <ul className="space-y-4 mb-6">
                {[
                  "No call-out fees - ever",
                  "Show you the problem with CCTV camera",
                  "Fixed price before we start",
                  "Proper long-lasting solutions",
                  "No pressure, no surprises"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">Real reviews from Melbourne homeowners</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const Services = () => {
  const services = [
    {
      icon: Droplets,
      title: "Hydro-Jetting",
      description: "High-pressure water blasting clears tree roots, grease, and debris. Long-lasting results, not just a quick fix.",
      price: "From $250"
    },
    {
      icon: Camera,
      title: "CCTV Inspection",
      description: "See exactly what's blocking your drain with our camera inspection. We show you live footage before any work.",
      price: "From $150"
    },
    {
      icon: Wrench,
      title: "Drain Clearing",
      description: "Fast clearing of blocked sinks, toilets, showers, and main drains. Same-day service available.",
      price: "From $200"
    },
    {
      icon: TreePine,
      title: "Tree Root Removal",
      description: "Specialized equipment cuts and flushes tree roots safely, restoring full flow and preventing repeat blockages.",
      price: "Custom Quote"
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Drain Services
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional drain clearing using the latest equipment. 
            We don't just unblock - we solve the problem properly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-blue/50 transition group"
            >
              <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-blue/30 transition">
                <service.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="text-brand-green font-semibold">{service.price}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      num: "1",
      title: "Call or Book Online",
      desc: "Tell us about your blocked drain. We'll give you a rough estimate and book a time that works for you."
    },
    {
      num: "2",
      title: "We Inspect with CCTV",
      desc: "We use a camera to show you exactly what's causing the blockage. No guesswork - you see the problem."
    },
    {
      num: "3",
      title: "Clear with Hydro-Jet",
 desc: "High-pressure water blasting clears roots, grease, and debris. Proper cleaning, not just a poke."
    },
    {
      num: "4",
      title: "Final Check & Guarantee",
      desc: "We verify the drain is flowing perfectly. Our work is guaranteed - if it blocks again, we come back."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simple, transparent process from call to clear drain.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-brand-blue text-white font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How fast can you get here?",
      a: "We offer fast same-day service across Melbourne. If your drain is backing up or overflowing, we treat it as urgent and can often arrive within the hour, depending on your location."
    },
    {
      q: "Do you charge call-out fees?",
      a: "No call-out fees ever. We diagnose the problem and tell you the price before starting any work. No surprises. No hidden extras."
    },
    {
      q: "Will you show me what's causing the blockage?",
      a: "Yes we use a CCTV drain inspection camera and show you live footage of exactly what's going on. You'll see the issue clearly before approving anything."
    },
    {
      q: "How do you clear blocked drains?",
      a: "We use high-pressure Hydro-Jetting to blast through tree roots, grease, wipes and built-up debris inside the pipe. This gives a proper long-lasting clear solution not just a short-term unblock."
    },
    {
      q: "What areas do you service?",
      a: "We're based in Melbourne's South-East and service all across Melbourne. If you're close — we can get to you."
    },
    {
      q: "How much does it cost to clear a drain?",
      a: "Prices vary depending on what's causing the blockage and how deep it is. But you'll always know the full price upfront before we begin. No pressure."
    },
    {
      q: "Can you remove tree roots from drains?",
      a: "Yes this is one of our specialties. Hydro-Jetting cuts and flushes roots safely, restoring full flow and preventing repeat blockages."
    },
    {
      q: "Do you do weekends and after-hours?",
      a: "Yes drains don't block on a schedule. Call us and we'll organise the fastest possible response, even outside normal hours."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-900">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Got Questions?
          </h2>
          <p className="text-gray-400">
            We've answered the most common things homeowners ask.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <span className="text-gray-400 text-xl flex-shrink-0">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4"
                >
                  <p className="text-gray-400">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Areas Section
const Areas = () => {
  const areas = [
    "South-East Melbourne", "CBD", "Eastern Suburbs", 
    "Northern Suburbs", "Western Suburbs", "Bayside",
    "Cranbourne", "Frankston", "Berwick", 
    "Narre Warren", "Dandenong", "Springvale"
  ];

  return (
    <section id="areas" className="py-16 md:py-24 bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Areas We Service
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based in Melbourne's South-East, we service all across Melbourne metro area.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {areas.map((area, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300"
            >
              <MapPin className="w-4 h-4 text-brand-blue" />
              {area}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Not sure if we service your area? Give us a call!
          </p>
          <a 
            href="tel:0400123456"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3 rounded-full font-bold transition"
          >
            <Phone className="w-5 h-5" />
            Call 0400 123 456
          </a>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-brand-dark">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Need a Blocked Drain Cleared?
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Don't wait for it to get worse. Call now for same-day service across Melbourne.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:0400123456"
            className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-brand-green/25"
          >
            <Phone className="w-5 h-5" />
            Call 0400 123 456
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-blue" />
            <span>Same-Day Service</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-blue" />
            <span>No Call-Out Fee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-blue" />
            <span>Upfront Pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sticky Call Button for Mobile
const StickyCallButton = () => {
  const phoneNumber = "0400 123 456";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur border-t border-white/10 p-4 md:hidden">
      <a 
        href={`tel:${phoneNumber.replace(/\s/g, '')}`}
        className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white w-full py-4 rounded-full font-bold text-lg transition shadow-lg shadow-brand-green/25"
      >
        <Phone className="w-5 h-5" />
        Call Now: {phoneNumber}
      </a>
    </div>
  );
};

// Breadcrumb Schema for SEO
const BreadcrumbSchema = () => {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plumberblockeddrains.vercel.app/" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://plumberblockeddrains.vercel.app/#services" },
      { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://plumberblockeddrains.vercel.app/#faq" }
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
  );
};

// Footer
const Footer = () => {
  const phoneNumber = "0400 123 456";
  
  return (
    <footer className="bg-brand-dark border-t border-white/10 py-8 md:pb-8 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Plumber Blocked Drains</span>
          </div>
          
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>Melbourne's Blocked Drain Specialists</p>
            <p className="mt-1 flex items-center justify-center md:justify-end gap-2">
              <Phone className="w-4 h-4 text-brand-green" />
              <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="hover:text-white transition">
                {phoneNumber}
              </a>
            </p>
            <p className="mt-1">© 2026 - All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <SchemaMarkup />
      <BreadcrumbSchema />
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <FAQ />
        <Areas />
        <Contact />
      </main>
      <Footer />
      <StickyCallButton />
    </div>
  );
}

export default App;