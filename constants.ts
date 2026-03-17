import { ServiceItem, Testimonial, FeatureItem, EventItem, PricingItem, DrinkCategory } from './types';

export const HERO_TITLE = "Adventure Blooms, Laughter Echoes";
export const HERO_SUBTITLE = "Escape the hustle. Embrace nature. Create memories in our lush oasis.";

export const INITIAL_FEATURES: FeatureItem[] = [
  {
    title: "Indoor Gaming",
    description: "Equipped with high-quality snooker tables and accessories for a premium experience.",
    image: "https://jkpalmandgarden.com/img/WhatsApp%20Image%202024-10-03%20at%2010.54.47_b5fb30b4.jpg"
  },
  {
    title: "Restaurants",
    description: "Diverse menu highlighting seasonal ingredients and local flavors for a memorable evening.",
    image: "https://jkpalmandgarden.com/img/WhatsApp%20Image%202024-10-03%20at%2010.54.48_dcdc29b3.jpg"
  },
  {
    title: "Sports",
    description: "High-quality terrain football pitch perfect for full-sized matches or casual games.",
    image: "https://jkpalmandgarden.com/img/WhatsApp%20Image%202024-10-03%20at%2011.32.29_c5f4445a.jpg"
  },
  {
    title: "Palm Garden",
    description: "A serene botanical escape filled with exotic palms and vibrant flora for relaxation.",
    image: "https://jkpalmandgarden.com/img/exp1.jpg"
  },
  {
    title: "The Courtyard",
    description: "An elegant open-air space designed for hosting grand events and gatherings.",
    image: "https://jkpalmandgarden.com/img/exp3.jpg"
  },
  {
    title: "Kids Playground",
    description: "A safe, fun-filled zone with modern equipment for children to explore and play.",
    image: "https://jkpalmandgarden.com/img/j10.jpg"
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  { id: 1, title: "Pavilion", description: "Perfect spot to gather, celebrate, or simply enjoy the beauty.", icon: "home" },
  { id: 2, title: "Delicious Food", description: "Mouthwatering dishes crafted to delight your taste buds.", icon: "coffee" },
  { id: 3, title: "Safety Lockers", description: "24/7 security with CCTV watch towers and secure lockers.", icon: "lock" },
  { id: 4, title: "Play Ground", description: "Safe and fun space for kids to run, climb, and explore.", icon: "smile" },
  { id: 5, title: "Event Hosting", description: "Full-service hosting for weddings, birthdays, and corporate retreats.", icon: "party" },
  { id: 6, title: "Garden Parties", description: "Exclusive access to our gardens for intimate outdoor celebrations.", icon: "tree" }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Summer Football Tournament",
    date: "2024-06-15",
    description: "Join us for the biggest local 5-a-side tournament. Great prizes to be won!",
    image: "https://jkpalmandgarden.com/img/WhatsApp%20Image%202024-10-03%20at%2011.32.29_c5f4445a.jpg"
  },
  {
    id: 2,
    title: "Live Jazz Night",
    date: "2024-05-20",
    description: "Experience smooth jazz under the stars in our Courtyard. Cocktails and dinner available.",
    image: "https://jkpalmandgarden.com/img/exp3.jpg"
  },
  {
    id: 3,
    title: "Family Fun Day",
    date: "2024-05-01",
    description: "Face painting, bouncy castles, and discount entry for the Kids Playground.",
    image: "https://jkpalmandgarden.com/img/j10.jpg"
  }
];

export const INITIAL_PRICING: PricingItem[] = [
  { id: 1, title: "Football Pitch", price: 8000, unit: "per hour", description: "Standard artificial turf pitch with floodlights.", category: "Venue", icon: "activity" },
  { id: 2, title: "The Courtyard", price: 100000, unit: "per day", description: "Spacious open area for weddings and large ceremonies.", category: "Venue", icon: "home" },
  { id: 3, title: "Palm Garden", price: 100000, unit: "per day", description: "Lush botanical setting for photoshoots and intimate parties.", category: "Venue", icon: "tree" },
  { id: 4, title: "Kids Entry", price: 200, unit: "per child", description: "Full day access to the playground facilities.", category: "Entry", icon: "smile" },
  { id: 5, title: "Snooker Table", price: 1000, unit: "per hour", description: "Professional snooker gaming in the indoor hall.", category: "Activity", icon: "target" }
];

export const INITIAL_GALLERY_IMAGES = [
  "https://jkpalmandgarden.com/img/exp5%20(2).jpg",
  "https://jkpalmandgarden.com/img/j5.jpg",
  "https://jkpalmandgarden.com/img/j4.jpg",
  "https://jkpalmandgarden.com/img/j12.jpg",
  "https://jkpalmandgarden.com/img/j3.jpg",
  "https://jkpalmandgarden.com/img/j13.jpg",
  "https://jkpalmandgarden.com/img/j9.jpg",
  "https://jkpalmandgarden.com/img/exp4.jpg"
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

export const DRINKS_MENU: DrinkCategory[] = [
  {
    category: "BEVERAGES",
    items: [
      { name: "COKE", price: "N700" },
      { name: "WATER", price: "N300" },
      { name: "FAYROUZ", price: "N1,000" },
      { name: "SCHWEPPES", price: "N800" },
      { name: "HOLLANDA EXOTIC", price: "N2,500" },
      { name: "COCONUT YOGHURT", price: "N3,000" },
      { name: "MALTINA", price: "N800" },
    ]
  },
  {
    category: "ENERGY DRINKS",
    items: [
      { name: "CLIMAX", price: "N1,000,000" },
      { name: "FEARLESS", price: "N800,000" },
      { name: "SMIRNOFF ICE", price: "N1,700" },
      { name: "BLACK BULLET", price: "N2,000" },
    ]
  },
  {
    category: "BEER",
    items: [
      { name: "LIFE", price: "N1,200" },
      { name: "GOLDBERG", price: "N1,500" },
      { name: "HEINEKEN", price: "N1,200" },
      { name: "STAR", price: "N1,200" },
      { name: "GUINNESS STOUT", price: "N1,500" },
      { name: "TIGER", price: "N1,200" },
      { name: "SMOOTH", price: "N1,500" },
      { name: "CASTLELITE", price: "N1,500" },
      { name: "ORIGIN BEER", price: "N1,500" },
      { name: "TROPHY", price: "N1,200" },
      { name: "TROPHY STOUT", price: "N1,500" },
      { name: "LEGEND", price: "N1,500" },
      { name: "DESPERADO", price: "N1,500" },
      { name: "GULDER", price: "N1,200" },
      { name: "HERO", price: "N1,200" },
    ]
  },
  {
    category: "WINE, GIN, SPIRIT",
    items: [
      { name: "1960 ROOT BOTTLE", price: "N5,500" },
      { name: "ORIGIN BITTERS", price: "N1,500" },
      { name: "CAPTAIN MORGAN", price: "N15,000" },
      { name: "BEST CREAM", price: "N15,000" },
      { name: "FLART VODKA", price: "N15,000" },
      { name: "JACK DANIELS", price: "N45,000" },
      { name: "BLACK AND WHITE", price: "N15,000" },
      { name: "FOUR COUSIN", price: "N15,000" },
    ]
  }
];
