import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton } from './GlassUI';
import { BookingState, VenueType, BookingRecord } from '../types';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Loader2, RefreshCw, ChevronLeft, ChevronRight, Download, Printer, TreePalm } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';

const Booking: React.FC = () => {
  const { addBooking, pricing } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  
  // Availability State
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Derived Venues for UI
  const [venuesList, setVenuesList] = useState<{ type: VenueType; price: number; unit: string }[]>([]);

  useEffect(() => {
    if (pricing && pricing.length > 0) {
      // Create a unique list of venues based on known types
      const types: VenueType[] = ['Football Pitch', 'Courtyard', 'Palm Garden', 'Kids Playground', 'Sendforth Event'];
      const derived = types.map(t => {
        // Find the most relevant pricing item
        const item = pricing.find(p => p.title.includes(t) || p.category === 'Venue' && t === 'Courtyard');
        
        // Default fallbacks if not found
        let price = 0;
        let unit = '';

        if (t === 'Football Pitch') {
            const h1 = pricing.find(p => p.title.includes('1 Hour') && p.title.includes('Football'));
            price = h1 ? h1.price : 8000;
            unit = '/hour';
        } else if (t === 'Kids Playground') {
            const p = pricing.find(p => p.title.includes('Kids') || p.category === 'Entry');
            price = p ? p.price : 200;
            unit = '/child';
        } else {
            const p = pricing.find(p => p.title.toLowerCase().includes(t.toLowerCase()));
            price = p ? p.price : 100000;
            unit = t === 'Sendforth Event' ? '/event' : '/day';
        }

        return { type: t, price, unit };
      });
      setVenuesList(derived);
    } else {
      // Fallback defaults
      setVenuesList([
        { type: 'Football Pitch', price: 8000, unit: '/hour' },
        { type: 'Courtyard', price: 100000, unit: '/day' },
        { type: 'Palm Garden', price: 100000, unit: '/day' },
        { type: 'Kids Playground', price: 200, unit: '/child' },
        { type: 'Sendforth Event', price: 100000, unit: '/event' },
      ]);
    }
  }, [pricing]);
  
  // Calendar View State
  const [viewDate, setViewDate] = useState(new Date());

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
    const selectedVenue = venuesList.find(v => v.type === formData.venue);
    if (!selectedVenue) return;

    let price = 0;
    if (formData.venue === 'Football Pitch') {
      // Use specific prices for durations if defined in the editable pricing
      const duration = formData.duration || 1;
      const specificItem = pricing.find(p => 
        p.category === 'Venue' && 
        p.title.includes('Football') && 
        (p.title.includes(`${duration} Hour`) || p.title.includes(`${duration} hr`))
      );
      
      if (specificItem) {
        price = specificItem.price;
      } else {
        // Fallback to linear
        price = selectedVenue.price * duration;
      }
    } else if (formData.venue === 'Kids Playground') {
       // 200 naira gate fee per child as requested
       const totalChildren = formData.guests?.children || 0;
       price = totalChildren * selectedVenue.price;
    } else {
      // Per day calculation for Courtyard/Palm Garden/Sendforth
      let days = 1;
      if (formData.date && formData.endDate && formData.venue !== 'Sendforth Event') {
        const start = new Date(formData.date);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
        days = diffDays > 0 ? diffDays : 1;
      }
      price = selectedVenue.price * days;
    }
    setTotalPrice(price);
  }, [formData, venuesList, pricing]);

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

      // 5. Success State (No Email)
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById('receipt-card');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2 // Higher resolution
        });
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = `JK_Receipt_${bookingCode}.png`;
        link.click();
      } catch (error) {
        console.error("Failed to generate image", error);
        alert("Could not generate receipt image. Please try the Print option.");
      }
    }
  };

  // --- Calendar Navigation Helpers ---
  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // --- Render Full Month Calendar ---
  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
    const today = new Date();
    today.setHours(0,0,0,0);

    const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const days = [];
    
    // Add empty padding slots for start of month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(<div key={`pad-${i}`} className="aspect-square"></div>);
    }
    
    // Generate days
    for (let d = 1; d <= daysInMonth; d++) {
        const currentDayDate = new Date(year, month, d);
        const dateStr = getLocalDateString(currentDayDate);
        
        const isPast = currentDayDate < today;
        let status = 'available';

        if (isPast) {
            status = 'disabled';
        } else {
             // Check existing bookings for this specific date
            const hasBooking = existingBookings.find(b => {
              const bookingDate = new Date(b.start_time);
              const bookingDateStr = getLocalDateString(bookingDate);
              return bookingDateStr === dateStr;
            });

            if (hasBooking) {
              status = hasBooking.status === 'Approved' ? 'booked' : 'pending';
            }
        }

        const isSelected = formData.date === dateStr;
        
        let colorClass = 'bg-emerald-400/20 hover:bg-emerald-500 hover:text-white text-emerald-900 dark:text-emerald-100 cursor-pointer';
        
        if (status === 'disabled') colorClass = 'opacity-30 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400';
        else if (status === 'booked') colorClass = 'bg-red-400/50 text-red-900 dark:text-red-100 cursor-not-allowed';
        else if (status === 'pending') colorClass = 'bg-yellow-400/50 text-yellow-900 dark:text-yellow-100 cursor-pointer hover:bg-yellow-500 hover:text-white';
        
        // Highlight selection
        if (isSelected) colorClass = 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 transform scale-105';

        days.push(
            <div 
                key={d}
                onClick={() => {
                    if (status !== 'disabled' && status !== 'booked') {
                        setFormData(prev => ({ ...prev, date: dateStr }));
                    }
                }}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${colorClass}`}
            >
                {d}
            </div>
        );
    }

    return (
      <div className="w-full">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4 px-2">
          <button 
            type="button" 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Previous Month"
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-white" />
          </button>
          
          <span className="font-bold text-gray-800 dark:text-white text-lg">{monthLabel}</span>
          
          <button 
            type="button" 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Next Month"
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-white" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
            <span key={day} className="text-[10px] font-bold text-gray-500 uppercase">{day}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
            {days}
        </div>
        
        <div className="text-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50">
             <button 
                type="button" 
                className="text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline" 
                onClick={handleNextMonth}
             >
                Check availability in {new Date(year, month + 1).toLocaleString('default', {month:'long'})} →
             </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 print:hidden">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-white mb-4">
            Book Your Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Seamless booking for your perfect event or game.</p>
        </div>

        {step === 3 ? (
          <div className="flex flex-col items-center">
            {/* Action Buttons (Hidden on Print) */}
            <div className="flex gap-4 mb-8 print:hidden">
              <GlassButton onClick={handleDownload} variant="primary">
                <Download size={20} /> Download to Gallery
              </GlassButton>
              <GlassButton onClick={handlePrint} variant="secondary">
                <Printer size={20} /> Print Receipt
              </GlassButton>
              <GlassButton onClick={() => navigate('/')} variant="secondary" className="border-red-200 hover:bg-red-50 text-red-600">
                Close
              </GlassButton>
            </div>

            {/* Receipt Card - This is what gets printed/downloaded */}
            <div id="receipt-card" className="bg-white text-gray-900 w-full max-w-md p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500 relative overflow-hidden">
               {/* Watermark */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                 <TreePalm size={300} />
               </div>

               <div className="relative z-10 text-center">
                 <div className="flex items-center justify-center gap-2 mb-2">
                   <div className="bg-emerald-500 p-2 rounded-lg">
                     <TreePalm className="text-white" size={24} />
                   </div>
                   <h2 className="text-2xl font-bold text-emerald-800">JK Palms</h2>
                 </div>
                 <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Booking Receipt</p>
                 
                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
                   <p className="text-sm text-emerald-600 mb-1">Booking Reference</p>
                   <p className="text-3xl font-mono font-bold text-emerald-700 tracking-wider">{bookingCode}</p>
                 </div>

                 <div className="space-y-4 text-left">
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                       <span className="text-gray-500 text-sm">Customer</span>
                       <span className="font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                       <span className="text-gray-500 text-sm">Venue</span>
                       <span className="font-bold">{formData.venue}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                       <span className="text-gray-500 text-sm">Date</span>
                       <span className="font-bold">{formData.date}</span>
                    </div>
                    {formData.venue === 'Football Pitch' ? (
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                         <span className="text-gray-500 text-sm">Time</span>
                         <span className="font-bold">{formData.time} ({formData.duration}hrs)</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-gray-500 text-sm">Total Amount</span>
                       <span className="text-xl font-bold text-emerald-600">₦{totalPrice.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="mt-8 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Please present this receipt at the entrance to gain access.
                      <br/>Contact: +234 811 886 1619
                    </p>
                 </div>
               </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 print:hidden">
              Your booking status is currently <strong>Pending</strong>. You can proceed to the venue with this receipt.
            </p>
          </div>
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
                          {venuesList.map(v => (
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
            <div className="md:col-span-1 print:hidden">
               <div className="sticky top-28 space-y-6">
                 {/* Calendar Preview */}
                 <GlassCard className="p-4">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Live Availability</h4>
                      {loadingAvailability && <RefreshCw className="animate-spin text-emerald-500" size={14} />}
                   </div>
                   
                   {renderCalendar()}

                   <div className="flex gap-2 text-[10px] justify-center text-gray-500 mt-4 flex-wrap">
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