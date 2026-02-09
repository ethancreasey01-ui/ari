import { useState } from 'react';
import { 
  Hammer, Wrench, Paintbrush, Home, Phone, MapPin, Star, 
  CheckCircle, ArrowRight, ArrowLeft, Clock, Shield, Menu, X,
  HardHat, Ruler, Lightbulb, Plug, Droplets, ArrowUpRight,
  Award, BadgeCheck, ShieldCheck, Scissors,
  Plus, Minus, Globe
} from 'lucide-react';

// Demo Banner
const DemoBanner = () => (
  <a 
    href="https://callreadysites.com.au?utm_source=demo&utm_medium=banner&utm_campaign=handyman"
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white py-2 px-4 text-center text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 h-10"
  >
    <Globe className="w-4 h-4" />
    Demo Template by Call Ready Sites — Get Your Own Site
    <ArrowRight className="w-4 h-4" />
  </a>
);

// Polaroid Photo Component
const Polaroid = ({ image, title, caption, rotate = 0 }) => (
  <div 
    className="bg-white p-3 pb-12 shadow-xl transform transition-all duration-300 hover:scale-105 hover:rotate-0 cursor-pointer"
    style={{ 
      transform: `rotate(${rotate}deg)`,
      boxShadow: '4px 4px 15px rgba(0,0,0,0.15)',
    }}
  >
    <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl mb-3 overflow-hidden">
      {typeof image === 'string' && image.startsWith('/') ? (
        <img src={image} alt={title} className="w-full h-full object-cover" />
      ) : (
        image
      )}
    </div>
    <div className="text-center">
      <div className="font-bold text-slate-800 text-sm">{title}</div>
      <div className="text-xs text-slate-500 font-handwriting">{caption}</div>
    </div>
  </div>
);

// Before/After Gallery Slider
const BeforeAfterGallery = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    { before: "/handyman_05.png", after: "/handyman_05.png", title: "Richmond Deck", desc: "Sanded & stained - Dec 2024" },
    { before: "/handyman_01.png", after: "/handyman_01.png", title: "South Yarra Door", desc: "Repaired & painted - Nov 2024" },
    { before: "/handyman_03.png", after: "/handyman_03.png", title: "Hawthorn Bathroom", desc: "Tiles & plumbing - Oct 2024" },
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl border-4 border-white">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 p-8">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img src={slide.before} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800">{slide.title}</h3>
              <p className="text-slate-600 text-center text-sm">{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${activeSlide === idx ? 'bg-amber-500 w-8' : 'bg-slate-300'}`}
          />
        ))}
      </div>
      
      <button 
        onClick={() => setActiveSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 border-2 border-amber-200"
      >
        <ArrowLeft className="w-5 h-5 text-amber-600" />
      </button>
      <button 
        onClick={() => setActiveSlide(prev => prev === slides.length - 1 ? 0 : prev + 1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 border-2 border-amber-200"
      >
        <ArrowRight className="w-5 h-5 text-amber-600" />
      </button>
    </div>
  );
};

// Sticky Note Testimonial
const StickyNote = ({ text, author, color, rotate }) => (
  <div 
    className={`p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-0 ${color}`}
    style={{ 
      transform: `rotate(${rotate}deg)`,
      boxShadow: '3px 3px 12px rgba(0,0,0,0.1)',
    }}
  >
    <p className="font-handwriting text-lg mb-3 leading-relaxed text-slate-800">"{text}"</p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center font-bold text-sm text-slate-700">
        {author.charAt(0)}
      </div>
      <span className="font-medium text-sm text-slate-700">{author}</span>
    </div>
  </div>
);

// Tool Belt Service Item
const ToolBeltItem = ({ icon: Icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
      isActive 
        ? 'bg-amber-500 text-white shadow-lg scale-110' 
        : 'bg-white text-slate-700 hover:bg-amber-100 shadow-md'
    }`}
  >
    <Icon className="w-8 h-8" />
    <span className="text-xs font-medium">{title}</span>
  </button>
);

// Odd Jobs Collage Item
const OddJobItem = ({ icon, title }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-amber-100">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-medium text-sm text-slate-700">{title}</div>
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    { 
      icon: Hammer, 
      title: "Repairs", 
      desc: "Doors that won't close, holes in walls, broken fences - all those annoying jobs",
      price: "$85/hour",
      details: "Same day service available"
    },
    { 
      icon: Paintbrush, 
      title: "Painting", 
      desc: "Interior rooms, decks, fences - professional finish every time",
      price: "From $400/room",
      details: "Premium paints, full prep"
    },
    { 
      icon: Droplets, 
      title: "Plumbing", 
      desc: "Leaking taps, toilets, drains - licensed plumber on every job",
      price: "$95/hour",
      details: "No call-out fee"
    },
    { 
      icon: Plug, 
      title: "Electrical", 
      desc: "Lights, power points, fans - certified electrical work",
      price: "$90/hour",
      details: "Safety certificates provided"
    },
    { 
      icon: Ruler, 
      title: "Carpentry", 
      desc: "Shelving, cabinets, decking - quality timber work",
      price: "Quoted onsite",
      details: "Custom designs"
    },
    { 
      icon: Home, 
      title: "Assembly", 
      desc: "IKEA furniture, TVs, fixtures - we install it all",
      price: "$75/hour",
      details: "All brands, secure mounting"
    },
  ];

  const polaroids = [
    { image: "/handyman_01.png", title: "Door Fixed", caption: "Richmond - Dec 2024", rotate: -5 },
    { image: "/handyman_02.png", title: "Room Painted", caption: "South Yarra - Nov 2024", rotate: 3 },
    { image: "/handyman_03.png", title: "Tap Repaired", caption: "Hawthorn - Nov 2024", rotate: -2 },
    { image: "/handyman_04.png", title: "TV Mounted", caption: "Toorak - Oct 2024", rotate: 4 },
  ];

  const oddJobs = [
    { icon: "🪑", title: "Chair leg fixed" },
    { icon: "🚪", title: "Squeaky door" },
    { icon: "💡", title: "Light switch" },
    { icon: "🪟", title: "Screen repair" },
    { icon: "🔩", title: "Loose handle" },
    { icon: "🎨", title: "Touch up paint" },
    { icon: "🪠", title: "Slow drain" },
    { icon: "📸", title: "Mirror hung" },
  ];

  const testimonials = [
    { text: "Dave fixed our bathroom door, two dripping taps, and patched a hole in the plaster. All done in 3 hours. Great bloke, fair price.", author: "Jennifer - Richmond", color: "bg-yellow-200", rotate: -3 },
    { text: "Mounted our 65 inch TV, assembled a complex IKEA wardrobe, and hung 15 picture frames. Very careful work.", author: "Michael - South Yarra", color: "bg-green-200", rotate: 2 },
    { text: "Sanded and stained our deck that was looking terrible. Also fixed loose balustrades. Deck looks brand new!", author: "Lisa - Hawthorn", color: "bg-blue-200", rotate: -2 },
  ];

  const faqs = [
    { q: "Do you charge by the hour or the job?", a: "We offer both! Small repairs are typically hourly ($75-95/hr), while larger projects get a fixed quote upfront so you know exactly what you'll pay." },
    { q: "What's the smallest job you'll take?", a: "No job is too small! We've hung pictures, fixed loose handles, changed lightbulbs, and assembled IKEA furniture. If it's on your to-do list, we'll do it." },
    { q: "Are you licensed for plumbing and electrical?", a: "Yes! We hold all required licenses for the work we perform. Our team includes licensed plumbers and electricians." },
    { q: "How soon can you come out?", a: "We offer same-day service for urgent repairs when available. Typically we can schedule within 2-3 business days for non-urgent work." },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-slate-800 overflow-x-hidden pt-10">
      <DemoBanner />
      <style>{`
        @keyframes tape-animation {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .font-handwriting {
          font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
        }
        .tape {
          position: absolute;
          width: 80px;
          height: 30px;
          background: rgba(255,255,255,0.4);
          top: -15px;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          animation: tape-animation 3s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-10 w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Dave's <span className="text-amber-600">Handyman</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-amber-600 transition">Services</a>
              <a href="#gallery" className="text-slate-600 hover:text-amber-600 transition">Gallery</a>
              <a href="#reviews" className="text-slate-600 hover:text-amber-600 transition">Reviews</a>
              <a href="#contact" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition shadow-md">
                Get a Quote
              </a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(180, 83, 9, 0.1) 100px, rgba(180, 83, 9, 0.1) 102px)`,
        }} />
        
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm mb-6 border-2 border-amber-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed Plumber & Electrician • 15+ Years Experience</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Local<br />
              <span className="text-amber-600">Handyman</span><br />
              Dave
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              Hi, I'm Dave. I've been fixing homes across Melbourne's inner east for over 15 years. From leaky taps to full deck restorations - I handle it all.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="tel:0412456789" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call Dave: 0412 456 789
              </a>
              <a href="#services" className="px-8 py-4 bg-white border-2 border-amber-200 text-amber-700 rounded-full font-bold text-lg hover:border-amber-400 transition flex items-center justify-center gap-2">
                See Pricing
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {["Same Day Available", "Free Quotes", "12 Month Warranty"].map((badge) => (
                <span key={badge} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-600 shadow-sm border border-slate-200">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4 p-4">
              {polaroids.map((p, idx) => (
                <Polaroid key={idx} {...p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Tool Belt */}
      <section id="services" className="py-24 bg-amber-50 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Dave's Services</h2>
            <p className="text-slate-600">No job too big or small</p>
          </div>

          {/* Tool Belt */}
          <div className="bg-gradient-to-b from-amber-700 to-amber-800 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {services.map((service, idx) => (
                <ToolBeltItem
                  key={idx}
                  icon={service.icon}
                  title={service.title}
                  isActive={activeService === idx}
                  onClick={() => setActiveService(idx)}
                />
              ))}
            </div>
          </div>

          {/* Active Service Detail */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-amber-200">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = services[activeService].icon;
                  return <Icon className="w-10 h-10 text-amber-600" />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{services[activeService].title}</h3>
                <p className="text-slate-600 mb-4">{services[activeService].desc}</p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold">
                    {services[activeService].price}
                  </span>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {services[activeService].details}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Job Too Small - Odd Jobs Collage */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">No Job Too Small</h2>
            <p className="text-slate-600">If it's on your to-do list, I'll do it</p>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {oddJobs.map((job, idx) => (
              <OddJobItem key={idx} {...job} />
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section id="gallery" className="py-24 bg-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Recent Work</h2>
          <p className="text-slate-600 text-center mb-12">Swipe through Dave's transformations</p>
          
          <BeforeAfterGallery />
        </div>
      </section>

      {/* Sticky Note Testimonials */}
      <section id="reviews" className="py-24 bg-stone-200 relative">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Happy Customers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <StickyNote key={idx} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-amber-200 rounded-xl overflow-hidden hover:border-amber-300 transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-left bg-amber-50 hover:bg-amber-100 transition"
                >
                  <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {idx === 0 && <Hammer className="w-5 h-5 text-amber-700" />}
                    {idx === 1 && <Paintbrush className="w-5 h-5 text-amber-700" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5 text-amber-700" />}
                    {idx === 3 && <Clock className="w-5 h-5 text-amber-700" />}
                  </div>
                  <span className="font-semibold text-slate-800 flex-1">{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <span className="text-sm">▼</span>
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-slate-600 pl-14">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's Get To Work!</h2>
          <p className="text-xl text-amber-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Whatever's on your to-do list, I'm ready to tackle it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0412456789" className="px-12 py-5 bg-white text-amber-600 rounded-full font-bold text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 group mx-auto shadow-xl">
              <Phone className="w-6 h-6" />
              Call Dave: 0412 456 789
            </a>
          </div>
          
          <p className="text-amber-100 mt-8">Free quotes • Same day when possible • All work guaranteed</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-8 h-8 text-amber-400" />
                <span className="text-2xl font-bold">Dave's <span className="text-amber-400">Handyman</span></span>
              </div>
              <p className="text-amber-200">Local Melbourne handyman. Licensed plumber & electrician. Inner East specialist.</p>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Services</h4>
              <ul className="space-y-2 text-amber-200">
                <li>Home Repairs</li>
                <li>Painting</li>
                <li>Plumbing</li>
                <li>Electrical</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Contact</h4>
              <ul className="space-y-2 text-amber-200">
                <li>0412 456 789</li>
                <li>dave@handyman.melbourne</li>
                <li>Mon-Sat: 7am-6pm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Areas</h4>
              <ul className="space-y-2 text-amber-200">
                <li>Richmond</li>
                <li>South Yarra</li>
                <li>Hawthorn</li>
                <li>Toorak & Kew</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 pt-8 text-center text-amber-300 text-sm">
            © 2024 Dave's Handyman Services. Lic: PL12345 | ELC67890 | Fully Insured.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;