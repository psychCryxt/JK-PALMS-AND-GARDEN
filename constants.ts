import { ServiceItem, Testimonial } from './types';

export const HERO_TITLE = "Adventure Blooms, Laughter Echoes";
export const HERO_SUBTITLE = "Escape the hustle. Embrace nature. Create memories in our lush oasis.";

export const FEATURES = [
  {
    title: "Indoor Gaming",
    description: "Equipped with high-quality snooker tables and accessories for a premium experience.",
    image: "https://picsum.photos/id/20/800/600"
  },
  {
    title: "Restaurants",
    description: "Diverse menu highlighting seasonal ingredients and local flavors for a memorable evening.",
    image: "https://picsum.photos/id/42/800/600"
  },
  {
    title: "Sports",
    description: "High-quality terrain football pitch perfect for full-sized matches or casual games.",
    image: "https://picsum.photos/id/158/800/600"
  },
  {
    title: "Palm Garden",
    description: "A serene botanical escape filled with exotic palms and vibrant flora for relaxation.",
    image: "https://picsum.photos/id/28/800/600"
  },
  {
    title: "The Courtyard",
    description: "An elegant open-air space designed for hosting grand events and gatherings.",
    image: "https://picsum.photos/id/57/800/600"
  },
  {
    title: "Kids Playground",
    description: "A safe, fun-filled zone with modern equipment for children to explore and play.",
    image: "https://picsum.photos/id/88/800/600"
  }
];

export const SERVICES: ServiceItem[] = [
  { id: 1, title: "Pavilion", description: "Perfect spot to gather, celebrate, or simply enjoy the beauty.", icon: "home" },
  { id: 2, title: "Delicious Food", description: "Mouthwatering dishes crafted to delight your taste buds.", icon: "coffee" },
  { id: 3, title: "Safety Lockers", description: "24/7 security with CCTV watch towers and secure lockers.", icon: "lock" },
  { id: 4, title: "Play Ground", description: "Safe and fun space for kids to run, climb, and explore.", icon: "smile" },
  { id: 5, title: "Event Hosting", description: "Full-service hosting for weddings, birthdays, and corporate retreats.", icon: "party" },
  { id: 6, title: "Garden Parties", description: "Exclusive access to our gardens for intimate outdoor celebrations.", icon: "tree" }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Sarah Connor", role: "Mother", comment: "The kids playground is safe and amazing. We loved the palm garden!", avatar: "https://picsum.photos/id/338/100/100" },
  { id: 2, name: "John Doe", role: "Football Coach", comment: "Best pitch in Akwanga. The booking system is seamless.", avatar: "https://picsum.photos/id/103/100/100" },
  { id: 3, name: "Emily Blunt", role: "Event Planner", comment: "The courtyard is elegant and perfect for weddings.", avatar: "https://picsum.photos/id/65/100/100" }
];

export const CONTACT_INFO = {
  address: "Opposite Sports Academy Wamba, Road, Akwanga 960101",
  email: "jkplams20@gmail.com",
  phone: "+234 811 886 1619"
};