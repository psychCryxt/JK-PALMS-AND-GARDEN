import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { BookingRecord, FeatureItem, ServiceItem, Testimonial, EventItem, PricingItem, DrinkCategory } from '../types';
import { INITIAL_FEATURES, INITIAL_SERVICES, INITIAL_GALLERY_IMAGES, TESTIMONIALS, INITIAL_EVENTS, INITIAL_PRICING, DRINKS_MENU } from '../constants';
import { supabase } from '../lib/supabase';

interface DataContextType {
  features: FeatureItem[];
  services: ServiceItem[];
  galleryImages: string[];
  bookings: BookingRecord[];
  heroImage: string;
  testimonials: Testimonial[];
  logo: string;
  events: EventItem[];
  pricing: PricingItem[];
  drinksMenu: DrinkCategory[];
  syncStatus: 'synced' | 'saving' | 'error';
  syncError: string | null;
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, status: 'Pending' | 'Approved' | 'Rejected') => void;
  updateFeature: (index: number, feature: FeatureItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  updateGallery: (images: string[]) => void;
  updateHeroImage: (url: string) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateLogo: (url: string) => void;
  updateEvents: (events: EventItem[]) => void;
  updatePricing: (pricing: PricingItem[]) => void;
  updateDrinksMenu: (drinks: DrinkCategory[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or use Constants (Optimistic Initial State)
  const [features, setFeatures] = useState<FeatureItem[]>(() => {
    const saved = localStorage.getItem('jk_features');
    return saved ? JSON.parse(saved) : INITIAL_FEATURES;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('jk_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('jk_gallery_images');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_IMAGES;
  });

  // Bookings in Context are for local user history mainly. Admin fetches from DB directly.
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('jk_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('jk_hero_image') || "https://jkpalmandgarden.com/img/captured3.jpg";
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('jk_testimonials');
    return saved ? JSON.parse(saved) : TESTIMONIALS;
  });

  const [logo, setLogo] = useState<string>(() => {
    return localStorage.getItem('jk_logo') || "";
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('jk_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [pricing, setPricing] = useState<PricingItem[]>(() => {
    const saved = localStorage.getItem('jk_pricing');
    return saved ? JSON.parse(saved) : INITIAL_PRICING;
  });

  const [drinksMenu, setDrinksMenu] = useState<DrinkCategory[]>(() => {
    const saved = localStorage.getItem('jk_drinks_menu');
    return saved ? JSON.parse(saved) : DRINKS_MENU;
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [syncError, setSyncError] = useState<string | null>(null);

  // Ref to store debounce timers
  const saveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Persist to LocalStorage (Immediate) AND Supabase (Debounced or Immediate)
  const persist = async (key: string, value: any, immediate = false) => {
    // 1. Save to LocalStorage immediately
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    setSyncStatus('saving');
    setSyncError(null);

    const saveToDb = async () => {
      try {
        // Use 'content' column instead of 'value'
        const { error } = await supabase.from('site_content').upsert({ key, content: value });
        if (error) throw error;
        setSyncStatus('synced');
      } catch (err: any) {
        console.error(`Failed to sync ${key} to cloud:`, err);
        setSyncStatus('error');
        setSyncError(err.message || "Unknown database error");
      }
    };

    // Clear existing timeout for this key
    if (saveTimeouts.current[key]) {
      clearTimeout(saveTimeouts.current[key]);
      delete saveTimeouts.current[key];
    }

    if (immediate) {
      await saveToDb();
    } else {
      saveTimeouts.current[key] = setTimeout(async () => {
        await saveToDb();
        delete saveTimeouts.current[key];
      }, 1000); // 1 second debounce
    }
  };

  // Helper to update state from DB data
  const updateStateFromKey = useCallback((key: string, val: any) => {
    if (!val) return;
    switch(key) {
      case 'jk_features': 
        setFeatures(val); 
        localStorage.setItem('jk_features', JSON.stringify(val));
        break;
      case 'jk_services': 
        setServices(val); 
        localStorage.setItem('jk_services', JSON.stringify(val));
        break;
      case 'jk_gallery_images': 
        setGalleryImages(val); 
        localStorage.setItem('jk_gallery_images', JSON.stringify(val));
        break;
      case 'jk_hero_image': 
        setHeroImage(val); 
        localStorage.setItem('jk_hero_image', val);
        break;
      case 'jk_testimonials': 
        setTestimonials(val); 
        localStorage.setItem('jk_testimonials', JSON.stringify(val));
        break;
      case 'jk_logo': 
        setLogo(val); 
        localStorage.setItem('jk_logo', val);
        break;
      case 'jk_events': 
        setEvents(val); 
        localStorage.setItem('jk_events', JSON.stringify(val));
        break;
      case 'jk_pricing': 
        setPricing(val); 
        localStorage.setItem('jk_pricing', JSON.stringify(val));
        break;
      case 'jk_drinks_menu': 
        setDrinksMenu(val); 
        localStorage.setItem('jk_drinks_menu', JSON.stringify(val));
        break;
    }
  }, []);

  const fetchGlobalContent = useCallback(async () => {
    try {
      // Use 'content' column instead of 'value'
      const { data, error } = await supabase.from('site_content').select('key, content');
      if (error) {
        if (error.code !== 'PGRST116') {
             console.warn("Sync warning:", error.message);
             setSyncStatus('error');
             setSyncError(error.message);
        }
        return;
      }
      
      if (data) {
        data.forEach(item => {
          updateStateFromKey(item.key, item.content);
        });
        setSyncStatus('synced');
        setSyncError(null);
      }
    } catch (err: any) {
      console.error("Error loading site content:", err);
      setSyncStatus('error');
      setSyncError(err.message || "Network error");
    }
  }, [updateStateFromKey]);

  // --- Real-time Sync & Polling ---
  useEffect(() => {
    // 1. Initial Fetch
    fetchGlobalContent();

    // 2. Realtime Subscription
    const channel = supabase.channel('content_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, async (payload) => {
         const record = payload.new as any;
         if (!record || !record.key) return;

         // Fetch fresh data to ensure we have the complete JSON object
         // Use 'content' column
         const { data } = await supabase.from('site_content').select('content').eq('key', record.key).single();
         if (data) {
            updateStateFromKey(record.key, data.content);
         }
      })
      .subscribe();

    // 3. Polling Fallback (Every 10 seconds)
    const intervalId = setInterval(() => {
        fetchGlobalContent();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [fetchGlobalContent, updateStateFromKey]);

  // Update Favicon dynamically when logo changes
  useEffect(() => {
    if (logo) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = logo;
    }
  }, [logo]);

  // --- Actions ---

  const addBooking = (booking: BookingRecord) => {
    setBookings(prev => {
      const updated = [booking, ...prev];
      localStorage.setItem('jk_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  const updateBookingStatus = (id: string, status: 'Pending' | 'Approved' | 'Rejected') => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status } : b);
      localStorage.setItem('jk_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  const updateFeature = (index: number, feature: FeatureItem) => {
    const newFeatures = [...features];
    newFeatures[index] = feature;
    setFeatures(newFeatures);
    // Use immediate=true if it contains an image URL (heuristic), otherwise debounce
    persist('jk_features', newFeatures, feature.image.startsWith('http'));
  };

  const updateService = (index: number, service: ServiceItem) => {
    const newServices = [...services];
    newServices[index] = service;
    setServices(newServices);
    persist('jk_services', newServices);
  };

  const updateGallery = (images: string[]) => {
    setGalleryImages(images);
    persist('jk_gallery_images', images, true); // Images: Immediate Save
  };

  const updateHeroImage = (url: string) => {
    setHeroImage(url);
    persist('jk_hero_image', url, true); // Images: Immediate Save
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    persist('jk_testimonials', newTestimonials);
  };

  const updateLogo = (url: string) => {
    setLogo(url);
    persist('jk_logo', url, true); // Images: Immediate Save
  };

  const updateEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    persist('jk_events', newEvents, true); // Events often involve images: Immediate Save
  };

  const updatePricing = (newPricing: PricingItem[]) => {
    setPricing(newPricing);
    persist('jk_pricing', newPricing, false); // Debounced save for text edits
  };

  const updateDrinksMenu = (newDrinks: DrinkCategory[]) => {
    setDrinksMenu(newDrinks);
    persist('jk_drinks_menu', newDrinks, false); // Debounced save for text edits
  };

  return (
    <DataContext.Provider value={{
      features,
      services,
      galleryImages,
      bookings,
      heroImage,
      testimonials,
      logo,
      events,
      pricing,
      drinksMenu,
      syncStatus,
      syncError,
      addBooking,
      updateBookingStatus,
      updateFeature,
      updateService,
      updateGallery,
      updateHeroImage,
      updateTestimonials,
      updateLogo,
      updateEvents,
      updatePricing,
      updateDrinksMenu
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};