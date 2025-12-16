import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRecord, FeatureItem, ServiceItem, Testimonial, EventItem } from '../types';
import { INITIAL_FEATURES, INITIAL_SERVICES, INITIAL_GALLERY_IMAGES, TESTIMONIALS, INITIAL_EVENTS } from '../constants';
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
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, status: 'Pending' | 'Approved' | 'Rejected') => void;
  updateFeature: (index: number, feature: FeatureItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  updateGallery: (images: string[]) => void;
  updateHeroImage: (url: string) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateLogo: (url: string) => void;
  updateEvents: (events: EventItem[]) => void;
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

  // --- Real-time Sync with Supabase ---
  useEffect(() => {
    const fetchGlobalContent = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('key, value');
        
        if (data) {
          data.forEach(item => {
            const val = item.value;
            // Update state and local storage backup
            switch(item.key) {
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
            }
          });
        }
      } catch (err) {
        console.error("Error loading site content:", err);
      }
    };

    fetchGlobalContent();

    // Subscribe to Realtime changes from other admins
    const channel = supabase.channel('content_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
         const { key, value } = payload.new as any;
         if (!key) return;

         if (key === 'jk_features') setFeatures(value);
         else if (key === 'jk_services') setServices(value);
         else if (key === 'jk_gallery_images') setGalleryImages(value);
         else if (key === 'jk_hero_image') setHeroImage(value);
         else if (key === 'jk_testimonials') setTestimonials(value);
         else if (key === 'jk_logo') setLogo(value);
         else if (key === 'jk_events') setEvents(value);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Persist to LocalStorage (Backup) AND Supabase (Cloud)
  const persist = async (key: string, value: any) => {
    // 1. Save to LocalStorage (Fast, offline support)
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));

    // 2. Save to Supabase (Global Sync)
    try {
      await supabase.from('site_content').upsert({ key, value });
    } catch (err) {
      console.error(`Failed to sync ${key} to cloud`, err);
    }
  };

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
    persist('jk_features', newFeatures);
  };

  const updateService = (index: number, service: ServiceItem) => {
    const newServices = [...services];
    newServices[index] = service;
    setServices(newServices);
    persist('jk_services', newServices);
  };

  const updateGallery = (images: string[]) => {
    setGalleryImages(images);
    persist('jk_gallery_images', images);
  };

  const updateHeroImage = (url: string) => {
    setHeroImage(url);
    persist('jk_hero_image', url);
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    persist('jk_testimonials', newTestimonials);
  };

  const updateLogo = (url: string) => {
    setLogo(url);
    persist('jk_logo', url);
  };

  const updateEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    persist('jk_events', newEvents);
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
      addBooking,
      updateBookingStatus,
      updateFeature,
      updateService,
      updateGallery,
      updateHeroImage,
      updateTestimonials,
      updateLogo,
      updateEvents
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