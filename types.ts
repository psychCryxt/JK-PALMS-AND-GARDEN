export type VenueType = 'Courtyard' | 'Football Pitch' | 'Palm Garden' | 'Kids Playground' | 'Sendforth Event';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface PricingItem {
  id: number;
  title: string;
  price: number;
  unit: string;
  description: string;
  category: 'Venue' | 'Activity' | 'Entry';
  icon: string;
}

export interface BookingState {
  name: string;
  email: string;
  phone: string;
  venue: VenueType;
  date: string;
  endDate?: string;
  time?: string;
  duration?: number; // Only for football (hours)
  guests?: {
    adults: number;
    children: number;
  };
  message: string;
}

export interface BookingRecord extends BookingState {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
  totalPrice: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Keep aliases for backward compatibility if needed, but we'll try to migrate
export type DrinkItem = MenuItem;
export type DrinkCategory = MenuCategory;
