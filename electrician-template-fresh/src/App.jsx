import { useState, useEffect } from 'react';
import { 
  Zap, Power, Phone, MapPin, Star, CheckCircle, ArrowRight, ArrowLeft,
  Clock, Shield, Home, Building, Menu, X, ChevronDown, ChevronRight,
  ArrowUpRight, CircuitBoard, Radio, Plug, Lightbulb, Award, BadgeCheck,
  ShieldCheck, ThumbsUp, ZapOff, Battery, Wifi, Thermometer, Gauge,
  DollarSign, Calculator, Monitor, Smartphone, Lock, Globe
} from 'lucide-react';

// Demo Banner
const DemoBanner = () => (
  <a 
    href="https://callreadysites.com.au?utm_source=demo&utm_medium=banner&utm_campaign=electrician"
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white py-2 px-4 text-center text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 h-10"
  >
    <Globe className="w-4 h-4" />
    Demo Template by Call Ready Sites — Get Your Own Site
    <ArrowRight className="w-4 h-4" />
  </a>
);

// Energy Calculator Component
const EnergyCalculator = () => {
  const [bill, setBill] = useState(200);
  const [savings, setSavings] = useState(0);
  
  useEffect(() => {
    setSavings(Math.round(bill * 0.35));
  }, [bill]);

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold">Energy Savings Calculator</h3>
        </div>
        
        <div className="mb-6">
          <label className="text-sm text-slate-400 mb-2 block">Monthly Electricity Bill</label>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-cyan-400">${bill}</span>
            <input 
              type="range" 
              min="100" 
              max="800" 
              value={bill} 
              onChange={(e) => setBill(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30">
          <div className="text-sm text-slate-400 mb-1">Estimated Monthly Savings</div>
          <div className="text-4xl font-bold text-cyan-400">${savings}</div>
          <div className="text-sm text-slate-400 mt-2">with LED + Smart Home upgrades</div>
        </div>
      </div>
    </div>
  );
};

// Smart Home Device Icon
const SmartDevice = ({ icon: Icon, label, delay }) => (
  <div 
    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <span className="text-xs font-medium text-slate-600">{label}</span>
  </div>
);

// Electric pulse animation
const ElectricPulse = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div 
        key={i}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/30"
        style={{
          width: `${200 + i * 150}px`,
          height: `${200 + i * 150}px`,
          animation: `pulse-ring 2s ease-out ${i * 0.5}s infinite`,
        }}
      />
    ))}
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeService, setActiveService] = useState(0);

  const services = [
    { 
      icon: Power, 
      title: "Power Solutions", 
      desc: "Complete electrical installations and upgrades for homes and businesses",
      features: ["Switchboard upgrades", "3-phase power", "Safety inspections"]
    },
    { 
      icon: Lightbulb, 
      title: "Smart Lighting", 
      desc: "Automated lighting systems that save energy and enhance ambiance",
      features: ["LED conversions", "Motion sensors", "Dimmer controls"]
    },
    { 
      icon: CircuitBoard, 
      title: "Switchboards", 
      desc: "Modern, safe switchboard upgrades with surge protection",
      features: ["RCD protection", "Circuit labeling", "Safety switches"]
    },
    { 
      icon: Battery, 
      title: "Solar & Battery", 
      desc: "Clean energy solutions with battery storage systems",
      features: ["Solar installation", "Battery storage", "Grid connection"]
    },
    { 
      icon: Wifi, 
      title: "Smart Home", 
      desc: "Full home automation with voice control and app integration",
      features: ["Voice control", "App integration", "Automation rules"]
    },
  ];

  const smartDevices = [
    { icon: Lightbulb, label: "Smart Lights" },
    { icon: Thermometer, label: "Climate" },
    { icon: Lock, label: "Smart Locks" },
    { icon: Wifi, label: "WiFi" },
    { icon: Monitor, label: "Security" },
    { icon: Smartphone, label: "App Control" },
  ];

  const portfolio = [
    { title: "Commercial Office", desc: "200-person office electrical fit-out", image: "🏢", category: "Commercial" },
    { title: "Smart Home", desc: "Full automation with app control", image: "🏠", category: "Residential" },
    { title: "Solar Install", desc: "10kW system with battery storage", image: "☀️", category: "Solar" },
    { title: "Restaurant", desc: "Commercial kitchen wiring", image: "🍽️", category: "Commercial" },
    { title: "EV Charger", desc: "Home charger with load management", image: "🔌", category: "EV" },
    { title: "Warehouse", desc: "Industrial 3-phase installation", image: "🏭", category: "Industrial" },
  ];

  const faqs = [
    { q: "Are you licensed and insured?", a: "Yes, fully licensed electricians with comprehensive public liability insurance and 5-year workmanship guarantee." },
    { q: "Do you offer emergency services?", a: "24/7 emergency services across Greater Melbourne with typical response times under 60 minutes." },
    { q: "How much does solar installation cost?", a: "Solar systems range from $5,000-$15,000 depending on size. We provide detailed quotes and ROI calculations." },
    { q: "Can you make my home smart?", a: "Absolutely! We install smart lighting, thermostats, locks, and security systems with full app integration." },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden pt-10">
      <DemoBanner />
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes diagonal-slide {
          0% { transform: translateX(-100%) rotate(-3deg); }
          100% { transform: translateX(100%) rotate(-3deg); }
        }
        .diagonal-section {
          clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
        }
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 200px;
          gap: 1rem;
        }
        .masonry-item:nth-child(1) { grid-row: span 2; }
        .masonry-item:nth-child(4) { grid-row: span 2; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-10 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="w-8 h-8 text-blue-600" />
                <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="text-xl font-bold">Volt<span className="text-blue-600">Edge</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition">Services</a>
              <a href="#smart" className="text-slate-600 hover:text-blue-600 transition">Smart Home</a>
              <a href="#portfolio" className="text-slate-600 hover:text-blue-600 transition">Projects</a>
              <a href="#savings" className="text-slate-600 hover:text-blue-600 transition">Savings</a>
              <a href="#contact" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-medium hover:shadow-lg transition">
                Get Quote
              </a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Split Screen Hero */}
      <section className="min-h-screen pt-16 flex">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm mb-6">
              <Gauge className="w-4 h-4" />
              <span>High-Tech Electrical Solutions</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Power Your Home With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Smart Technology</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              From LED upgrades to full home automation, we bring cutting-edge electrical solutions that save energy and enhance your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+611800123456" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a href="#savings" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:border-blue-300 transition flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculate Savings
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {['T', 'R', 'M', 'S'][i]}
                  </div>
                ))}
              </div>
              <div>
                <span className="font-bold text-slate-800">500+</span> smart homes installed
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 items-center justify-center relative overflow-hidden">
          <ElectricPulse />
          
          {/* Central glowing orb */}
          <div className="relative z-10">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <div className="text-center text-white">
                <Zap className="w-16 h-16 mx-auto mb-4" />
                <div className="text-5xl font-bold">98%</div>
                <div className="text-sm opacity-80">Energy Efficient</div>
              </div>
            </div>
            
            {/* Orbiting icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Wifi className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </div>

          {/* Background grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </section>

      {/* Horizontal Scrolling Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-slate-600">Swipe through our electrical solutions</p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {services.map((service, idx) => (
              <div 
                key={idx}
                className={`flex-shrink-0 w-80 snap-center p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  activeService === idx 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl' 
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
                onClick={() => setActiveService(idx)}
              >
                <service.icon className={`w-12 h-12 mb-6 ${activeService === idx ? 'text-white' : 'text-blue-600'}`} />
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className={`mb-6 ${activeService === idx ? 'text-blue-100' : 'text-slate-600'}`}>{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 ${activeService === idx ? 'text-cyan-300' : 'text-green-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveService(idx)}
                className={`w-3 h-3 rounded-full transition-all ${activeService === idx ? 'bg-blue-600 w-8' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Smart Home Section */}
      <section id="smart" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Transform Your Home Into a <span className="text-blue-600">Smart Home</span>
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                Control your lights, climate, security, and more from anywhere. Voice-activated, app-controlled, and fully automated.
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {smartDevices.map((device, idx) => (
                  <SmartDevice key={idx} {...device} delay={idx * 100} />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">VoltEdge Home</div>
                    <div className="text-sm text-slate-500">All systems online</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Lightbulb, label: "Living Room Lights", status: "On • 80%", color: "text-amber-500" },
                    { icon: Thermometer, label: "Temperature", status: "22°C • Auto", color: "text-blue-500" },
                    { icon: Lock, label: "Front Door", status: "Locked", color: "text-green-500" },
                    { icon: Zap, label: "Energy Usage", status: "2.4 kW", color: "text-cyan-500" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm text-slate-500">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagonal Savings Section */}
      <section id="savings" className="diagonal-section py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Calculate Your <span className="text-cyan-400">Energy Savings</span>
              </h2>
              <p className="text-blue-200 mb-8 text-lg">
                See how much you could save by upgrading to LED lighting and smart home systems. Most customers save 30-40% on their electricity bills.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { value: "$2,400", label: "Average yearly savings" },
                  { value: "3 years", label: "Payback period" },
                  { value: "15 tons", label: "CO2 reduction" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <EnergyCalculator />
          </div>
        </div>
      </section>

      {/* Masonry Portfolio */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-slate-600">Recent electrical installations across Melbourne</p>
          </div>

          <div className="masonry-grid">
            {portfolio.map((project, idx) => (
              <div 
                key={idx}
                className={`masonry-item group relative overflow-hidden rounded-2xl ${idx === 0 || idx === 3 ? 'row-span-2' : ''}`}
              >
                <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-6xl ${idx === 0 || idx === 3 ? 'text-8xl' : 'text-6xl'}`}>
                  {project.image}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs mb-2">{project.category}</span>
                    <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-300">{project.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
            <p className="text-slate-600">Everything you need to know about smart electrical upgrades</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Smart?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Get a free consultation and energy assessment. We'll show you exactly how much you can save.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+611800123456" className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call 1800 123 456
            </a>
            <a href="mailto:info@voltedge.com.au" className="px-8 py-4 bg-blue-700 border border-blue-400 rounded-full font-bold text-lg hover:bg-blue-800 transition flex items-center justify-center gap-2">
              Email Us
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Neon Footer */}
      <footer className="bg-slate-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold">Volt<span className="text-cyan-400">Edge</span></span>
              </div>
              <p className="text-slate-400">Smart electrical solutions for modern homes and businesses.</p>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>LED Upgrades</li>
                <li>Smart Home</li>
                <li>Solar & Battery</li>
                <li>EV Charging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>About Us</li>
                <li>Projects</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Trust</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <BadgeCheck className="w-4 h-4 text-green-400" />
                  <span>Licensed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Insured</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>5 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
            © 2024 VoltEdge Electrical. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
