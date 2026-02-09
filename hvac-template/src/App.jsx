import { useState, useEffect } from 'react';
import { 
  Wind, Snowflake, Flame, Phone, MapPin, Star, CheckCircle, 
  ArrowRight, Thermometer, Droplets, Clock, Shield, Home, 
  Building, Wrench, Menu, X, ChevronDown, Fan, ArrowUpRight,
  Award, BadgeCheck, ShieldCheck, Image, ChevronUp, Sun,
  Cloud, Calendar, CheckSquare, Snowflake as SnowIcon,
  ThermometerSun, ThermometerSnowflake, Globe
} from 'lucide-react';

// Demo Banner
const DemoBanner = () => (
  <a 
    href="https://callreadysites.com.au?utm_source=demo&utm_medium=banner&utm_campaign=hvac"
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white py-2 px-4 text-center text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 h-10"
  >
    <Globe className="w-4 h-4" />
    Demo Template by Call Ready Sites — Get Your Own Site
    <ArrowRight className="w-4 h-4" />
  </a>
);

// Season Toggle Component
const SeasonToggle = ({ season, setSeason }) => (
  <div className="flex bg-slate-200 rounded-full p-1">
    <button
      onClick={() => setSeason('summer')}
      className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
        season === 'summer' 
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg' 
          : 'text-slate-600 hover:text-orange-600'
      }`}
    >
      <Sun className="w-5 h-5" />
      <span className="font-medium">Summer</span>
    </button>
    <button
      onClick={() => setSeason('winter')}
      className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
        season === 'winter' 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
          : 'text-slate-600 hover:text-blue-600'
      }}`}
    >
      <Snowflake className="w-5 h-5" />
      <span className="font-medium">Winter</span>
    </button>
  </div>
);

// Animated Thermometer
const AnimatedThermometer = ({ temperature, season }) => (
  <div className="relative w-24 h-64 bg-slate-200 rounded-full p-2">
    <div className="absolute inset-2 bg-white rounded-full overflow-hidden">
      <div 
        className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${
          season === 'summer' 
            ? 'bg-gradient-to-t from-orange-500 to-red-500' 
            : 'bg-gradient-to-t from-blue-500 to-cyan-400'
        }`}
        style={{ height: `${temperature}%` }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full animate-pulse" />
      </div>
    </div>
    <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-700">
      {season === 'summer' ? '24°C' : '21°C'}
    </div>
  </div>
);

// Circular Service Icon
const CircularService = ({ icon: Icon, title, delay, season }) => (
  <div 
    className="flex flex-col items-center gap-3 group cursor-pointer"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
      season === 'summer' 
        ? 'bg-gradient-to-br from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200' 
        : 'bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200'
    }`}>
      <Icon className={`w-10 h-10 ${season === 'summer' ? 'text-orange-600' : 'text-blue-600'}`} />
    </div>
    <span className="text-sm font-medium text-slate-700 text-center max-w-[100px]">{title}</span>
  </div>
);

// Maintenance Checklist
const MaintenanceChecklist = ({ season }) => {
  const summerTasks = [
    { task: "Clean AC filters", icon: CheckSquare },
    { task: "Check refrigerant levels", icon: Droplets },
    { task: "Inspect outdoor unit", icon: Sun },
    { task: "Test thermostat", icon: Thermometer },
  ];
  
  const winterTasks = [
    { task: "Service heating system", icon: Flame },
    { task: "Check ductwork", icon: Wind },
    { task: "Replace filters", icon: CheckSquare },
    { task: "Test safety switches", icon: Shield },
  ];

  const tasks = season === 'summer' ? summerTasks : winterTasks;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className={`w-6 h-6 ${season === 'summer' ? 'text-orange-500' : 'text-blue-500'}`} />
        {season === 'summer' ? 'Summer' : 'Winter'} Maintenance Checklist
      </h3>
      <div className="space-y-4">
        {tasks.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <item.icon className={`w-5 h-5 ${season === 'summer' ? 'text-orange-500' : 'text-blue-500'}`} />
            <span className="font-medium text-slate-700">{item.task}</span>
            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Temperature Card
const TempCard = ({ title, temp, icon: Icon, color }) => (
  <div className={`p-6 rounded-2xl ${color} text-white`}>
    <Icon className="w-8 h-8 mb-3 opacity-80" />
    <div className="text-3xl font-bold mb-1">{temp}°C</div>
    <div className="text-sm opacity-90">{title}</div>
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [season, setSeason] = useState('summer');
  const [tempAnimation, setTempAnimation] = useState(30);

  useEffect(() => {
    const target = season === 'summer' ? 75 : 45;
    const interval = setInterval(() => {
      setTempAnimation(prev => {
        if (prev < target) return prev + 1;
        if (prev > target) return prev - 1;
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [season]);

  const services = [
    { icon: season === 'summer' ? Snowflake : Flame, title: season === 'summer' ? "Air Conditioning" : "Heating" },
    { icon: Fan, title: "Ventilation" },
    { icon: Droplets, title: "Duct Cleaning" },
    { icon: Thermometer, title: "Climate Control" },
    { icon: Wind, title: "Air Quality" },
    { icon: Wrench, title: "Repairs" },
  ];

  const portfolio = [
    { title: "Ducted System", desc: "Whole-home climate control", temp: 22, season: "all" },
    { title: "Split System", desc: "Multi-room cooling", temp: 24, season: "summer" },
    { title: "Gas Heating", desc: "Efficient winter warmth", temp: 20, season: "winter" },
    { title: "Evaporative", desc: "Energy-efficient cooling", temp: 23, season: "summer" },
    { title: "Heat Pump", desc: "Year-round comfort", temp: 21, season: "all" },
    { title: "Smart Climate", desc: "WiFi-controlled system", temp: 22, season: "all" },
  ];

  const faqs = [
    { q: "How often should I service my air conditioner?", a: "We recommend servicing your AC at least once a year, ideally before the peak summer season. Regular maintenance improves efficiency and prevents breakdowns." },
    { q: "What size air conditioner do I need?", a: "The right size depends on your room dimensions and insulation. As a guide, you need about 0.15kW per square meter. We provide free assessments." },
    { q: "How long does installation take?", a: "A standard split system takes 4-6 hours. Ducted systems require 1-2 days depending on your home size. We'll provide a detailed timeline." },
    { q: "Do you offer warranties?", a: "Yes! All installations come with a 5-year workmanship guarantee, plus manufacturer warranties on equipment (typically 5-7 years)." },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden pt-10">
      <DemoBanner />
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-10 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Wind className={`w-8 h-8 ${season === 'summer' ? 'text-orange-600' : 'text-blue-600'}`} />
              <span className="text-xl font-bold">Cool<span className={season === 'summer' ? 'text-orange-600' : 'text-blue-600'}>Flow</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-slate-800 transition">Services</a>
              <a href="#seasonal" className="text-slate-600 hover:text-slate-800 transition">Seasonal</a>
              <a href="#portfolio" className="text-slate-600 hover:text-slate-800 transition">Projects</a>
              <a href="#contact" className={`px-6 py-2 rounded-full font-medium transition ${
                season === 'summer' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }`}>
                Get Quote
              </a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Split Screen Hero with Season Toggle */}
      <section className="min-h-screen pt-16 flex">
        {/* Left Side - Content */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 transition-colors duration-500 ${
          season === 'summer' ? 'bg-gradient-to-br from-orange-50 to-amber-50' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
        }`}>
          <div className="max-w-lg">
            <div className="mb-8">
              <span className="text-sm text-slate-500 mb-2 block">Select your season:</span>
              <SeasonToggle season={season} setSeason={setSeason} />
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Stay {season === 'summer' ? 'Cool' : 'Warm'} This<br />
              <span className={`text-transparent bg-clip-text ${
                season === 'summer' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}>
                {season === 'summer' ? 'Summer' : 'Winter'}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              {season === 'summer' 
                ? 'Professional air conditioning installation, repair, and maintenance to keep you comfortable all summer long.'
                : 'Efficient heating solutions including gas, electric, and reverse cycle systems for a cozy winter.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="tel:+611800123456" className={`px-8 py-4 text-white rounded-full font-bold text-lg transition flex items-center justify-center gap-2 shadow-xl ${
                season === 'summer' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30'
              }`}>
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a href="#seasonal" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:border-slate-400 transition flex items-center justify-center gap-2">
                View Maintenance
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Award className={`w-5 h-5 ${season === 'summer' ? 'text-orange-500' : 'text-blue-500'}`} />
                <span className="text-sm font-medium">5 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Clock className={`w-5 h-5 ${season === 'summer' ? 'text-orange-500' : 'text-blue-500'}`} />
                <span className="text-sm font-medium">Same Day Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className={`hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden transition-colors duration-500 ${
          season === 'summer' 
            ? 'bg-gradient-to-br from-orange-400 to-amber-500' 
            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}>
          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `float-particle ${8 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          <div className="relative z-10 text-center text-white">
            <AnimatedThermometer temperature={tempAnimation} season={season} />
            
            <div className="mt-8">
              <div className="text-6xl font-bold mb-2">
                {season === 'summer' ? <ThermometerSun className="w-16 h-16 mx-auto" /> : <ThermometerSnowflake className="w-16 h-16 mx-auto" />}
              </div>
              <div className="text-xl opacity-90">Perfect Comfort</div>
            </div>
          </div>

          {/* Spinning fan effect */}
          <div className="absolute bottom-10 right-10 opacity-20">
            <Fan className="w-32 h-32 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </section>

      {/* Circular Services */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Climate Solutions</h2>
            <p className="text-slate-600">Expert heating, cooling, and ventilation services</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {services.map((service, idx) => (
              <CircularService key={idx} {...service} delay={idx * 100} season={season} />
            ))}
          </div>

          {/* Central unit visual */}
          <div className="mt-16 flex justify-center">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center shadow-2xl ${
              season === 'summer' 
                ? 'bg-gradient-to-br from-orange-400 to-amber-400' 
                : 'bg-gradient-to-br from-blue-400 to-cyan-400'
            }`}>
              <div className="text-center text-white">
                <Wind className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <div className="text-2xl font-bold">Comfort</div>
                <div className="text-sm opacity-80">Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Maintenance Section */}
      <section id="seasonal" className={`py-24 transition-colors duration-500 ${
        season === 'summer' ? 'bg-orange-50' : 'bg-blue-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {season === 'summer' ? 'Summer' : 'Winter'} Maintenance
            </h2>
            <p className="text-slate-600">Keep your system running efficiently with our seasonal checklists</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <MaintenanceChecklist season={season} />
            
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl text-white ${
                season === 'summer' 
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <h3 className="text-2xl font-bold mb-4">Temperature Comfort Guarantee</h3>
                <p className="opacity-90 mb-4">
                  We guarantee your home will stay at your desired temperature or we'll fix it for free.
                </p>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6" />
                  <span>24°C or cooler in summer</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>21°C or warmer in winter</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-bold mb-4">Energy Savings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old system</span>
                    <span className="text-red-500 font-bold">$400/yr</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-red-400 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New efficient system</span>
                    <span className="text-green-500 font-bold">$240/yr</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full w-2/5 rounded-full ${season === 'summer' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
                  <span className="text-green-700 font-bold">Save $160/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature-Coded Portfolio */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Recent Installations</h2>
            <p className="text-slate-600">Color-coded by optimal operating temperature</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((project, idx) => (
              <div key={idx} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                <div className={`aspect-video flex items-center justify-center text-6xl ${
                  project.season === 'summer' ? 'bg-gradient-to-br from-orange-100 to-amber-100' :
                  project.season === 'winter' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
                  'bg-gradient-to-br from-green-100 to-emerald-100'
                }`}>
                  {project.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      project.temp >= 23 ? 'bg-orange-100 text-orange-700' :
                      project.temp <= 20 ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {project.temp}°C
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className={`py-24 text-white transition-colors duration-500 ${
        season === 'summer' 
          ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Perfect Climate?</h2>
          <p className="text-white/90 text-lg mb-8">
            Get a free quote and temperature assessment for your home.
          </p>
          <a href="tel:+611800123456" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-800 rounded-full font-bold text-lg hover:shadow-xl transition">
            <Phone className="w-5 h-5" />
            Call 1800 123 456
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold">Cool<span className="text-cyan-400">Flow</span></span>
              </div>
              <p className="text-slate-400">Your comfort is our business. Professional heating and cooling solutions.</p>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Air Conditioning</li>
                <li>Heating Systems</li>
                <li>Ventilation</li>
                <li>Repairs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>1800 123 456</li>
                <li>info@coolflow.com.au</li>
                <li>Melbourne Wide</li>
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
        </div>
      </footer>
    </div>
  );
}

export default App;
