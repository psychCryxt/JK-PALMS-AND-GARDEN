import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, GlassButton } from './GlassUI';
import { useData } from '../context/DataContext';
import { Lock, LogOut, Check, X, Edit2, Trash2, Image as ImageIcon, RefreshCw, Loader2, Upload, Plus, Citrus, Calendar, Cloud, CloudOff, Save, AlertTriangle } from 'lucide-react';
import { BookingRecord, EventItem } from '../types';
import { supabase } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'features' | 'gallery' | 'content' | 'events'>('bookings');
  
  // Using any[] to accommodate the extra 'row_id' property mapping without changing global types
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{type: 'feature' | 'gallery' | 'hero' | 'testimonial' | 'logo' | 'event', index?: number} | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { 
    features, updateFeature, 
    galleryImages, updateGallery,
    heroImage, updateHeroImage,
    testimonials, updateTestimonials,
    logo, updateLogo,
    events, updateEvents,
    syncStatus,
    syncError 
  } = useData();

  // Scroll handling
  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        loginRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = data ? data.map((b: any) => ({
        ...b,
        id: b.booking_code || b.id, // Display ID (Booking Code)
        row_id: b.id, // Actual Database Primary Key
        venue: b.venue,
        date: b.start_time ? new Date(b.start_time).toLocaleDateString() : 'N/A',
        time: b.start_time ? new Date(b.start_time).toLocaleTimeString() : 'N/A',
        totalPrice: b.price ? parseFloat(b.price) : 0
      })) : [];
      
      setDbBookings(mappedData);
    } catch (error: any) {
      console.error("Failed to fetch bookings", error);
      if (error.message && error.message.includes("apikey")) {
         alert("Supabase API Key not configured in lib/supabase.ts");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (rowId: any, status: 'Approved' | 'Rejected') => {
    try {
      // Use Primary Key for updates
      const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('id', rowId);

      if (error) throw error;
      
      fetchBookings();
    } catch (e: any) {
      console.error("Update failed:", e);
      alert("Failed to update status: " + (e.message || JSON.stringify(e)));
    }
  };

  const handleDeleteBooking = async (rowId: any, displayId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete booking ${displayId}?`)) return;

    try {
      // Use exact count to detect RLS silent failures
      const { error, count } = await supabase
        .from('bookings')
        .delete({ count: 'exact' })
        .eq('id', rowId);

      if (error) throw error;
      
      // If no rows were deleted, it's likely an RLS permission issue
      if (count === 0) {
        alert("Request sent, but no records were deleted.\n\nPossible Cause: Row Level Security (RLS) policies on Supabase are preventing deletion.\n\nSolution: Go to Supabase Dashboard > Table Editor > 'bookings' > Policies, and ensure the 'anon' or 'public' role has DELETE permissions.");
        return;
      }
      
      // Update local state to remove the deleted item
      setDbBookings(prev => prev.filter(b => b.row_id !== rowId));
      
    } catch (e: any) {
      console.error("Delete failed:", e);
      const msg = e.message || JSON.stringify(e);
      alert(`Failed to delete: ${msg}`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'jkpalms' && password === 'jkpalmsandgarden2025') {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      alert('Invalid Credentials');
    }
  };

  // --- Image Upload Logic ---
  const triggerUpload = (type: 'feature' | 'gallery' | 'hero' | 'testimonial' | 'logo' | 'event', index?: number) => {
    setUploadTarget({ type, index });
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'images' bucket
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error("Bucket 'images' not found. Please create a public bucket named 'images' in your Supabase Dashboard.");
        }
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Update State based on target
      if (uploadTarget?.type === 'feature' && typeof uploadTarget.index === 'number') {
         const feature = features[uploadTarget.index];
         updateFeature(uploadTarget.index, { ...feature, image: publicUrl });
      } else if (uploadTarget?.type === 'gallery') {
         updateGallery([...galleryImages, publicUrl]);
      } else if (uploadTarget?.type === 'hero') {
         updateHeroImage(publicUrl);
      } else if (uploadTarget?.type === 'logo') {
         updateLogo(publicUrl);
      } else if (uploadTarget?.type === 'testimonial' && typeof uploadTarget.index === 'number') {
         const newTestimonials = [...testimonials];
         newTestimonials[uploadTarget.index] = { ...newTestimonials[uploadTarget.index], avatar: publicUrl };
         updateTestimonials(newTestimonials);
      } else if (uploadTarget?.type === 'event' && typeof uploadTarget.index === 'number') {
         const newEvents = [...events];
         newEvents[uploadTarget.index] = { ...newEvents[uploadTarget.index], image: publicUrl };
         updateEvents(newEvents);
      }

      alert("Image uploaded successfully! Saving to cloud...");
    } catch (error: any) {
      console.error('Upload failed:', error);
      
      // Handle RLS Errors specifically to guide the user
      if (error.message && (error.message.includes('row-level security') || error.message.includes('permission denied'))) {
        alert(
          "UPLOAD FAILED: Permission Denied\n\n" +
          "This is a security setting in your Supabase project.\n\n" +
          "HOW TO FIX:\n" +
          "1. Go to Supabase Dashboard > Storage > 'images' bucket.\n" +
          "2. Click the 'Policies' tab (or Configuration).\n" +
          "3. Create a new policy for 'INSERT' (Upload) permissions.\n" +
          "4. Allow access for 'anon' or 'public' users.\n" +
          "5. Save policy and try again."
        );
      } else {
        alert(`Upload failed: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    updateTestimonials(newTestimonials);
  };

  // --- Event Management Logic ---
  const handleAddEvent = () => {
    const newEvent: EventItem = {
      id: Date.now(),
      title: 'New Event',
      date: new Date().toISOString().split('T')[0],
      description: 'Event description goes here...',
      image: 'https://jkpalmandgarden.com/img/exp3.jpg' // Default placeholder
    };
    updateEvents([newEvent, ...events]);
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      updateEvents(events.filter(e => e.id !== id));
    }
  };

  const handleEventChange = (index: number, field: keyof EventItem, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateEvents(newEvents);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div ref={loginRef} className="w-full max-w-md">
          <GlassCard className="p-8 text-center">
            <div className="bg-emerald-500/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Lock className="text-emerald-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <GlassButton type="submit" className="w-full justify-center">Login</GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Helper for sync status Badge
  const getSyncStatusBadge = () => {
    if (syncStatus === 'saving') {
      return <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-bold"><Loader2 className="animate-spin" size={14}/> Saving...</div>;
    }
    if (syncStatus === 'error') {
      return (
        <button 
          onClick={() => alert(`Database Error Details:\n\n${syncError || 'Check console for details.'}\n\nHint: Make sure the table 'site_content' has columns 'key' (text) and 'content' (jsonb).`)}
          className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-bold hover:bg-red-200 transition-colors"
        >
          <CloudOff size={14}/> Sync Error (Click to fix)
        </button>
      );
    }
    return <div className="flex items-center gap-2 text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-sm font-bold"><Cloud size={14}/> All Changes Saved</div>;
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileSelect} 
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-col gap-1">
             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
             {getSyncStatusBadge()}
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['bookings', 'features', 'gallery', 'content', 'events'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${
                activeTab === tab 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'bg-white/20 text-gray-600 dark:text-gray-300 hover:bg-white/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <GlassCard className="min-h-[500px]">
          {isUploading && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="animate-spin text-white w-12 h-12 mb-4" />
              <div className="text-white font-bold">Uploading Image...</div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center mb-4 px-4">
                <h3 className="font-bold text-lg text-emerald-600">Supabase Records</h3>
                <button onClick={fetchBookings} className="p-2 bg-emerald-500/10 rounded-full hover:bg-emerald-500/30 text-emerald-600 transition-colors">
                  <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-12">
                   <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                      <th className="p-4">Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Venue</th>
                      <th className="p-4">Date/Time</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    {dbBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center opacity-50">No bookings found in database.</td>
                      </tr>
                    ) : (
                      dbBookings.map(booking => (
                        <tr key={booking.row_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/10">
                          <td className="p-4 font-mono text-xs">{booking.id}</td>
                          <td className="p-4">
                            <div className="font-bold">{booking.name}</div>
                            <div className="text-xs opacity-70">{booking.email}</div>
                            <div className="text-xs opacity-70">{booking.phone}</div>
                          </td>
                          <td className="p-4">{booking.venue}</td>
                          <td className="p-4">
                            <div>{booking.date}</div>
                            <div className="text-xs text-emerald-500">{booking.time}</div>
                          </td>
                          <td className="p-4 font-bold">₦{booking.totalPrice?.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {booking.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(booking.row_id, 'Approved')}
                                  title="Approve"
                                  className="p-2 bg-green-500/20 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(booking.row_id, 'Rejected')}
                                  title="Reject"
                                  className="p-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDeleteBooking(booking.row_id, booking.id)}
                              title="Delete Booking"
                              className="p-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/10">
                   <div className="mb-4 relative h-40 rounded-lg overflow-hidden group">
                     <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-600"
                         onClick={() => triggerUpload('feature', idx)}
                       >
                         <Upload size={16} /> Upload New
                       </button>
                     </div>
                   </div>
                   {/* Switched to defaultValue + onBlur to prevent excessive DB writes while typing */}
                   <input 
                     defaultValue={feature.title} 
                     onBlur={(e) => updateFeature(idx, { ...feature, title: e.target.value })}
                     key={`title-${idx}-${feature.title}`} // Forces re-render if updated externally
                     className="w-full bg-transparent font-bold text-lg mb-2 border-b border-transparent focus:border-emerald-500 outline-none text-gray-800 dark:text-white"
                   />
                   <textarea 
                     defaultValue={feature.description}
                     onBlur={(e) => updateFeature(idx, { ...feature, description: e.target.value })}
                     key={`desc-${idx}-${feature.description}`} // Forces re-render if updated externally
                     className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-300 resize-none h-20 border border-transparent focus:border-emerald-500 rounded p-1 outline-none"
                   />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
             <div>
               <div className="mb-6 flex gap-3">
                 <button 
                   onClick={() => triggerUpload('gallery')}
                   className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 flex items-center gap-2 shadow-lg"
                 >
                   <Upload size={20} /> Upload Photo
                 </button>
                 
                 <button 
                   onClick={() => {
                      const url = prompt("Enter Image URL:");
                      if (url) updateGallery([...galleryImages, url]);
                   }}
                   className="bg-white/10 text-gray-700 dark:text-white border border-gray-500/30 px-4 py-3 rounded-xl font-bold hover:bg-white/20 flex items-center gap-2"
                 >
                   <Plus size={20} /> Add URL
                 </button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {galleryImages.map((image, idx) => (
                   <div key={idx} className="relative group rounded-xl overflow-hidden h-40 shadow-md">
                     <img src={image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                          onClick={() => {
                            if (window.confirm("Remove this image?")) {
                              updateGallery(galleryImages.filter((_, i) => i !== idx));
                            }
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                       >
                         <Trash2 size={20} />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-12">
              {/* Branding Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                  <Citrus className="text-emerald-500" /> Branding
                </h3>
                <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl border border-white/10 flex items-center gap-6">
                  <div className="relative w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/30 group">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-xs text-gray-500">No Logo</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={() => triggerUpload('logo')}
                         className="text-white text-xs font-bold flex flex-col items-center"
                       >
                         <Upload size={20} className="mb-1"/> Change
                       </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">Website Logo & Favicon</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                      Upload a PNG or JPEG file. This image will be used in the Navigation Bar and as the browser tab icon (favicon).
                    </p>
                    <button 
                       onClick={() => triggerUpload('logo')}
                       className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 flex items-center gap-2"
                    >
                      <Upload size={16} /> Upload Logo
                    </button>
                  </div>
                </div>
              </section>

              {/* Hero Image Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                  <ImageIcon className="text-emerald-500" /> Hero Section Image
                </h3>
                <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl border border-white/10">
                  <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden group">
                    <img 
                      src={heroImage} 
                      alt="Hero Banner" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => triggerUpload('hero')}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg transform hover:scale-105 transition-all"
                      >
                        <Upload size={20} /> Upload New Banner
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    This image appears as the large banner on the Home page. Recommended size: 1920x1080.
                  </p>
                </div>
              </section>

              {/* Testimonials Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                  <Edit2 className="text-emerald-500" /> Client Reviews
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl border border-white/10 relative">
                      <div className="flex justify-center mb-4">
                        <div className="relative w-24 h-24 group">
                          <img 
                            src={testimonial.avatar} 
                            alt="Client" 
                            className="w-full h-full rounded-full object-cover border-4 border-emerald-500/20"
                          />
                          <button 
                            onClick={() => triggerUpload('testimonial', idx)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          >
                            <Upload size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                           <input 
                             type="text" 
                             defaultValue={testimonial.name}
                             onBlur={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                             key={`t-name-${idx}-${testimonial.name}`}
                             className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none py-1 font-bold text-gray-800 dark:text-white"
                           />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                           <input 
                             type="text" 
                             defaultValue={testimonial.role}
                             onBlur={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                             key={`t-role-${idx}-${testimonial.role}`}
                             className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none py-1 text-sm text-emerald-600"
                           />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Comment</label>
                           <textarea 
                             rows={3}
                             defaultValue={testimonial.comment}
                             onBlur={(e) => handleTestimonialChange(idx, 'comment', e.target.value)}
                             key={`t-comment-${idx}-${testimonial.comment}`}
                             className="w-full bg-transparent border border-gray-400/30 rounded p-2 focus:border-emerald-500 outline-none text-sm text-gray-600 dark:text-gray-300 mt-1 resize-none"
                           />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'events' && (
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Calendar className="text-emerald-500" /> Events & News
                 </h3>
                 <button 
                   onClick={handleAddEvent}
                   className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg"
                 >
                   <Plus size={20} /> Add New Event
                 </button>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {events.map((event, idx) => (
                   <div key={event.id} className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col h-full">
                     <div className="relative h-48 rounded-lg overflow-hidden group mb-4 shrink-0">
                       <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-600"
                           onClick={() => triggerUpload('event', idx)}
                         >
                           <Upload size={16} /> Change Image
                         </button>
                       </div>
                     </div>
                     
                     <div className="space-y-3 flex-grow">
                        <div className="flex gap-2">
                           <div className="flex-grow">
                             <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                             <input 
                               defaultValue={event.title}
                               onBlur={(e) => handleEventChange(idx, 'title', e.target.value)}
                               key={`e-title-${idx}-${event.title}`}
                               className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none py-1 font-bold text-gray-800 dark:text-white"
                             />
                           </div>
                           <div className="w-1/3">
                             <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                             <input 
                               type="date"
                               defaultValue={event.date}
                               onBlur={(e) => handleEventChange(idx, 'date', e.target.value)}
                               key={`e-date-${idx}-${event.date}`}
                               className="w-full bg-transparent border-b border-gray-400 focus:border-emerald-500 outline-none py-1 text-sm text-gray-600 dark:text-gray-300"
                             />
                           </div>
                        </div>
                        <div className="flex-grow">
                           <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                           <textarea 
                             rows={4}
                             defaultValue={event.description}
                             onBlur={(e) => handleEventChange(idx, 'description', e.target.value)}
                             key={`e-desc-${idx}-${event.description}`}
                             className="w-full bg-transparent border border-gray-400/30 rounded p-2 focus:border-emerald-500 outline-none text-sm text-gray-600 dark:text-gray-300 mt-1 resize-none h-24"
                           />
                        </div>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                       <button 
                         onClick={() => handleDeleteEvent(event.id)}
                         className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
                       >
                         <Trash2 size={16} /> Delete Event
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminPanel;