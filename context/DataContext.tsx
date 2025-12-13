import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRecord, FeatureItem, ServiceItem } from '../types';
import { INITIAL_FEATURES, INITIAL_SERVICES, INITIAL_GALLERY_IMAGES } from '../constants';

interface DataContextType {
  features: FeatureItem[];
  services: ServiceItem[];
  galleryImages: string[];
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, status: 'Pending' | 'Approved' | 'Rejected') => void;
  updateFeature: (index: number, feature: FeatureItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  updateGallery: (images: string[]) => void;
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

  // Persist to LocalStorage whenever state changes
  useEffect(() => localStorage.setItem('jk_features', JSON.stringify(features)), [features]);
  useEffect(() => localStorage.setItem('jk_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('jk_gallery_images', JSON.stringify(galleryImages)), [galleryImages]);
  useEffect(() => localStorage.setItem('jk_bookings', JSON.stringify(bookings)), [bookings]);

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

  return (
    <DataContext.Provider value={{
      features,
      services,
      galleryImages,
      bookings,
      addBooking,
      updateBookingStatus,
      updateFeature,
      updateService,
      updateGallery
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