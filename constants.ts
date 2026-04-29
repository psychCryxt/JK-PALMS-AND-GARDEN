import { ServiceItem, Testimonial, FeatureItem, EventItem, PricingItem, MenuCategory } from './types';

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
  { id: 1, title: "Football Pitch (1 Hour)", price: 8000, unit: "per hour", description: "Standard artificial turf pitch with floodlights.", category: "Venue", icon: "activity" },
  { id: 6, title: "Football Pitch (1.5 Hours)", price: 12000, unit: "per 90min", description: "Extended session for more intense matches.", category: "Venue", icon: "activity" },
  { id: 7, title: "Football Pitch (2 Hours)", price: 16000, unit: "per 2 hours", description: "Perfect for full matches and tournaments.", category: "Venue", icon: "activity" },
  { id: 2, title: "The Courtyard", price: 100000, unit: "per day", description: "Spacious open area for weddings and large ceremonies.", category: "Venue", icon: "home" },
  { id: 3, title: "Palm Garden", price: 100000, unit: "per day", description: "Lush botanical setting for photoshoots and intimate parties.", category: "Venue", icon: "tree" },
  { id: 8, title: "Sendforth Event", price: 100000, unit: "per event", description: "Special package for send-forth ceremonies.", category: "Venue", icon: "party" },
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

export const DRINKS_MENU: MenuCategory[] = [
  {
    category: "BEVERAGES & SOFT DRINKS",
    items: [
      { name: "Coke", price: "₦700" },
      { name: "Water", price: "₦300" },
      { name: "Fayrouz", price: "₦1,000" },
      { name: "Schweppes", price: "₦800" },
      { name: "Maltina", price: "₦800" },
      { name: "Chi Exotic", price: "₦2,500" },
      { name: "Hollandia Yogurt", price: "₦3,000" },
      { name: "Coconut Yogurt", price: "₦2,000" },
    ]
  },
  {
    category: "ENERGY DRINKS",
    items: [
      { name: "Climax", price: "₦1,000" },
      { name: "Fearless", price: "₦800" },
      { name: "Power Horse", price: "₦1,500" },
      { name: "Monster", price: "₦1,200" },
      { name: "Bullet", price: "₦2,000" },
    ]
  },
  {
    category: "BEER & CIDER",
    items: [
      { name: "Life", price: "₦1,200" },
      { name: "Goldberg", price: "₦1,200" },
      { name: "Heineken", price: "₦1,500" },
      { name: "Big Star", price: "₦1,200" },
      { name: "Star Radler", price: "₦1,200" },
      { name: "Tiger", price: "₦1,200" },
      { name: "Trophy", price: "₦1,200" },
      { name: "Gulder", price: "₦1,200" },
      { name: "Hero", price: "₦1,200" },
      { name: "Legend", price: "₦1,500" },
      { name: "Desperado", price: "₦1,500" },
      { name: "Castlelite", price: "₦1,500" },
      { name: "Origin Beer", price: "₦1,500" },
      { name: "Smooth", price: "₦1,500" },
      { name: "Medium Stout", price: "₦1,500" },
      { name: "Trophy Stout", price: "₦1,500" },
      { name: "Guinness Stout", price: "₦1,500" },
      { name: "Smirnoff Ice", price: "₦1,700" },
      { name: "Smirnoff Double Black", price: "₦1,500" },
    ]
  },
  {
    category: "WINE, GIN, SPIRIT",
    items: [
      { name: "1960 Root Pit", price: "₦1,200" },
      { name: "1960 Root Bottle", price: "₦8,000" },
      { name: "Origin Bitters Pet", price: "₦1,500" },
      { name: "Origin Bitters Bottle", price: "₦8,000" },
      { name: "Andre", price: "₦18,000" },
      { name: "Smirnoff X1", price: "₦8,000" },
      { name: "Gordons", price: "₦10,000" },
      { name: "Eva Wine", price: "₦9,000" },
      { name: "Veleta", price: "₦8,000" },
      { name: "Four Cousins", price: "₦15,000" },
      { name: "Seagrams Imperial Blue", price: "₦8,000" },
      { name: "Big Captain Morgan", price: "₦15,000" },
      { name: "Squadron", price: "₦8,000" },
      { name: "Jack Daniels", price: "₦45,000" },
    ]
  }
];

export const KITCHEN_MENU: MenuCategory[] = [
  {
    category: "RICE & PASTA",
    items: [
      { name: "Jollof Rice", price: "₦2,500" },
      { name: "White Rice and Stew", price: "₦2,500" },
      { name: "Fried Rice", price: "₦2,500" },
      { name: "Rice and Beans", price: "₦2,500" },
      { name: "Native Rice", price: "₦2,500" },
      { name: "Chinese Rice", price: "₦3,000" },
      { name: "Coconut Rice", price: "₦2,500" },
      { name: "Coconut Rice (Special)", price: "₦3,500" },
      { name: "Spaghetti and Stew", price: "₦2,500" },
      { name: "Spaghetti and Egg", price: "₦2,500" },
      { name: "Indomie and Egg", price: "₦2,000" },
      { name: "Indomie, Egg and Sausage", price: "₦2,500" },
    ]
  },
  {
    category: "YAM, PLANTAIN & POTATO",
    items: [
      { name: "Yam and Egg Sauce", price: "₦2,500" },
      { name: "Fried Yam and Pepper Sauce", price: "₦2,500" },
      { name: "Yam Porridge", price: "₦2,500" },
      { name: "Potato Porridge", price: "₦2,500" },
      { name: "Roasted Yam and Oil", price: "₦2,000" },
      { name: "Plantain and Egg Sauce", price: "₦2,500" },
      { name: "Plantain and Egg", price: "₦2,500" },
      { name: "BBQ Loaded Fries", price: "₦4,000" },
    ]
  },
  {
    category: "SOUPS & SWALLOWS",
    items: [
      { name: "Garri (Eba) and Okra Soup", price: "₦2,500" },
      { name: "Garri and Egusi Soup", price: "₦2,500" },
      { name: "Garri and Vegetable Soup", price: "₦2,500" },
      { name: "Garri and Ogbono Soup", price: "₦2,500" },
      { name: "Amala and Egusi", price: "₦2,500" },
      { name: "Semovita and Egusi Soup", price: "₦2,500" },
      { name: "Semovita and Vegetable Soup", price: "₦2,500" },
      { name: "Semovita and Ogbono Soup", price: "₦2,500" },
      { name: "Fufu and Egusi", price: "₦2,500" },
      { name: "Fufu and Vegetable Soup", price: "₦2,500" },
      { name: "Pounded Yam and Egusi", price: "₦2,500" },
      { name: "Pounded Yam and Vegetable Soup", price: "₦3,000" },
      { name: "Tuwo and Miyan Kuka", price: "₦2,500" },
    ]
  },
  {
    category: "TRADITIONAL & SPECIALS",
    items: [
      { name: "Masa", price: "₦200 each" },
      { name: "Plate of Masa and Soup", price: "₦1,500" },
      { name: "Plate of Masa and Yaji Spice", price: "₦1,000" },
      { name: "Pap / Turn Brown and Akara", price: "₦1,500" },
      { name: "Pap / Turn Brown and Moi-Moi", price: "₦2,000" },
      { name: "Turn Brown, Akara and Bread", price: "₦2,000" },
      { name: "Moi-Moi", price: "₦2,000" },
      { name: "Moi-Moi and Rice", price: "₦2,500" },
    ]
  },
  {
    category: "PEPPER SOUP & MEAT",
    items: [
      { name: "Pepper Soup (Goat Meat)", price: "₦3,500" },
      { name: "Pepper Soup (Catfish)", price: "₦3,500" },
      { name: "Pepper Soup (Beef)", price: "₦3,500" },
      { name: "Pepper Soup (Intestines)", price: "₦3,500" },
      { name: "Pepper Soup (Chicken)", price: "₦3,500" },
      { name: "Pepper Meat (Chicken)", price: "₦3,000" },
      { name: "Pepper Meat (Beef)", price: "₦3,000" },
      { name: "Pepper Meat (Kpomo)", price: "₦2,000" },
    ]
  },
  {
    category: "SNACKS & FAST FOOD",
    items: [
      { name: "Shawarma single sausage", price: "₦4,000" },
      { name: "Shawarma double sausage", price: "₦4,500" },
      { name: "Ice Cream", price: "₦1,000 – ₦5,000" },
    ]
  },
  {
    category: "EXTRA ADD-ONS",
    items: [
      { name: "Extra Meat", price: "₦500" },
      { name: "Extra Fish", price: "₦1,000" },
      { name: "Extra Egg", price: "₦500" },
      { name: "Plantain", price: "₦1,000" },
      { name: "Chicken", price: "₦2,000" },
    ]
  }
];
