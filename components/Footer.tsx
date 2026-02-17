import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 relative z-10">
      <div className="glass-panel border-b-0 border-r-0 border-l-0 rounded-t-3xl pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-800 dark:text-gray-200">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">JK Palms & Garden</h3>
            <p className="text-sm leading-relaxed opacity-80">
              Where adventure blooms and laughter echoes through the trees! Embrace the beauty of nature while enjoying moments of pure fun.
            </p>
            <div className="flex gap-4">
              <a href="https://web.facebook.com/JKPalmsGarden/?_rdc=1&_rdr" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Facebook size={18}/>
              </a>
              <a href="https://www.instagram.com/jkpalms/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Instagram size={18}/>
              </a>
              <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Twitter size={18}/>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-emerald-500/30 pb-2 inline-block">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 shrink-0" size={18} />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-emerald-500 shrink-0" size={18} />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-emerald-500">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-emerald-500 shrink-0" size={18} />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-emerald-500">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-emerald-500/30 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-emerald-500 hover:pl-2 transition-all block">→ Home</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-500 hover:pl-2 transition-all block">→ Pricing</Link></li>
              <li><Link to="/#about" className="hover:text-emerald-500 hover:pl-2 transition-all block">→ About Us</Link></li>
              <li><Link to="/#services" className="hover:text-emerald-500 hover:pl-2 transition-all block">→ Services</Link></li>
              <li><Link to="/#contact" className="hover:text-emerald-500 hover:pl-2 transition-all block">→ Contact Us</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-500 hover:pl-2 transition-all block font-bold text-emerald-600 dark:text-emerald-400">→ Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-emerald-500/30 pb-2 inline-block">Opening Hours</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>08:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat - Sun:</span>
                <span>08:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Holiday:</span>
                <span>09:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-400/20 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} JK Palms and Garden. All rights reserved. Designed By Alpha Code.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;