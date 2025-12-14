import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton } from './GlassUI';
import { BookingState, VenueType, BookingRecord } from '../types';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

const VENUES: { type: VenueType; price: number; unit: string }[] = [
  { type: 'Football Pitch', price: 8000, unit: '/hour' },
  { type: 'Courtyard', price: 100000, unit: '/day' },
  { type: 'Palm Garden', price: 100000, unit: '/day' },
  { type: 'Kids Playground', price: 200, unit: '/person' },
];

const SERVICE_ID = 'service_c57rfmu';
const TEMPLATE_ID = 'template_6jxnaaf';
const PUBLIC_KEY = 'RXXbFYl19spWvwbwS';

const Booking: React.FC = () => {
  const { addBooking } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  
  // Availability State
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0); // Days to offset calendar view

  // Initialize EmailJS
  useEffect(() => {
    try {
      emailjs.init(PUBLIC_KEY);
    } catch (e) {
      console.warn("EmailJS init warning:", e);
    }
  }, []);

  // Helper to get local YYYY-MM-DD string
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<BookingState>({
    name: '',
    email: '',
    phone: '',
    venue: 'Football Pitch',
    date: getLocalDateString(new Date()), // Default to today
    endDate: '',
    time: '',
    duration: 1,
    guests: { adults: 0, children: 0 },
    message: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch existing bookings when Venue changes to show availability
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        // Fetch bookings starting from beginning of today to ensure calendar is accurate
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
          .from('bookings')
          .select('start_time, end_time, status')
          .eq('venue', formData.venue)
          .neq('status', 'Rejected') // Ignore rejected bookings
          .gte('start_time', today.toISOString()); // Bookings from today onwards

        if (error) throw error;
        setExistingBookings(data || []);
      } catch (err) {
        console.error("Error fetching availability:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [formData.venue]);

  useEffect(() => {
    // Pricing Logic
    const selectedVenue = VENUES.find(v => v.type === formData.venue);
    if (!selectedVenue) return;

    let price = 0;
    if (formData.venue === 'Football Pitch') {
      price = selectedVenue.price * (formData.duration || 1);
    } else if (formData.venue === 'Kids Playground') {
       // 200 naira gate fee per individual (adults + children)
       const totalGuests = (formData.guests?.children || 0) + (formData.guests?.adults || 0);
       price = totalGuests * selectedVenue.price;
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

    // Sanitize Phone Number
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^0-9+\-\s()]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (type: 'adults' | 'children', val: number) => {
    setFormData(prev => ({
      ...prev,
      guests: { ...prev.guests!, [type]: Math.max(0, val) }
    }));
  };

  const checkConflict = async (start: string, end: string) => {
    // Check database for overlaps
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('venue', formData.venue)
      .neq('status', 'Rejected')
      .lt('start_time', end) // Existing Start < New End
      .gt('end_time', start); // Existing End > New Start

    if (error) throw error;
    return data && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Time Calculation
      let startDateTime = '';
      let stopDateTime = '';

      if (formData.venue === 'Football Pitch') {
        if (!formData.time || !formData.date) {
          throw new Error('Please select both date and time.');
        }
        
        const isoStart = `${formData.date}T${formData.time}:00`;
        const startDateObj = new Date(isoStart);
        
        if (isNaN(startDateObj.getTime())) {
          throw new Error("Invalid Date or Time selected");
        }

        startDateTime = startDateObj.toISOString();

        // Calculate Stop based on duration
        const durationHours = formData.duration || 1;
        const stopDateObj = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);
        stopDateTime = stopDateObj.toISOString();

      } else {
        if (!formData.date) {
           throw new Error('Please select a start date.');
        }
        // Set to start of day for accurate full-day locking
        startDateTime = new Date(`${formData.date}T00:00:00`).toISOString();
        
        const endDate = formData.endDate || formData.date;
        // Set to end of day
        stopDateTime = new Date(`${endDate}T23:59:59`).toISOString();
      }

      // 2. Conflict Check (Server Side)
      const hasConflict = await checkConflict(startDateTime, stopDateTime);
      if (hasConflict) {
        throw new Error(
          formData.venue === 'Football Pitch' 
            ? "This time slot is already booked. Please choose another time." 
            : "This date is already fully booked. Please check availability."
        );
      }

      // 3. Generate Booking Code
      const code = `JK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // 4. Insert into Supabase
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_code: code,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            venue: formData.venue,
            start_time: startDateTime,
            end_time: stopDateTime,
            duration: formData.duration || 0,
            guests_adults: formData.guests?.adults || 0,
            guests_children: formData.guests?.children || 0,
            price: totalPrice,
            message: formData.message,
            status: 'Pending'
          }
        ]);

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(error.message || 'Database insert failed.');
      }

      // 5. Send Confirmation Email via EmailJS
      try {
        console.log("Preparing to send email to:", formData.email);
        const templateParams = {
          to_name: formData.name,
          to_email: formData.email,
          booking_code: code,
          venue: formData.venue,
          date: formData.date,
          time: formData.venue === 'Football Pitch' ? formData.time : 'Full Day',
          total_price: totalPrice.toLocaleString(),
          message: formData.message || 'No additional notes',
          reply_to: 'bookings@jkpalmandgarden.com'
        };

        const response = await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          templateParams,
          PUBLIC_KEY
        );
        console.log("Confirmation email sent successfully!", response);

      } catch (emailError: any) {
        console.error("Failed to send confirmation email:", emailError);
        // Improved Error Logging
        if (emailError && emailError.text) {
             console.error("EmailJS Error Text:", emailError.text);
             // alert("Email Error: " + emailError.text); // Uncomment to see error in alert
        } else {
             console.error("EmailJS Error Details:", JSON.stringify(emailError));
        }
      }

      // 6. Success State
      setBookingCode(code);
      setStep(3);
      
      addBooking({
        ...formData,
        id: code,
        status: 'Pending',
        submissionDate: new Date().toISOString(),
        totalPrice: totalPrice
      });

    } catch (error: any) {
      console.error('Submission Error:', error);
      let msg = error.message || 'An unexpected error occurred.';
      if (msg.includes('apikey')) {
        msg = 'Database configuration missing. Please check connection.';
      }
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Calendar Logic
  const renderCalendarReal = () => {
    // Generate 7 days based on offset
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + calendarOffset);
    
    // Correct logic for calendar days
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }

    // Month Label
    const monthLabel = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
      <>
        <div className="flex justify-between items-center mb-2 px-1">
          <button 
            type="button"
            onClick={() => setCalendarOffset(prev => Math.max(0, prev - 7))}
            disabled={calendarOffset === 0}
            className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${calendarOffset === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{monthLabel}</span>
          <button 
            type="button"
            onClick={() => setCalendarOffset(prev => prev + 7)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-6">
          {days.map((d, i) => (
            <span key={`h-${i}`} className="text-[10px] font-bold text-gray-500 uppercase">
              {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
            </span>
          ))}
          
          {days.map((d, i) => {
            // Check status for this day
            const dateStr = getLocalDateString(d);
            
            let status = 'available';
            
            // Check availability
            // Convert booking timestamps to local date strings for comparison
            const hasBooking = existingBookings.find(b => {
              const bookingDate = new Date(b.start_time);
              const bookingDateStr = getLocalDateString(bookingDate);
              return bookingDateStr === dateStr;
            });

            if (hasBooking) {
              status = hasBooking.status === 'Approved' ? 'booked' : 'pending';
            }
            
            // Highlight selected day
            const isSelected = formData.date === dateStr;

            const color = status === 'booked' 
              ? 'bg-red-400/50 text-red-900 dark:text-red-100' 
              : status === 'pending' 
                ? 'bg-yellow-400/50 text-yellow-900 dark:text-yellow-100' 
                : isSelected
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-emerald-400/30 hover:bg-blue-500 hover:text-white cursor-pointer text-emerald-900 dark:text-emerald-100';

            return (
              <div 
                key={i} 
                onClick={() => {
                   // Allow selecting a day even if it has bookings
                   setFormData(prev => ({ ...prev, date: dateStr }));
                }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all duration-300 ${color}`}
              >
                <span className="font-bold">{d.getDate()}</span>
              </div>
            )
          })}
        </div>
      </>
    );
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-white mb-4">
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
              Your booking for <strong>{formData.venue}</strong> has been received. <br/>
              Booking Code: <span className="font-mono font-bold text-emerald-500">{bookingCode}</span><br/>
              A confirmation email has been sent to {formData.email} from bookings@jkpalmandgarden.com.
            </p>
            <div className="flex justify-center">
              <GlassButton onClick={() => navigate('/')} variant="secondary">Back to Home</GlassButton>
            </div>
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
                              ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-blue-600 shadow-lg scale-105' 
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

                  {submitError && (
                    <div className="p-4 bg-red-500/20 border border-red-500 text-red-600 dark:text-red-300 rounded-lg text-sm">
                      {submitError}
                    </div>
                  )}

                  <GlassButton type="submit" className="w-full justify-center mt-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Checking Availability...
                      </span>
                    ) : (
                      "Confirm & Submit Booking"
                    )}
                  </GlassButton>
                </form>
              </GlassCard>
            </div>

            {/* Summary Sidebar */}
            <div className="md:col-span-1">
               <div className="sticky top-28 space-y-6">
                 {/* Calendar Preview */}
                 <GlassCard className="p-4">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Live Availability</h4>
                      {loadingAvailability && <RefreshCw className="animate-spin text-emerald-500" size={14} />}
                   </div>
                   
                   {renderCalendarReal()}

                   <div className="flex gap-2 text-[10px] justify-center text-gray-500 mt-4">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div>Avail</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div>Busy</span>
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