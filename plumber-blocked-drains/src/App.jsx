import React, { useState, useEffect, useRef } from 'react';
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
  TreePine,
  Zap,
  Award,
  Users,
  ChevronDown
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Water Particle Animation Component
const WaterParticles = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        if (this.y < -10) {
          this.reset();
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
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
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

// Animated Counter Component
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
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{count}{suffix}</span>;
};

// Scroll Reveal Component
const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
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
    "openingHours": "Mo-Su 00:00-23:59"
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
  );
};

// Animated Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available 24/7 — Same Day Service
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Blocked Drains
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Cleared Fast
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Hydro-Jet & CCTV Specialists. No call-out fees. We show you the problem before we start.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a 
            href="tel:0400123456"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call 0400 123 456
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          
          <motion.a 
            href="#services"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Our Services
          </motion.a>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: Clock, value: 60, suffix: 'min', label: 'Avg Response' },
            { icon: CheckCircle, value: 5000, suffix: '+', label: 'Drains Cleared' },
            { icon: Star, value: 4.9, suffix: '/5', label: 'Rating' },
            { icon: Shield, value: 10, suffix: '+ yrs', label: 'Experience' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>
    </section>
  );
};

// Services Section with Glassmorphism Cards
const Services = () => {
  const services = [
    {
      icon: Zap,
      title: "Hydro-Jetting",
      description: "High-pressure water blasting that cuts through tree roots, grease, and debris. Long-lasting results, not temporary fixes.",
      color: "from-blue-500 to-cyan-500",
      features: ["4000 PSI Pressure", "Removes Tree Roots", "Eco-Friendly"]
    },
    {
      icon: Camera,
      title: "CCTV Inspection",
      description: "See exactly what's causing your blockage with live camera footage. We show you before we start any work.",
      color: "from-purple-500 to-pink-500",
      features: ["Live Video Feed", "Digital Recording", "Pipe Condition Report"]
    },
    {
      icon: TreePine,
      title: "Tree Root Removal",
      description: "Specialized equipment to cut and remove invasive tree roots without damaging your pipes. Prevention advice included.",
      color: "from-green-500 to-emerald-500",
      features: ["Root Cutting", "Pipe Repair", "Prevention Tips"]
    }
  ];
  
  return (
    <section id="services" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-blue-400">Services</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional drain solutions using the latest technology. No guesswork, just results.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <motion.div 
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-500"
                whileHover={{ y: -10 }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <motion.li 
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// Process Section with Timeline Animation
const Process = () => {
  const steps = [
    { step: "01", title: "Call Us", description: "24/7 emergency line. We answer immediately." },
    { step: "02", title: "Diagnose", description: "CCTV inspection shows exactly what's wrong." },
    { step: "03", title: "Quote", description: "Fixed price upfront. No surprises." },
    { step: "04", title: "Fix", description: "Hydro-jet clearing. Permanent solution." }
  ];
  
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="text-blue-400">Works</span>
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 -translate-y-1/2" />
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.15}>
                <motion.div 
                  className="relative text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold relative z-10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials with Marquee Effect
const Testimonials = () => {
  const testimonials = [
    { name: "Sarah M.", location: "Brighton", text: "They showed me the tree roots on camera. Cleared it in under an hour. Amazing service!" },
    { name: "Mike T.", location: "Camberwell", text: "No call-out fee and they arrived within 45 minutes. The hydro-jet completely cleared 20 years of buildup." },
    { name: "Jessica L.", location: "Hawthorn", text: "Professional, honest, and fast. The CCTV inspection was eye-opening. Highly recommend!" }
  ];
  
  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our <span className="text-blue-400">Customers Say</span>
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1} direction="up">
              <motion.div 
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm"
                whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.5)' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section with Parallax
const CTA = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
        style={{ y }}
      />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Clear Your
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Blocked Drain?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Same-day service. No call-out fees. We show you the problem first.
          </p>
          
          <motion.a 
            href="tel:0400123456"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-6 h-6" />
            Call 0400 123 456 Now
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Header with scroll effect
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Droplets className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <div className="font-bold text-white text-lg">Plumber Blocked Drains</div>
            <div className="text-xs text-blue-400">Melbourne Specialists</div>
          </div>
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Services', 'How It Works', 'Reviews'].map((item) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        
        <motion.a 
          href="tel:0400123456"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone className="w-4 h-4" />
          0400 123 456
        </motion.a>
      </div>
    </motion.header>
  );
};

// Main App
function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
      <SchemaMarkup />
      <WaterParticles />
      <Header />
      <Hero />
      <Services />
      <Process />
      <Testimonials />
      <CTA />
      
      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-white">Plumber Blocked Drains</span>
              </div>
              <p className="text-gray-400">Melbourne's trusted blocked drain specialists. Available 24/7.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-gray-400">📞 0400 123 456</p>
              <p className="text-gray-400">📍 Melbourne, VIC</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Hours</h4>
              <p className="text-gray-400">24/7 Emergency Service</p>
              <p className="text-gray-400">Same Day Response</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-500">
            © 2026 Plumber Blocked Drains Melbourne. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
