import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Utensils, Lock, Smile, Home as HomeIcon, Clock, PartyPopper, Trees, X, ChevronUp, Instagram } from 'lucide-react';
import { HERO_TITLE, HERO_SUBTITLE } from '../constants';
import { GlassCard, GlassButton } from './GlassUI';
import { useData } from '../context/DataContext';

const Home: React.FC = () => {
  const { hash } = useLocation();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Use Data from Context
  const { features, services, galleryImages, heroImage, testimonials } = useData();

  // Handle Hash Scrolling
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  // Handle Scroll to Top visibility
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden px-4" id="home">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm font-semibold mb-6 border border-emerald-500/30">
              Welcome to JK Palms & Garden
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-emerald-600 to-teal-500 dark:from-white dark:to-emerald-200">
              {HERO_TITLE}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-lg leading-relaxed glass-panel p-4 rounded-xl">
              {HERO_SUBTITLE}
            </p>
            <div className="flex gap-4">
              <Link to="/booking">
                <GlassButton variant="primary">
                  Book Your Visit <ArrowRight size={18} />
                </GlassButton>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12 w-fit">
              {[
                { label: 'Happy Visitors', val: '20K+' },
                { label: 'Services Offered', val: '15+' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stat.val}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="relative z-0 hidden md:block"
          >
            <div className="relative w-full h-[600px]">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
              <img 
                src={heroImage} 
                alt="Nature" 
                className="rounded-3xl shadow-2xl object-cover w-full h-full border-4 border-white/30 transform hover:scale-105 transition-duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-sm border-y border-white/30 dark:border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
             <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">About JK Palms & Garden</h2>
             <div className="h-1 w-20 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
             <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
               <span className="font-bold text-emerald-600 dark:text-emerald-400">Discover Our Family-Friendly Paradise.</span> Welcome to a haven where family fun and relaxation intertwine! Our family-friendly paradise offers something for everyone, ensuring that both kids and adults create lasting memories together.
             </p>
             <p className="text-gray-600 dark:text-gray-300">
               With serene spots for picnicking, meditation, or simply enjoying a good book, our park is the perfect escape from the hustle and bustle of daily life.
             </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Our Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore the best features of JK Palms and Garden Park.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} delay={index * 0.2} hoverEffect className="group overflow-hidden">
                <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-emerald-700 dark:text-emerald-400">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-sm border-y border-white/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Our Services & Events</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              From guided nature walks to event hosting, we offer a variety of services designed to enhance your experience. We host parties, corporate events, and weddings in our beautiful Courtyard and Palm Garden.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service) => {
                 const icons: any = { 
                   home: HomeIcon, 
                   coffee: Utensils, 
                   lock: Lock, 
                   smile: Smile,
                   party: PartyPopper,
                   tree: Trees
                 };
                 const Icon = icons[service.icon] || HomeIcon;
                 return (
                   <div key={service.id} className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-black/20 hover:bg-white/60 transition-colors border border-white/10">
                     <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg h-fit">
                       <Icon className="text-emerald-600 dark:text-emerald-400" size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-800 dark:text-white mb-1">{service.title}</h4>
                       <p className="text-xs text-gray-600 dark:text-gray-400">{service.description}</p>
                     </div>
                   </div>
                 )
              })}
            </div>
          </div>
          
          <div className="relative">
             <GlassCard className="p-8 relative z-10">
               <h3 className="text-2xl font-bold mb-6 text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                 <Clock /> Opening Hours
               </h3>
               <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-gray-500/20 pb-4">
                   <span className="font-medium text-gray-700 dark:text-gray-200">Monday - Friday</span>
                   <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-bold">08:00 AM - 10:00 PM</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-gray-500/20 pb-4">
                   <span className="font-medium text-gray-700 dark:text-gray-200">Saturday - Sunday</span>
                   <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-bold">08:00 AM - 10:00 PM</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="font-medium text-gray-700 dark:text-gray-200">Holiday</span>
                   <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-bold">09:00 AM - 11:00 PM</span>
                 </div>
               </div>
             </GlassCard>
             {/* Decorative blob */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl -z-10"></div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">Our Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((image, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 relative group ${idx === 0 || idx === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}
                onClick={() => setLightboxImage(image)}
              >
                <img 
                  src={image} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold tracking-widest border border-white px-4 py-2 rounded-lg">VIEW</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Instagram Button */}
          <div className="flex justify-center mt-12">
            <a 
              href="https://www.instagram.com/jkpalms/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <GlassButton variant="secondary" className="flex items-center gap-3 px-8 py-4 text-lg border-emerald-500/30 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent transition-all duration-500">
                <Instagram size={24} /> View More on Instagram
              </GlassButton>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-emerald-50/50 dark:bg-transparent backdrop-blur-sm border-y border-white/30 dark:border-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">Client Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="relative mt-8">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                   <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg" />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{t.comment}"</p>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-emerald-500 font-bold uppercase">{t.role}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer ID for Contact */}
      <div id="contact"></div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-emerald-500 p-2">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={lightboxImage}
              alt="Lightbox"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;