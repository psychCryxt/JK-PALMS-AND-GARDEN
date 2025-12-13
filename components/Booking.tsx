import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from './GlassUI';
import { BookingState, VenueType } from '../types';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const VENUES: { type: VenueType; price: number; unit: string }[] = [
  { type: 'Football Pitch', price: 15000, unit: '/hour' },
  { type: 'Courtyard', price: 100000, unit: '/day' },
  { type: 'Palm Garden', price: 80000, unit: '/day' },
  { type: 'Kids Playground', price: 2000, unit: '/child' },
];

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingState>({
    name: '',
    email: '',
    phone: '',
    venue: 'Football Pitch',
    date: '',
    endDate: '',
    time: '',
    duration: 1,
    guests: { adults: 0, children: 0 },
    message: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Pricing Logic
    const selectedVenue = VENUES.find(v => v.type === formData.venue);
    if (!selectedVenue) return;

    let price = 0;
    if (formData.venue === 'Football Pitch') {
      price = selectedVenue.price * (formData.duration || 1);
    } else if (formData.venue === 'Kids Playground') {
       price = (formData.guests?.children || 0) * selectedVenue.price;
       if (price === 0) price = 5000; // Base estimate
    } else {
      // Per day calculation for Courtyard/Palm Garden
      let days = 1;
      if (formData.date && formData.endDate) {
        const start = new Date(formData.date);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
        days = diffDays > 0 ? diffDays : 1;
      }
      price = selectedVenue.price * days;
    }
    setTotalPrice(price);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (type: 'adults' | 'children', val: number) => {
    setFormData(prev => ({
      ...prev,
      guests: { ...prev.guests!, [type]: Math.max(0, val) }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
  };

  // Mock Calendar Visualization
  const renderCalendarMock = () => {
    const days = Array.from({ length: 7 }, (_, i) => i + 20); // Mock days 20th-26th
    return (
      <div className="grid grid-cols-7 gap-2 text-center mb-6">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-xs font-bold text-gray-500">{d}</span>)}
        {days.map(d => {
          const status = d % 3 === 0 ? 'booked' : d % 4 === 0 ? 'pending' : 'available';
          const color = status === 'booked' ? 'bg-red-400/50' : status === 'pending' ? 'bg-yellow-400/50' : 'bg-emerald-400/30 hover:bg-emerald-500 cursor-pointer';
          return (
            <div key={d} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${color}`}>
              {d}
            </div>
          )
        })}
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-500 dark:from-emerald-300 dark:to-white mb-4">
            Book Your Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Seamless booking for your perfect event or game.</p>
        </div>

        {step === 3 ? (
          <GlassCard className="text-center py-16">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50"
            >
              <CheckCircle className="text-white w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Booking Request Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              We have received your request for <strong>{formData.venue}</strong>. An admin will review the availability and confirm your booking via email ({formData.email}) shortly.
            </p>
            <GlassButton onClick={() => window.location.href = '/'} variant="secondary">Back to Home</GlassButton>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-2">
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <User size={20} /> Contact Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+234..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="you@example.com" />
                    </div>
                  </div>

                  <div className="border-t border-gray-400/20 my-6"></div>

                  {/* Step 2: Venue Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Calendar size={20} /> Event Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Venue</label>
                      <div className="grid grid-cols-2 gap-3">
                        {VENUES.map(v => (
                          <div 
                            key={v.type}
                            onClick={() => setFormData(prev => ({ ...prev, venue: v.type, endDate: '', time: '' }))}
                            className={`cursor-pointer p-4 rounded-xl border transition-all ${
                              formData.venue === v.type 
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105' 
                              : 'bg-white/40 dark:bg-black/20 border-gray-300 dark:border-gray-700 hover:bg-white/60'
                            }`}
                          >
                            <div className="font-bold text-sm">{v.type}</div>
                            <div className="text-xs opacity-80">₦{v.price.toLocaleString()} {v.unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          {formData.venue === 'Football Pitch' ? 'Date' : 'Start Date'}
                        </label>
                        <input 
                          required 
                          type="date" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleInputChange} 
                          className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" 
                        />
                      </div>
                      
                      {formData.venue === 'Football Pitch' ? (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time</label>
                          <input required type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">End Date</label>
                          <input 
                            required 
                            type="date" 
                            name="endDate" 
                            min={formData.date}
                            value={formData.endDate} 
                            onChange={handleInputChange} 
                            className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Football Duration Logic */}
                    {formData.venue === 'Football Pitch' && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration (Hours)</label>
                        <div className="flex gap-2 flex-wrap">
                           {[1, 1.5, 2, 2.5].map(d => (
                             <button
                               key={d}
                               type="button"
                               onClick={() => setFormData(prev => ({ ...prev, duration: d }))}
                               className={`px-4 py-2 rounded-lg text-sm border ${formData.duration === d ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white/40 dark:bg-black/20 dark:text-gray-300'}`}
                             >
                               {d} hr
                             </button>
                           ))}
                        </div>
                        <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                          <AlertCircle size={12}/> Includes 20min buffer between games.
                        </p>
                      </div>
                    )}

                    {/* Guest Count for non-football */}
                    {formData.venue !== 'Football Pitch' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/30 dark:bg-black/20 p-3 rounded-lg">
                          <label className="block text-xs font-bold mb-2 uppercase text-gray-500">Adults</label>
                          <input type="number" min="0" value={formData.guests?.adults} onChange={(e) => handleGuestChange('adults', parseInt(e.target.value))} className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none p-1" />
                        </div>
                        <div className="bg-white/30 dark:bg-black/20 p-3 rounded-lg">
                          <label className="block text-xs font-bold mb-2 uppercase text-gray-500">Children</label>
                          <input type="number" min="0" value={formData.guests?.children} onChange={(e) => handleGuestChange('children', parseInt(e.target.value))} className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none p-1" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Message / Special Requests</label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3} className="w-full bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                    </div>
                  </div>

                  <GlassButton type="submit" className="w-full justify-center mt-6">
                    Confirm & Submit Booking
                  </GlassButton>
                </form>
              </GlassCard>
            </div>

            {/* Summary Sidebar */}
            <div className="md:col-span-1">
               <div className="sticky top-28 space-y-6">
                 {/* Calendar Preview */}
                 <GlassCard className="p-4">
                   <h4 className="text-sm font-bold mb-4 text-gray-700 dark:text-gray-300">Availability Preview</h4>
                   {renderCalendarMock()}
                   <div className="flex gap-2 text-[10px] justify-center text-gray-500">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div>Avail</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div>Pending</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full"></div>Booked</span>
                   </div>
                 </GlassCard>

                 {/* Price Summary */}
                 <GlassCard className="bg-emerald-900/10 dark:bg-emerald-500/10 border-emerald-500/30">
                   <h3 className="text-lg font-bold mb-4 border-b border-emerald-500/20 pb-2">Booking Summary</h3>
                   <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                     <div className="flex justify-between">
                       <span>Venue</span>
                       <span className="font-bold">{formData.venue}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>{formData.venue === 'Football Pitch' ? 'Date' : 'Start Date'}</span>
                       <span>{formData.date || 'Not selected'}</span>
                     </div>
                     {formData.venue !== 'Football Pitch' && formData.endDate && (
                       <div className="flex justify-between">
                         <span>End Date</span>
                         <span>{formData.endDate}</span>
                       </div>
                     )}
                     {formData.venue === 'Football Pitch' && (
                       <div className="flex justify-between">
                         <span>Duration</span>
                         <span>{formData.duration} hrs</span>
                       </div>
                     )}
                     <div className="border-t border-emerald-500/20 pt-3 flex justify-between items-center">
                       <span className="font-bold">Total Estimated</span>
                       <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₦{totalPrice.toLocaleString()}</span>
                     </div>
                   </div>
                 </GlassCard>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;