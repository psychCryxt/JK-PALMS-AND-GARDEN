export type VenueType = 'Courtyard' | 'Football Pitch' | 'Palm Garden' | 'Kids Playground';

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

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
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

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}