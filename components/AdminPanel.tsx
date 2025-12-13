import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, GlassButton } from './GlassUI';
import { useData } from '../context/DataContext';
import { Lock, LogOut, Check, X, Edit2, Trash2, Image as ImageIcon, RefreshCw, Loader2 } from 'lucide-react';
import { BookingRecord } from '../types';
import { supabase } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'features' | 'gallery'>('bookings');
  
  const [dbBookings, setDbBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  const { features, updateFeature, galleryImages, updateGallery } = useData();

  // Scroll to login on mount or when auth state changes
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
        id: b.booking_code,
        venue: b.venue,
        date: new Date(b.start_time).toLocaleDateString(),
        time: new Date(b.start_time).toLocaleTimeString(),
        totalPrice: parseFloat(b.price)
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

  const handleUpdateStatus = async (bookingCode: string, status: 'Approved' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('booking_code', bookingCode);

      if (error) throw error;

      fetchBookings(); // Refresh list
    } catch (e: any) {
      alert("Failed to update: " + e.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      alert('Invalid Credentials (try admin/admin123)');
    }
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

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['bookings', 'features', 'gallery'].map(tab => (
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
                        <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/10">
                          <td className="p-4 font-mono text-xs">{booking.id}</td>
                          <td className="p-4">
                            <div className="font-bold">{booking.name}</div>
                            <div className="text-xs opacity-70">{booking.email}</div>
                            <div className="text-xs opacity-70">{booking.phone}</div>
                          </td>
                          <td className="p-4">{booking.venue}</td>
                          <td className="p-4">
                            <div>{new Date(booking.date).toDateString()}</div>
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
                                  onClick={() => handleUpdateStatus(booking.id, 'Approved')}
                                  title="Approve"
                                  className="p-2 bg-green-500/20 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(booking.id, 'Rejected')}
                                  title="Reject"
                                  className="p-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
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
                         className="bg-white text-black px-3 py-1 rounded text-sm font-bold flex items-center gap-1"
                         onClick={() => {
                           const url = prompt("Enter new image URL:", feature.image);
                           if (url) updateFeature(idx, { ...feature, image: url });
                         }}
                       >
                         <ImageIcon size={14} /> Change Image
                       </button>
                     </div>
                   </div>
                   <input 
                     value={feature.title} 
                     onChange={(e) => updateFeature(idx, { ...feature, title: e.target.value })}
                     className="w-full bg-transparent font-bold text-lg mb-2 border-b border-transparent focus:border-emerald-500 outline-none text-gray-800 dark:text-white"
                   />
                   <textarea 
                     value={feature.description}
                     onChange={(e) => updateFeature(idx, { ...feature, description: e.target.value })}
                     className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-300 resize-none h-20 border border-transparent focus:border-emerald-500 rounded p-1 outline-none"
                   />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
             <div>
               <div className="mb-4">
                 <button 
                   onClick={() => {
                      const url = prompt("Enter Image URL:");
                      if (url) updateGallery([...galleryImages, url]);
                   }}
                   className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600"
                 >
                   + Add New Image URL
                 </button>
               </div>
               <div className="grid grid-cols-4 gap-4">
                 {galleryImages.map((image, idx) => (
                   <div key={idx} className="relative group rounded-lg overflow-hidden h-32">
                     <img src={image} className="w-full h-full object-cover" alt="" />
                     <button 
                        onClick={() => updateGallery(galleryImages.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash2 size={16} />
                     </button>
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