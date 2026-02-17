
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, GlassButton } from './GlassUI';
import { useData } from '../context/DataContext';
import { Lock, LogOut, Check, X, Edit2, Trash2, Image as ImageIcon, RefreshCw, Loader2, Upload, Plus, Citrus, Calendar, Cloud, CloudOff, Save, AlertTriangle, Tag, Target } from 'lucide-react';
import { BookingRecord, EventItem, PricingItem } from '../types';
import { supabase } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'features' | 'gallery' | 'content' | 'events' | 'pricing'>('bookings');
  
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

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
    pricing, updatePricing,
    syncStatus,
    syncError 
  } = useData();

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
        id: b.booking_code || b.id, 
        row_id: b.id, 
        venue: b.venue,
        date: b.start_time ? new Date(b.start_time).toLocaleDateString() : 'N/A',
        time: b.start_time ? new Date(b.start_time).toLocaleTimeString() : 'N/A',
        totalPrice: b.price ? parseFloat(b.price) : 0
      })) : [];
      
      setDbBookings(mappedData);
    } catch (error: any) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (rowId: any, status: 'Approved' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('id', rowId);

      if (error) throw error;
      fetchBookings();
    } catch (e: any) {
      alert("Failed to update status: " + (e.message || JSON.stringify(e)));
    }
  };

  const handleDeleteBooking = async (rowId: any, displayId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete booking ${displayId}?`)) return;
    try {
      const { error, count } = await supabase.from('bookings').delete({ count: 'exact' }).eq('id', rowId);
      if (error) throw error;
      if (count === 0) {
        alert("Failed to delete. Check RLS policies.");
        return;
      }
      setDbBookings(prev => prev.filter(b => b.row_id !== rowId));
    } catch (e: any) {
      alert(`Failed to delete: ${e.message}`);
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

  const triggerUpload = (type: 'feature' | 'gallery' | 'hero' | 'testimonial' | 'logo' | 'event', index?: number) => {
    setUploadTarget({ type, index });
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      if (uploadTarget?.type === 'feature' && typeof uploadTarget.index === 'number') {
         updateFeature(uploadTarget.index, { ...features[uploadTarget.index], image: publicUrl });
      } else if (uploadTarget?.type === 'gallery') {
         updateGallery([...galleryImages, publicUrl]);
      } else if (uploadTarget?.type === 'hero') {
         updateHeroImage(publicUrl);
      } else if (uploadTarget?.type === 'logo') {
         updateLogo(publicUrl);
      } else if (uploadTarget?.type === 'testimonial' && typeof uploadTarget.index === 'number') {
         const nt = [...testimonials]; nt[uploadTarget.index] = { ...nt[uploadTarget.index], avatar: publicUrl };
         updateTestimonials(nt);
      } else if (uploadTarget?.type === 'event' && typeof uploadTarget.index === 'number') {
         const ne = [...events]; ne[uploadTarget.index] = { ...ne[uploadTarget.index], image: publicUrl };
         updateEvents(ne);
      }
      alert("Image uploaded successfully!");
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // --- Pricing Management ---
  const handleAddPricing = () => {
    const newItem: PricingItem = {
      id: Date.now(),
      title: 'New Service',
      price: 0,
      unit: 'per day',
      description: 'Enter description...',
      category: 'Activity',
      icon: 'tag'
    };
    updatePricing([...pricing, newItem]);
  };

  const handleDeletePricing = (id: number) => {
    if (window.confirm("Remove this pricing item?")) {
      updatePricing(pricing.filter(p => p.id !== id));
    }
  };

  const handlePricingChange = (index: number, field: keyof PricingItem, value: any) => {
    const newPricing = [...pricing];
    (newPricing[index] as any)[field] = field === 'price' ? parseFloat(value) || 0 : value;
    updatePricing(newPricing);
  };

  // --- Event Management ---
  // Fix: Added missing handleEventChange function
  const handleEventChange = (index: number, field: keyof EventItem, value: any) => {
    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
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
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <GlassButton type="submit" className="w-full justify-center">Login</GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>
    );
  }

  const getSyncStatusBadge = () => {
    if (syncStatus === 'saving') return <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-bold"><Loader2 className="animate-spin" size={14}/> Saving...</div>;
    if (syncStatus === 'error') return <button onClick={() => alert(syncError)} className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-bold"><CloudOff size={14}/> Sync Error</button>;
    return <div className="flex items-center gap-2 text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-sm font-bold"><Cloud size={14}/> All Changes Saved</div>;
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div><h1 className="text-3xl font-bold">Admin Dashboard</h1>{getSyncStatusBadge()}</div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-500 font-medium"><LogOut size={18} /> Logout</button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['bookings', 'pricing', 'features', 'gallery', 'content', 'events'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/40'}`}>{tab}</button>
          ))}
        </div>

        <GlassCard className="min-h-[500px]">
          {isUploading && <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"><Loader2 className="animate-spin text-white w-12 h-12 mb-4" /><div className="text-white font-bold">Uploading...</div></div>}

          {activeTab === 'bookings' && (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-gray-700 text-gray-500"><th className="p-4">Code</th><th className="p-4">Customer</th><th className="p-4">Venue</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                  <tbody>{dbBookings.map(b => (
                    <tr key={b.row_id} className="border-b border-gray-800"><td className="p-4 font-mono text-xs">{b.id}</td><td className="p-4">{b.name}</td><td className="p-4">{b.venue}</td><td className="p-4">{b.status}</td><td className="p-4 flex gap-2"><button onClick={() => handleUpdateStatus(b.row_id, 'Approved')} className="p-2 bg-green-500/20 text-green-600 rounded-lg"><Check size={18} /></button><button onClick={() => handleUpdateStatus(b.row_id, 'Rejected')} className="p-2 bg-red-500/20 text-red-600 rounded-lg"><X size={18} /></button><button onClick={() => handleDeleteBooking(b.row_id, b.id)} className="p-2 bg-gray-500/10 text-gray-500 rounded-lg"><Trash2 size={18} /></button></td></tr>
                  ))}</tbody>
                </table>
             </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center"><h3 className="text-xl font-bold flex items-center gap-2"><Tag className="text-emerald-500"/> Pricing Management</h3><button onClick={handleAddPricing} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add Item</button></div>
              <div className="grid md:grid-cols-2 gap-6">
                 {pricing.map((item, idx) => (
                   <div key={item.id} className="bg-white/30 dark:bg-black/20 p-6 rounded-xl border border-white/10">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input defaultValue={item.title} onBlur={(e) => handlePricingChange(idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-gray-500 outline-none font-bold py-1"/></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                           <select defaultValue={item.category} onChange={(e) => handlePricingChange(idx, 'category', e.target.value)} className="w-full bg-transparent border-b border-gray-500 outline-none py-1">
                             <option value="Venue">Venue</option><option value="Activity">Activity</option><option value="Entry">Entry</option>
                           </select>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Price (₦)</label><input type="number" defaultValue={item.price} onBlur={(e) => handlePricingChange(idx, 'price', e.target.value)} className="w-full bg-transparent border-b border-gray-500 outline-none font-bold py-1"/></div>
                         <div><label className="text-xs font-bold text-gray-500 uppercase">Unit</label><input defaultValue={item.unit} onBlur={(e) => handlePricingChange(idx, 'unit', e.target.value)} className="w-full bg-transparent border-b border-gray-500 outline-none py-1"/></div>
                      </div>
                      <div className="mb-4"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea defaultValue={item.description} onBlur={(e) => handlePricingChange(idx, 'description', e.target.value)} className="w-full bg-transparent border border-gray-500/30 rounded p-2 text-sm mt-1 h-20 resize-none outline-none"/></div>
                      <div className="flex justify-between items-center"><div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs"><input type="radio" name={`icon-${item.id}`} checked={item.icon === 'home'} onChange={() => handlePricingChange(idx, 'icon', 'home')}/> Venue</label>
                        <label className="flex items-center gap-2 text-xs"><input type="radio" name={`icon-${item.id}`} checked={item.icon === 'activity'} onChange={() => handlePricingChange(idx, 'icon', 'activity')}/> Game</label>
                        <label className="flex items-center gap-2 text-xs"><input type="radio" name={`icon-${item.id}`} checked={item.icon === 'smile'} onChange={() => handlePricingChange(idx, 'icon', 'smile')}/> Fun</label>
                      </div><button onClick={() => handleDeletePricing(item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button></div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid md:grid-cols-2 gap-6">{features.map((f, i) => (
              <div key={i} className="bg-white/30 p-4 rounded-xl border border-white/10">
                 <div className="h-40 rounded-lg overflow-hidden mb-4 relative group"><img src={f.image} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><button onClick={() => triggerUpload('feature', i)} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">Change Image</button></div></div>
                 <input defaultValue={f.title} onBlur={(e) => updateFeature(i, { ...f, title: e.target.value })} className="w-full bg-transparent font-bold mb-2 border-b border-transparent focus:border-emerald-500 outline-none" />
                 <textarea defaultValue={f.description} onBlur={(e) => updateFeature(i, { ...f, description: e.target.value })} className="w-full bg-transparent text-sm h-20 border border-transparent focus:border-emerald-500 rounded outline-none" />
              </div>
            ))}</div>
          )}

          {activeTab === 'gallery' && (
             <div><button onClick={() => triggerUpload('gallery')} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mb-6"><Plus size={20}/> Upload Photo</button><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{galleryImages.map((img, i) => (<div key={i} className="relative h-40 rounded-xl overflow-hidden group border border-white/10"><img src={img} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-red-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><button onClick={() => updateGallery(galleryImages.filter((_, idx) => idx !== i))} className="bg-white p-2 rounded-full text-red-500"><Trash2 size={20}/></button></div></div>))}</div></div>
          )}

          {activeTab === 'content' && (
             <div className="space-y-8">
               <section><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ImageIcon className="text-emerald-500"/> Hero Banner</h3><div className="h-48 rounded-xl overflow-hidden relative group border border-white/10"><img src={heroImage} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><button onClick={() => triggerUpload('hero')} className="bg-emerald-50 text-emerald-900 px-6 py-2 rounded-xl font-bold">Change Banner</button></div></div></section>
               <section><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Citrus className="text-emerald-500"/> Logo</h3><div className="w-32 h-32 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center relative group overflow-hidden"><img src={logo} className="object-contain p-2"/><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><button onClick={() => triggerUpload('logo')} className="text-white text-xs font-bold">Change</button></div></div></section>
             </div>
          )}

          {activeTab === 'events' && (
             <div className="space-y-6"><button onClick={() => updateEvents([{ id: Date.now(), title: 'New Event', date: '', description: '', image: '' }, ...events])} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold">Add Event</button><div className="grid md:grid-cols-2 gap-6">{events.map((e, i) => (
               <div key={e.id} className="bg-white/30 p-4 rounded-xl border border-white/10 flex flex-col"><div className="h-32 mb-4 bg-black/10 rounded relative group"><img src={e.image} className="w-full h-full object-cover rounded"/><button onClick={() => triggerUpload('event', i)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">Change</button></div><input defaultValue={e.title} onBlur={(val) => handleEventChange(i, 'title', val.target.value)} className="bg-transparent font-bold mb-2 outline-none border-b border-transparent focus:border-emerald-500"/><input type="date" defaultValue={e.date} onBlur={(val) => handleEventChange(i, 'date', val.target.value)} className="bg-transparent text-sm mb-2 outline-none border-b border-transparent focus:border-emerald-500"/><textarea defaultValue={e.description} onBlur={(val) => handleEventChange(i, 'description', val.target.value)} className="bg-transparent text-xs h-16 outline-none border border-transparent focus:border-emerald-500"/><button onClick={() => updateEvents(events.filter(ev => ev.id !== e.id))} className="text-red-500 text-sm mt-4 flex items-center gap-1"><Trash2 size={14}/> Delete</button></div>
             ))}</div></div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminPanel;
