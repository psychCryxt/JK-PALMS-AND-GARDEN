import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRecord, FeatureItem, ServiceItem, Testimonial, EventItem } from '../types';
import { INITIAL_FEATURES, INITIAL_SERVICES, INITIAL_GALLERY_IMAGES, TESTIMONIALS, INITIAL_EVENTS } from '../constants';

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
  // Load initial state from LocalStorage or use Constants
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

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('jk_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('jk_hero_image') || "./img/captured3.jpg";
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

  // Persist to LocalStorage whenever state changes
  useEffect(() => localStorage.setItem('jk_features', JSON.stringify(features)), [features]);
  useEffect(() => localStorage.setItem('jk_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('jk_gallery_images', JSON.stringify(galleryImages)), [galleryImages]);
  useEffect(() => localStorage.setItem('jk_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('jk_hero_image', heroImage), [heroImage]);
  useEffect(() => localStorage.setItem('jk_testimonials', JSON.stringify(testimonials)), [testimonials]);
  useEffect(() => localStorage.setItem('jk_logo', logo), [logo]);
  useEffect(() => localStorage.setItem('jk_events', JSON.stringify(events)), [events]);

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

  const addBooking = (booking: BookingRecord) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: 'Pending' | 'Approved' | 'Rejected') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const updateFeature = (index: number, feature: FeatureItem) => {
    const newFeatures = [...features];
    newFeatures[index] = feature;
    setFeatures(newFeatures);
  };

  const updateService = (index: number, service: ServiceItem) => {
    const newServices = [...services];
    newServices[index] = service;
    setServices(newServices);
  };

  const updateGallery = (images: string[]) => {
    setGalleryImages(images);
  };

  const updateHeroImage = (url: string) => {
    setHeroImage(url);
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
  };

  const updateLogo = (url: string) => {
    setLogo(url);
  };

  const updateEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
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