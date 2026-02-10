import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Droplets, Camera, Clock, CheckCircle, MapPin, Star,
  ChevronDown, DollarSign, Video, Shield, Users, Award,
  Sparkles, Home, Wrench, TreeDeciduous, BadgeCheck, Truck, Zap
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Brand Colors
const colors = {
  burgundy: '#632424',
  gold: '#EBC95E',
  bronze: '#AD8F56',
  white: '#FFFFFF',
  black: '#0a0a0a',
  darkGray: '#111111'
};

// Logo Component with Plumbing Icon
const Logo = ({ size = 'md' }) => {
  const sizes = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-20 h-20', xl: 'w-24 h-24' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' };
  
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${sizes[size]} rounded-2xl overflow-hidden border-2 relative flex-shrink-0 bg-black`}
        style={{ borderColor: colors.gold }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src="/plumbing-logo.svg" 
          alt="Blockage Masters"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div>
        <div className={`font-bold text-white ${textSizes[size]}`}>Blockage Masters</div>
        <div className="text-xs" style={{ color: colors.gold }}>Melbourne's Drain Specialists</div>
      </div>
    </div>
  );
};

// Water Flow Background - Enhanced with bubbles and ripples
const WaterFlowBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const bubbles = [];
    
    // Gold water particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 300,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.4 + 0.1,
        wobble: Math.random() * Math.PI * 2
      });
    }
    
    // Rising bubbles
    for (let i = 0; i < 20; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        size: Math.random() * 8 + 3,
        speedY: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.15 + 0.05,
        pulse: Math.random() * Math.PI * 2
      });
    }
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water particles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01 + p.wobble) * 0.3;
        p.wobble += 0.02;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(235, 201, 94, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(235, 201, 94, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // Draw bubbles
      bubbles.forEach(b => {
        b.y -= b.speedY;
        b.pulse += 0.05;
        const pulseSize = b.size + Math.sin(b.pulse) * 1;
        
        if (b.y < -20) {
          b.y = canvas.height + 20;
          b.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(235, 201, 94, ${b.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Inner highlight
        ctx.beginPath();
        ctx.arc(b.x - pulseSize * 0.3, b.y - pulseSize * 0.3, pulseSize * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.5})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }} />;
};

// Animated Counter
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{count}{suffix}</span>;
};

// Scroll Reveal
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>
      {children}
    </motion.div>
  );
};

// Enhanced SEO Schema with Suburbs
const SchemaMarkup = () => {
  const suburbs = [
    "Bentleigh", "Brighton", "Camberwell", "Caulfield", "Chadstone",
    "Glen Waverley", "Hawthorn", "Malvern", "Mount Waverley", "Oakleigh",
    "Richmond", "South Yarra", "St Kilda", "Toorak", "Carnegie",
    "Murrumbeena", "Hughesdale", "Clayton", "Notting Hill", "Wheelers Hill"
  ];
  
  const areaServed = suburbs.map(suburb => ({
    "@type": "City",
    "name": suburb,
    "containedInPlace": {
      "@type": "City",
      "name": "Melbourne",
      "containedInPlace": {
        "@type": "State",
        "name": "Victoria",
        "containedInPlace": {
          "@type": "Country",
          "name": "Australia"
        }
      }
    }
  }));
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Plumber",
        "@id": "https://plumber-blocked-drains.vercel.app/#plumber",
        "name": "Blockage Masters - Melbourne Drain Specialists",
        "url": "https://plumber-blocked-drains.vercel.app/",
        "logo": "https://plumber-blocked-drains.vercel.app/logo.jpg",
        "image": "https://plumber-blocked-drains.vercel.app/logo.jpg",
        "description": "Melbourne's trusted drain specialists. Hydro-jetting, CCTV inspections, same-day service. No call-out fees. Serving Bentleigh, Brighton, Camberwell, Hawthorn and all Melbourne suburbs.",
        "telephone": "+61400123456",
        "priceRange": "$$",
        "openingHours": ["Mo-Su 00:00-23:59"],
        "areaServed": areaServed,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Melbourne",
          "addressRegion": "VIC",
          "addressCountry": "AU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -37.8136,
          "longitude": 144.9631
        },
        "serviceType": [
          "Blocked Drain Clearing",
          "Hydro-Jetting",
          "CCTV Drain Inspection",
          "Tree Root Removal",
          "Pipe Relining",
          "Emergency Plumbing"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Drain Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Unblocking Drains",
                "description": "Blocked sinks, toilets & showers"
              },
              "price": "250",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Complete Drain Package",
                "description": "Hydro-Jet + CCTV Inspection + Locate"
              },
              "price": "650",
              "priceCurrency": "AUD"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "150"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://plumber-blocked-drains.vercel.app/#website",
        "url": "https://plumber-blocked-drains.vercel.app/",
        "name": "Plumber Blocked Drains Melbourne",
        "description": "Blocked drain specialists in Melbourne. 24/7 emergency service."
      },
      {
        "@type": "WebPage",
        "@id": "https://plumber-blocked-drains.vercel.app/#webpage",
        "url": "https://plumber-blocked-drains.vercel.app/",
        "name": "Blocked Drains Cleared Fast | Hydro-Jet & CCTV Specialists",
        "isPartOf": { "@id": "https://plumber-blocked-drains.vercel.app/#website" },
        "about": { "@id": "https://plumber-blocked-drains.vercel.app/#plumber" },
        "description": "Melbourne's trusted blocked drain specialists. Same-day service, no call-out fees, CCTV inspections. Serving all Melbourne suburbs including Bentleigh, Brighton, Camberwell, Hawthorn."
      },
      {
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
            "name": "What areas do you service?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We're based in Melbourne's South-East and service all across Melbourne including Bentleigh, Brighton, Camberwell, Caulfield, Chadstone, Glen Waverley, Hawthorn, Malvern, Mount Waverley, Oakleigh, Richmond, South Yarra, and surrounding suburbs."
            }
          }
        ]
      }
    ]
  };
  
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

// Animated Phone Button with Water Ripple Effect
const AnimatedPhoneButton = () => {
  return (
    <motion.a 
      href="tel:0400123456"
      className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-black font-semibold relative overflow-hidden"
      style={{ background: colors.gold }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Water ripple rings */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: colors.gold }} />
      <motion.span 
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.gold}40, transparent)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Phone icon with drip animation */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Phone className="w-4 h-4 relative z-10" />
      </motion.div>
      
      <span className="relative z-10">0400 123 456</span>
      
      {/* Live indicator dot */}
      <motion.span 
        className="w-2 h-2 rounded-full bg-green-500 absolute -top-1 -right-1"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ boxShadow: '0 0 10px #22c55e' }}
      />
    </motion.a>
  );
};

// Header
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { 
    const handleScroll = () => setScrolled(window.scrollY > 50); 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []);
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{ 
        background: scrolled ? `${colors.black}ee` : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.burgundy}40` : 'none'
      }}
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-8">
          {['Services', 'Pricing', 'Areas', 'Why Us', 'FAQ'].map((item) => (
            <motion.a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2, color: colors.gold }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        <AnimatedPhoneButton />
      </div>
    </motion.header>
  );
};

// Animated Water Droplets
const FloatingDroplets = () => {
  const droplets = [
    { size: 12, left: '10%', delay: 0 },
    { size: 8, left: '20%', delay: 0.5 },
    { size: 15, left: '75%', delay: 1 },
    { size: 10, left: '85%', delay: 1.5 },
    { size: 6, left: '5%', delay: 2 },
    { size: 14, left: '90%', delay: 0.8 },
  ];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {droplets.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            left: d.left,
            bottom: -20,
            background: `radial-gradient(circle at 30% 30%, ${colors.gold}, ${colors.bronze})`,
            boxShadow: `0 0 ${d.size}px ${colors.gold}50`
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 1, 1, 0],
            x: [0, Math.sin(i) * 50, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: d.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Animated Waves at Bottom
const BottomWaves = () => (
  <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
    <motion.svg 
      viewBox="0 0 1440 120" 
      preserveAspectRatio="none" 
      className="w-full h-24 md:h-32"
      animate={{ x: [0, -100, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    >
      <path 
        d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" 
        fill={`${colors.burgundy}25`}
      />
    </motion.svg>
    <motion.svg 
      viewBox="0 0 1440 120" 
      preserveAspectRatio="none" 
      className="absolute bottom-0 left-0 w-full h-16 md:h-24"
      animate={{ x: [0, 60, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <path 
        d="M0,80 C360,40 600,100 960,60 C1200,30 1320,80 1440,70 L1440,120 L0,120 Z" 
        fill={`${colors.gold}20`}
      />
    </motion.svg>
  </div>
);

// Hero
const Hero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${colors.black} 0%, ${colors.darkGray} 40%, ${colors.black} 100%)` }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.burgundy}40, transparent)` }}
          animate={{ 
            scale: [1, 1.5, 1], 
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.gold}25, transparent)` }}
          animate={{ 
            scale: [1.3, 1, 1.3],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.burgundy}20, transparent)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Floating Droplets */}
      <FloatingDroplets />
      
      {/* Bottom Waves */}
      <BottomWaves />
      
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border"
            style={{ background: `${colors.burgundy}20`, borderColor: `${colors.burgundy}50`, color: colors.gold }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available 24/7 — Same Day Service
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.span 
            style={{ color: colors.white }}
            animate={{ textShadow: ['0 0 20px rgba(255,255,255,0)', '0 0 40px rgba(255,255,255,0.1)', '0 0 20px rgba(255,255,255,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Blocked Drains
          </motion.span>
          <br />
          <motion.span 
            className="bg-clip-text text-transparent inline-block"
            style={{ backgroundImage: `linear-gradient(90deg, ${colors.gold}, ${colors.bronze}, ${colors.gold})`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Cleared Fast
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          style={{ color: '#9ca3af' }}
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          Hydro-Jet & CCTV Specialists. No call-out fees. We show you the problem before we start.
        </motion.p>
        
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <motion.a 
            href="tel:0400123456" 
            className="group relative px-8 py-4 rounded-full text-black font-bold text-lg overflow-hidden"
            style={{ background: colors.gold }}
            whileHover={{ scale: 1.05, boxShadow: `0 10px 40px ${colors.gold}50` }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2"><Phone className="w-5 h-5" />Call 0400 123 456</span>
          </motion.a>
          <motion.a 
            href="#pricing" 
            className="px-8 py-4 rounded-full font-semibold transition-colors border"
            style={{ borderColor: `${colors.white}30`, color: colors.white }}
            whileHover={{ scale: 1.05, background: `${colors.white}10` }}
          >
            View Pricing
          </motion.a>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: Clock, text: "60 Min Response" },
            { icon: Video, text: "CCTV Inspection" },
            { icon: DollarSign, text: "No Call-Out Fee" }
          ].map((card, index) => (
            <motion.div
              key={card.text}
              className="flex items-center gap-3 px-6 py-4 rounded-xl border"
              style={{ background: `${colors.burgundy}20`, borderColor: `${colors.burgundy}40`, backdropFilter: 'blur(10px)' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -10, boxShadow: `0 20px 40px ${colors.burgundy}30`, borderColor: colors.gold }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: colors.burgundy }}>
                <card.icon className="w-5 h-5" style={{ color: colors.gold }} />
              </div>
              <span className="text-white font-semibold">{card.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Meet the Specialist - Personal Introduction
const MeetSpecialist = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: colors.darkGray }}>
      {/* Decorative gradient line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)` }}
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo Side */}
          <ScrollReveal>
            <div className="relative">
              {/* Circular photo frame */}
              <motion.div 
                className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 relative"
                style={{ borderColor: colors.gold }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Ron's photo - CCTV drain inspection in action */}
                <img 
                  src="/ron-working.jpg" 
                  alt="Ron performing CCTV drain inspection" 
                  className="w-full h-full object-cover"
                />
                
                {/* Animated ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 pointer-events-none"
                  style={{ borderColor: colors.gold }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Experience badge */}
              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold text-sm"
                style={{ background: colors.gold, color: colors.black }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                10+ Years Experience
              </motion.div>
            </div>
          </ScrollReveal>
          
          {/* Text Side */}
          <ScrollReveal delay={0.2}>
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border"
                style={{ background: `${colors.burgundy}20`, borderColor: `${colors.burgundy}50`, color: colors.gold }}
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-4 h-4" />
                Your Local Expert
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.white }}>
                Hi, I am <span style={{ color: colors.gold }}>Ron</span>
                <br />
                <span className="text-2xl md:text-3xl" style={{ color: '#9ca3af' }}>Your Local Drain Specialist</span>
              </h2>
              
              <p className="text-lg mb-6 leading-relaxed" style={{ color: '#d1d5db' }}>
                I have been solving blocked drains for homeowners and businesses across Melbourne 
                for over a decade. I believe in honest, transparent service — showing you exactly 
                what is causing the problem and fixing it right the first time.
              </p>
              
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#9ca3af' }}>
                No hidden fees, no unnecessary upsells. Just quality drain clearing you can count on, 
                backed by our satisfaction guarantee.
              </p>
              
              <motion.a 
                href="tel:0400123456" 
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-black font-bold"
                style={{ background: colors.gold }}
                whileHover={{ scale: 1.05, boxShadow: `0 10px 40px ${colors.gold}50` }}
              >
                <Phone className="w-5 h-5" />
                Speak with Ron Directly
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

// Why Choose Us
const WhyChooseUs = () => {
  const features = [
    { icon: Truck, text: "Fast Same-Day Service" },
    { icon: Video, text: "Drainage Footage on Request" },
    { icon: DollarSign, text: "No Call-Out Fees" },
    { icon: BadgeCheck, text: "Honest Up-Front Pricing" },
    { icon: Camera, text: "Expert CCTV Drain Diagnosis" },
    { icon: Sparkles, text: "Proven Hydro-Jetting Results" },
    { icon: Home, text: "No Mess Left Behind" },
    { icon: Users, text: "Respectful In-Home Service" },
    { icon: Star, text: "100% Satisfaction Focused" }
  ];
  
  return (
    <section id="why-us" className="py-24" style={{ background: colors.darkGray }}>
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              Why Homeowners in Melbourne <span style={{ color: colors.gold }}>Choose Us</span>
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.text} delay={index * 0.05}>
              <motion.div 
                className="flex items-center gap-4 p-6 rounded-xl border"
                style={{ background: `${colors.black}50`, borderColor: `${colors.burgundy}30` }}
                whileHover={{ borderColor: colors.gold, x: 5 }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.burgundy }}>
                  <feature.icon className="w-6 h-6" style={{ color: colors.gold }} />
                </div>
                <span className="font-semibold text-lg" style={{ color: colors.white }}>{feature.text}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// No-BS Guarantee
const Guarantee = () => {
  const guarantees = [
    { icon: DollarSign, title: "Transparent Pricing", desc: "You'll know the price before we start — no surprises." },
    { icon: Video, title: "Proof of Work", desc: "We show you CCTV footage so you see exactly what's going on." },
    { icon: BadgeCheck, title: "Done Right The First Time", desc: "No temporary fixes. We address the root cause properly." }
  ];
  
  return (
    <section className="py-24" style={{ background: colors.black }}>
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              Our <span style={{ color: colors.gold }}>No-BS Guarantee</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#9ca3af' }}>
              We do the job properly, we show you what we found, and we don't charge for things you don't need.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          {guarantees.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <motion.div 
                className="p-8 rounded-2xl border text-center h-full"
                style={{ background: `${colors.burgundy}15`, borderColor: `${colors.burgundy}40` }}
                whileHover={{ y: -5, borderColor: colors.gold }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: colors.burgundy }}>
                  <item.icon className="w-8 h-8" style={{ color: colors.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.white }}>{item.title}</h3>
                <p style={{ color: '#9ca3af' }}>{item.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: MapPin, title: "Local Melbourne Specialists", desc: "We live here, we work here and we know Melbourne drains better than anyone." },
              { icon: Users, title: "Trusted By Homeowners", desc: "Real reviews, real results, and plenty of repeat customers who call us first." },
              { icon: Clock, title: "Fast Same-Day Service", desc: "When your drain blocks, you need help now — we show up fast and get it sorted." },
              { icon: DollarSign, title: "No Call-Out Fees", desc: "Straightforward pricing from the start." }
            ].map((item, index) => (
              <div key={item.title} className="p-4">
                <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: colors.gold }} />
                <h4 className="font-bold mb-2" style={{ color: colors.white }}>{item.title}</h4>
                <p className="text-sm" style={{ color: '#9ca3af' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Services & Pricing - Detailed & Clickable
const Pricing = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const services = [
    { 
      icon: Droplets,
      title: "Unblocking Drains", 
      shortDesc: "Blocked sinks, toilets & showers.",
      price: "$250",
      gst: "+ GST",
      popular: false,
      includes: [
        "Clear blocked sinks, basins & showers",
        "Toilet unblocking & clearing",
        "High-pressure water jetting",
        "Remove minor tree roots",
        "Clear grease, hair & debris",
        "Check for underlying issues"
      ],
      bestFor: "Single blocked fixture (sink, toilet, or shower)"
    },
    { 
      icon: Zap,
      title: "Complete Drain Package", 
      shortDesc: "Everything you need. Save $150!",
      price: "$650",
      gst: "+ GST",
      popular: true,
      includes: [
        "Full Hydro-Jet drain clearing",
        "CCTV camera inspection",
        "Exact location of blockage",
        "Pipe condition assessment",
        "Digital video recording",
        "Written report with photos",
        "Preventative advice",
        "60-day guarantee"
      ],
      bestFor: "Unknown blockages or recurring problems"
    },
    { 
      icon: Camera,
      title: "CCTV Drain Inspection", 
      shortDesc: "See exactly what's causing the issue.",
      price: "$350",
      gst: "+ GST",
      popular: false,
      includes: [
        "High-res CCTV camera inspection",
        "Push camera up to 60 meters",
        "Locate exact blockage position",
        "Identify pipe damage or cracks",
        "Tree root intrusion detection",
        "Digital recording provided",
        "Expert analysis & recommendations"
      ],
      bestFor: "Buying a house or persistent drain issues"
    },
    { 
      icon: Wrench,
      title: "Toilet Removal Package", 
      shortDesc: "Full service removal & reinstatement.",
      price: "$850",
      gst: "+ GST",
      popular: false,
      includes: [
        "Careful toilet removal",
        "Drain clearing & inspection",
        "CCTV camera diagnosis",
        "Professional reinstatement",
        "New seals & connections",
        "Leak testing",
        "Clean up & disposal"
      ],
      bestFor: "Toilet replacement or access issues"
    },
    { 
      icon: TreeDeciduous,
      title: "Hydro-Jetting", 
      shortDesc: "High-pressure clearing for tough blockages.",
      price: "$450",
      gst: "+ GST",
      popular: false,
      includes: [
        "4000 PSI high-pressure water jet",
        "Cut through tree roots",
        "Remove built-up grease & fat",
        "Clear wet wipes & debris",
        "Clean entire pipe length",
        "Restore full flow capacity",
        "Long-lasting results"
      ],
      bestFor: "Tree roots, grease, or stubborn blockages"
    },
    { 
      icon: Shield,
      title: "Pipe Relining", 
      shortDesc: "Permanent repair without digging.",
      price: "Custom",
      gst: "Quote",
      popular: false,
      includes: [
        "No-dig trenchless technology",
        "Structural pipe repair",
        "Seals cracks & holes",
        "Stops tree root intrusion",
        "50+ year lifespan",
        "Minimal disruption",
        "Full CCTV documentation"
      ],
      bestFor: "Cracked pipes or permanent solutions"
    }
  ];
  
  return (
    <section id="pricing" className="py-24" style={{ background: colors.darkGray }}>
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              Blocked Drain? <span style={{ color: colors.gold }}>We Clear It Today.</span>
            </h2>
            <p className="text-xl" style={{ color: '#9ca3af' }}>Same-Day Response • No Hidden Fees • Melbourne Wide</p>
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <motion.div 
                className="relative rounded-2xl border overflow-hidden cursor-pointer"
                style={{ 
                  background: service.popular ? `${colors.burgundy}30` : `${colors.black}50`,
                  borderColor: service.popular ? colors.gold : `${colors.burgundy}40`
                }}
                whileHover={{ y: -5, borderColor: colors.gold }}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {service.popular && (
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: colors.gold, color: colors.black }}
                  >
                    BEST VALUE
                  </div>
                )}
                
                {/* Card Header */}
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: colors.burgundy }}>
                    <service.icon className="w-7 h-7" style={{ color: colors.gold }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.white }}>{service.title}</h3>
                  <p className="mb-4" style={{ color: '#9ca3af' }}>{service.shortDesc}</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: colors.gold }}>{service.price}</span>
                    <span className="text-sm" style={{ color: '#6b7280' }}>{service.gst}</span>
                  </div>
                </div>
                
                {/* Expandable Details */}
                <motion.div
                  initial={false}
                  animate={{ height: expandedIndex === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t" style={{ borderColor: `${colors.burgundy}30` }}>
                    <div className="pt-4">
                      <h4 className="font-semibold mb-3" style={{ color: colors.gold }}>What's Included:</h4>
                      <ul className="space-y-2 mb-4">
                        {service.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#d1d5db' }}>
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.gold }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 rounded-lg mb-4" style={{ background: `${colors.burgundy}20` }}>
                        <span className="text-sm font-medium" style={{ color: colors.gold }}>Best for: </span>
                        <span className="text-sm" style={{ color: '#9ca3af' }}>{service.bestFor}</span>
                      </div>
                      <motion.a
                        href="tel:0400123456"
                        className="w-full py-3 rounded-xl font-bold text-center block"
                        style={{ background: colors.gold, color: colors.black }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Book This Service
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
                
                {/* Expand Indicator */}
                <div className="px-6 pb-4">
                  <motion.div 
                    className="flex items-center justify-center gap-2 text-sm"
                    style={{ color: '#6b7280' }}
                    animate={{ opacity: expandedIndex === index ? 0 : 1 }}
                  >
                    Click for details <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// Areas Section - Simple Clean List
const Areas = () => {
  return (
    <section id="areas" className="py-24 relative" style={{ background: colors.black }}>
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border"
              style={{ background: `${colors.burgundy}20`, borderColor: `${colors.burgundy}50`, color: colors.gold }}
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-4 h-4" />
              Melbourne Wide Coverage
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              We Service <span style={{ color: colors.gold }}>All of Melbourne</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
              From the CBD to the outer suburbs — same day response
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl font-light mb-8" style={{ color: colors.white }}>
              <span style={{ color: colors.gold }}>Bayside</span> • <span style={{ color: colors.gold }}>Inner East</span> • <span style={{ color: colors.gold }}>South-East</span> • <span style={{ color: colors.gold }}>Eastern</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
              {['Brighton', 'Hawthorn', 'Camberwell', 'Glen Waverley', 'St Kilda', 'Caulfield', 'Oakleigh', 'South Yarra', 'Malvern', 'Toorak', 'Richmond', 'Carnegie'].map((suburb, i) => (
                <motion.span 
                  key={suburb}
                  className="px-4 py-2 rounded-full border text-sm md:text-base"
                  style={{ 
                    background: `${colors.burgundy}20`, 
                    borderColor: `${colors.burgundy}40`,
                    color: colors.white 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ borderColor: colors.gold, background: colors.burgundy }}
                >
                  {suburb}
                </motion.span>
              ))}
            </div>
            
            <p className="text-lg mb-8" style={{ color: '#6b7280' }}>
              + 15 more suburbs across Melbourne
            </p>
            
            <motion.a 
              href="tel:0400123456"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg"
              style={{ background: colors.gold, color: colors.black }}
              whileHover={{ scale: 1.05, boxShadow: `0 10px 30px ${colors.gold}50` }}
            >
              <Phone className="w-5 h-5" />
              Check if We Service Your Area
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Simple Wave Divider - No gaps, clean curves
const WaveDivider = ({ flip = false }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}>
    <svg 
      viewBox="0 0 1440 120" 
      preserveAspectRatio="none" 
      className="relative block w-full h-16 md:h-20"
      style={{ minWidth: '100%' }}
    >
      {/* Single smooth wave - no gaps */}
      <path 
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" 
        fill={colors.burgundy}
        opacity="0.9"
      />
    </svg>
  </div>
);

// Reviews Section with Elfsight
const Reviews = () => {
  return (
    <section id="reviews" className="py-24 relative" style={{ background: colors.darkGray }}>
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border"
              style={{ 
                background: `${colors.burgundy}20`, 
                borderColor: `${colors.burgundy}50`,
                color: colors.gold 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4" />
              Real Reviews From Real Customers
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              What Our <span style={{ color: colors.gold }}>Customers Say</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
              Do not just take our word for it — see why Melbourne homeowners trust us with their drains
            </p>
          </div>
        </ScrollReveal>
        
        {/* Elfsight Google Reviews Widget */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-2xl border p-2" style={{ background: `${colors.black}50`, borderColor: `${colors.burgundy}30` }}>
            <div 
              className="elfsight-app-6b39b248-4e9d-46ec-bde3-1b725f9226de" 
              data-elfsight-app-lazy
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "How fast can you get here?", a: "We offer fast same-day service across Melbourne. If your drain is backing up or overflowing, we treat it as urgent and can often arrive within the hour, depending on your location." },
    { q: "Do you charge call-out fees?", a: "No call-out fees ever. We diagnose the problem and tell you the price before starting any work. No surprises. No hidden extras." },
    { q: "Will you show me what's causing the blockage?", a: "Yes we use a CCTV drain inspection camera and show you live footage of exactly what's going on. You'll see the issue clearly before approving anything." },
    { q: "How do you clear blocked drains?", a: "We use high-pressure Hydro-Jetting to blast through tree roots, grease, wipes and built-up debris inside the pipe. This gives a proper long-lasting clear solution not just a short-term unblock." },
    { q: "How much does it cost to clear a drain?", a: "Prices vary depending on what's causing the blockage and how deep it is. But you'll always know the full price upfront before we begin. No pressure." },
    { q: "Do you do weekends and after-hours?", a: "Yes drains don't block on a schedule. Call us and we'll organise the fastest possible response, even outside normal hours." }
  ];
  
  return (
    <section id="faq" className="py-24" style={{ background: colors.darkGray }}>
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              Got <span style={{ color: colors.gold }}>Questions?</span>
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <motion.div 
                className="rounded-xl border overflow-hidden"
                style={{ background: `${colors.black}80`, borderColor: `${colors.burgundy}30` }}
              >
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-6 flex items-center justify-between text-left">
                  <span className="font-semibold pr-4" style={{ color: colors.white }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5" style={{ color: colors.gold }} />
                  </motion.div>
                </button>
                <motion.div initial={false} animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }} className="overflow-hidden">
                  <p className="px-6 pb-6" style={{ color: '#9ca3af' }}>{faq.a}</p>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: colors.black }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${colors.burgundy}15, transparent)` }} />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.white }}>
            Ready to Clear Your
            <span className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${colors.gold}, ${colors.bronze})` }}>
              Blocked Drain?
            </span>
          </h2>
          <p className="text-xl mb-10" style={{ color: '#9ca3af' }}>Same-day service. No call-out fees. We show you the problem first.</p>
          <motion.a 
            href="tel:0400123456" 
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-black font-bold text-xl"
            style={{ background: colors.gold }}
            whileHover={{ scale: 1.05, boxShadow: `0 10px 40px ${colors.gold}50` }}
          >
            <Phone className="w-6 h-6" />Call 0400 123 456 Now
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Floating Call Button
const FloatingCallButton = () => {
  return (
    <motion.a
      href="tel:0400123456"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-full font-bold text-black shadow-2xl md:hidden"
      style={{ background: colors.gold, boxShadow: `0 10px 30px ${colors.gold}50` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Phone className="w-5 h-5" />
      <span>Call Now</span>
    </motion.a>
  );
};

// Main App
function App() {
  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: colors.black, color: colors.white }}>
      <SchemaMarkup />
      <WaterFlowBackground />
      <Header />
      <Hero />
      <MeetSpecialist />
      <WhyChooseUs />
      <Guarantee />
      <Pricing />
      <Areas />
      <Reviews />
      <FAQ />
      <CTA />
      <FloatingCallButton />
      
      <footer className="py-12 border-t" style={{ background: colors.black, borderColor: `${colors.burgundy}30` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />
            <div className="text-center md:text-right">
              <p style={{ color: '#9ca3af' }}>0400 123 456 | Melbourne, VIC</p>
              <p style={{ color: '#6b7280' }}>24/7 Emergency Service</p>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center" style={{ color: '#6b7280', borderTop: `1px solid ${colors.burgundy}20` }}>
            © 2026 Plumber Blocked Drains Melbourne. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
