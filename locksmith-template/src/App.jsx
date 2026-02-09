import { useState, useEffect } from 'react';
import { 
  Key, Lock, Shield, Phone, MapPin, Star, CheckCircle, 
  ArrowRight, Clock, ShieldCheck, Award, BadgeCheck,
  Menu, X, ChevronDown, ChevronUp, Eye, Fingerprint,
  Radio, ArrowUpRight, AlertTriangle, Home, Car, Building,
  ScanLine, Unlock, Siren, Clock3, MapPinned, Globe
} from 'lucide-react';

// Demo Banner
const DemoBanner = () => (
  <a 
    href="https://callreadysites.com.au?utm_source=demo&utm_medium=banner&utm_campaign=locksmith"
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white py-2 px-4 text-center text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 h-10"
  >
    <Globe className="w-4 h-4" />
    Demo Template by Call Ready Sites — Get Your Own Site
    <ArrowRight className="w-4 h-4" />
  </a>
);

// Lock Unlock Animation Component
const LockAnimation = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = 500;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
      setIsLocked(progress < 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-48 h-48">
      {/* Lock body */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-24 rounded-xl transition-all duration-500 ${
        isLocked ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-green-500 to-emerald-600'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {isLocked ? (
            <Lock className="w-16 h-16 text-white" />
          ) : (
            <Unlock className="w-16 h-16 text-white" />
          )}
        </div>
      </div>
      
      {/* Lock shackle */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 border-8 rounded-t-full transition-all duration-500 ${
          isLocked ? 'border-emerald-700 translate-y-0' : 'border-emerald-500 -translate-y-4'
        }`}
        style={{ borderBottom: 'none' }}
      />
      
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray={`${scrollProgress * 283} 283`}
          className="transition-all duration-100"
        />
      </svg>
      
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-medium whitespace-nowrap">
        {isLocked ? 'Scroll to unlock' : 'Unlocked!'}
      </div>
    </div>
  );
};

// Response Time Counter
const ResponseCounter = () => {
  const [count, setCount] = useState(15);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 5) return 15;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/30">
      <div className="flex items-center gap-3 mb-2">
        <Clock3 className="w-5 h-5 text-emerald-400 animate-pulse" />
        <span className="text-emerald-300 text-sm">Current Response Time</span>
      </div>
      <div className="text-5xl font-bold text-white">
        {count}<span className="text-2xl">min</span>
      </div>
      <div className="text-emerald-300 text-sm mt-1">Average across Melbourne</div>
    </div>
  );
};

// Shield Service Card
const ShieldService = ({ icon: Icon, title, desc, delay }) => (
  <div 
    className="group relative"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 transform rotate-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group-hover:transform group-hover:-translate-y-1">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition">
        <Icon className="w-7 h-7 text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </div>
);

// Security Tip Card
const SecurityTip = ({ title, tip, icon: Icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition group">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-slate-400 text-sm">{tip}</p>
      </div>
    </div>
  </div>
);

// Trust Badge
const TrustBadge = ({ icon: Icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-emerald-400" />
    </div>
    <div>
      <div className="font-bold text-white">{title}</div>
      <div className="text-slate-400 text-sm">{desc}</div>
    </div>
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    { icon: Home, title: "Residential", desc: "Home lockouts, rekeying, and security upgrades" },
    { icon: Building, title: "Commercial", desc: "Master key systems and business security" },
    { icon: Car, title: "Automotive", desc: "Car lockouts and key replacement" },
    { icon: Shield, title: "Safes", desc: "Safe opening, combo changes, installation" },
    { icon: ScanLine, title: "Access Control", desc: "Card readers and electronic entry" },
    { icon: Key, title: "Key Cutting", desc: "Duplicate keys for all lock types" },
  ];

  const securityTips = [
    { title: "Rekey When Moving", tip: "Always rekey locks when moving into a new home. You never know who has copies.", icon: Home },
    { title: "Deadbolt Quality", tip: "Install Grade 1 deadbolts on all exterior doors for maximum security.", icon: Lock },
    { title: "Spare Key Safety", tip: "Never hide spare keys outside. Use a lockbox or leave with trusted neighbor.", icon: Key },
    { title: "Smart Locks", tip: "Smart locks offer convenience but ensure they have backup key access.", icon: ScanLine },
  ];

  const portfolio = [
    { title: "Master Key System", desc: "50-unit office building", image: "🏢", security: "High" },
    { title: "Smart Lock Install", desc: "Residential upgrade", image: "🔐", security: "Smart" },
    { title: "Emergency Unlock", desc: "24/7 car service", image: "🚗", security: "Rapid" },
    { title: "CCTV Setup", desc: "4-camera system", image: "📹", security: "Monitored" },
    { title: "Safe Installation", desc: "Floor-mounted vault", image: "🏪", security: "Maximum" },
    { title: "Access Control", desc: "Card entry system", image: "💳", security: "Electronic" },
  ];

  const faqs = [
    { q: "How quickly can you respond to emergencies?", a: "We average 15-30 minutes across Melbourne metro. Our mobile locksmiths are strategically positioned for rapid response, 24/7." },
    { q: "Can you make keys for any lock?", a: "Yes! We can cut keys for virtually all lock types including standard, high-security, car keys (including smart keys), and restricted key systems." },
    { q: "Will unlocking damage my car or door?", a: "Never. We use non-destructive entry techniques and specialized tools. No damage to locks, doors, or paint - guaranteed." },
    { q: "Are your locksmiths licensed?", a: "Absolutely. All locksmiths hold current security licenses and have passed police background checks. Your safety is our priority." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden pt-10">
      <DemoBanner />
      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        .scan-line {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
          animation: scan-line 4s linear infinite;
          pointer-events: none;
          z-index: 100;
        }
      `}</style>

      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Emergency Banner */}
      <div className="fixed top-10 left-0 right-0 z-50 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 animate-pulse" />
            <span className="font-bold">24/7 Emergency Locksmith</span>
          </div>
          <a href="tel:+611800123456" className="flex items-center gap-2 bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm">
            <Phone className="w-4 h-4" />
            1800 123 456
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-20 w-full z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Secure<span className="text-emerald-400">Lock</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-300 hover:text-emerald-400 transition">Services</a>
              <a href="#security" className="text-slate-300 hover:text-emerald-400 transition">Security Tips</a>
              <a href="#trust" className="text-slate-300 hover:text-emerald-400 transition">Why Trust Us</a>
              <a href="#contact" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition">
                Get Help
              </a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-300">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero with Lock Animation */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Melbourne's Most Trusted</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Locked Out?<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">We Get You In</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-lg mx-auto lg:mx-0">
              24/7 emergency locksmith services. Licensed, police-checked, and arriving in 15-30 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="tel:+611800123456" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Line
              </a>
              <a href="#services" className="px-8 py-4 border border-slate-600 text-slate-300 rounded-full font-bold text-lg hover:border-emerald-500 hover:text-emerald-400 transition">
                Our Services
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <ResponseCounter />
            </div>
          </div>

          <div className="flex justify-center">
            <LockAnimation />
          </div>
        </div>
      </section>

      {/* Shield Services Grid */}
      <section id="services" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Security Services</h2>
            <p className="text-slate-400">Complete locksmith and security solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <ShieldService key={idx} {...service} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Security Tips Section */}
      <section id="security" className="py-24 bg-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Tips</h2>
            <p className="text-slate-400">Protect your home and business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {securityTips.map((tip, idx) => (
              <SecurityTip key={idx} {...tip} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Certification */}
      <section id="trust" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Trust SecureLock?</h2>
            <p className="text-slate-400">Your security is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TrustBadge 
              icon={BadgeCheck}
              title="Police Checked"
              desc="All locksmiths verified"
            />
            <TrustBadge 
              icon={ShieldCheck}
              title="Licensed"
              desc="Full security licenses"
            />
            <TrustBadge 
              icon={Award}
              title="Insured"
              desc="Comprehensive coverage"
            />
          </div>

          <div className="mt-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="text-5xl font-bold text-emerald-400 mb-2">10,000+</div>
            <div className="text-slate-400">Emergency callouts completed</div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Recent Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((project, idx) => (
              <div key={idx} className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition">
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-6xl">
                  {project.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                      {project.security}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800 transition"
                >
                  <span className="font-semibold">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Need a Locksmith?</h2>
          <p className="text-emerald-100 text-lg mb-8">
            Available 24/7. Fast response. Professional service.
          </p>
          <a href="tel:+611800123456" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg hover:shadow-xl transition">
            <Phone className="w-5 h-5" />
            Call 1800 123 456
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold">Secure<span className="text-emerald-400">Lock</span></span>
              </div>
              <p className="text-slate-400">Melbourne's trusted 24/7 locksmith service.</p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-400 mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Emergency Lockout</li>
                <li>Key Cutting</li>
                <li>Smart Locks</li>
                <li>Security Systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-400 mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>1800 123 456</li>
                <li>24/7 Available</li>
                <li>Melbourne Wide</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-400 mb-4">Trust</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Police Checked</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Fully Licensed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Insured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
