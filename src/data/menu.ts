import { Pizza, CrustType, PizzaSize } from '../types';

export const PIZZAS: Pizza[] = [
  {
    id: 'margherita',
    name: 'Classic Margherita',
    description: 'Fresh sliced tomatoes, rich mozzarella cheese, fragrant garden basil leaves, and a drizzle of extra virgin olive oil over our house marinara.',
    basePrice: 950,
    prices: {
      small: 950,
      medium: 1250,
      large: 1650,
      jumbo: 2150
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    isPopular: true
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni Feast',
    description: 'An absolute crowd favorite. Generous portions of premium spicy beef pepperoni, double layers of stretchy mozzarella, and a robust red sauce.',
    basePrice: 1250,
    prices: {
      small: 1250,
      medium: 1650,
      large: 2150,
      jumbo: 2750
    },
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'pepperoni',
    isPopular: true,
    spicyLevel: 1
  },
  {
    id: 'veggie',
    name: 'Veggie Supreme',
    description: 'A colorful blend of crisp bell peppers, red onions, mushrooms, earthy black olives, sweet corn, and fresh farm tomatoes.',
    basePrice: 1050,
    prices: {
      small: 1050,
      medium: 1350,
      large: 1850,
      jumbo: 2350
    },
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'veg'
  },
  {
    id: 'bbq',
    name: 'BBQ Chicken',
    description: 'Smoky grilled chicken pieces, tangy hickory BBQ sauce base, sweet caramelized red onions, and fresh cilantro garnish.',
    basePrice: 1350,
    prices: {
      small: 1350,
      medium: 1750,
      large: 2250,
      jumbo: 2850
    },
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    category: 'chicken',
    isPopular: false
  },
  {
    id: 'tikka',
    name: 'Creamy Chicken Tikka',
    description: 'Tender chicken cubes marinated in rich local tikka spices, bell peppers, onions, custom cream sauce base, and a sprinkle of cilantro.',
    basePrice: 1300,
    prices: {
      small: 1300,
      medium: 1700,
      large: 2200,
      jumbo: 2800
    },
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    category: 'chicken',
    isNew: true,
    spicyLevel: 2
  },
  {
    id: 'fiery-jalapeno',
    name: 'Fiery Jalapeño Pepper',
    description: 'Not for the faint-hearted. Spicy sliced jalapeños, fiery green chillies, sweet red onions, chili flakes, topped with a sriracha hot sauce drizzle.',
    basePrice: 1100,
    prices: {
      small: 1100,
      medium: 1400,
      large: 1900,
      jumbo: 2400
    },
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    spicyLevel: 3
  },
  {
    id: 'four-cheese',
    name: 'Four-Cheese Heaven',
    description: 'An indulgent, velvety blend of classic Mozzarella, sharp English Cheddar, salty feta crumbles, and rich grated Parmesan cheese.',
    basePrice: 1200,
    prices: {
      small: 1200,
      medium: 1500,
      large: 2000,
      jumbo: 2550
    },
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    isNew: true
  }
];

export const TOPPINGS: { id: string; name: string; price: number; type: 'veg' | 'meat' }[] = [
  { id: 'mushrooms', name: 'Fresh Mushrooms', price: 120, type: 'veg' },
  { id: 'olives', name: 'Black Olives', price: 100, type: 'veg' },
  { id: 'jalapenos', name: 'Spicy Jalapeños', price: 110, type: 'veg' },
  { id: 'onions', name: 'Red Onions', price: 80, type: 'veg' },
  { id: 'peppers', name: 'Bell Peppers', price: 90, type: 'veg' },
  { id: 'tomatoes', name: 'Cherry Tomatoes', price: 95, type: 'veg' },
  { id: 'sweet-corn', name: 'Sweet Golden Corn', price: 85, type: 'veg' },
  { id: 'pepperoni', name: 'Premium Pepperoni', price: 250, type: 'meat' },
  { id: 'grilled-chicken', name: 'Grilled BBQ Chicken', price: 220, type: 'meat' },
  { id: 'tikka-chicken', name: 'Spicy Tikka Chicken', price: 240, type: 'meat' },
  { id: 'extra-cheese', name: 'Extra Mozzarella', price: 180, type: 'veg' }
];

export const CRUST_PREMIUMS: Record<CrustType, number> = {
  'classic': 0,
  'thin-crust': 50,
  'pan': 120,
  'cheese-burst': 250
};

export const CRUST_LABELS: Record<CrustType, string> = {
  'classic': 'Hand-Tossed Classic',
  'thin-crust': 'Thin & Crispy (+Rs. 50)',
  'pan': 'Golden Pan Crust (+Rs. 120)',
  'cheese-burst': 'Ultimate Cheese Burst (+Rs. 250)'
};

export const SIZE_LABELS: Record<PizzaSize, string> = {
  'small': 'Small (7")',
  'medium': 'Medium (10")',
  'large': 'Large (13")',
  'jumbo': 'Jumbo (16")'
};

export const INITIAL_REVIEWS = [
  {
    id: 'r1',
    name: 'Aisha Khan',
    rating: 5,
    comment: 'The wood-fired flavor is absolutely authentic! It felt like sitting in a cozy Napoli pizzeria. The Cheese Burst crust is out of this world.',
    date: '2026-07-02'
  },
  {
    id: 'r2',
    name: 'Hamza Ahmed',
    rating: 5,
    comment: 'Awesome delivery speed! The Pepperoni Feast was steaming hot, cheese was pulling perfectly, and the pepperoni was incredibly crispy.',
    date: '2026-07-05'
  },
  {
    id: 'r3',
    name: 'Maria Syed',
    rating: 4,
    comment: 'Loved the Chicken Tikka pizza. Great balance of local spices and perfect cheese consistency. Highly recommended!',
    date: '2026-07-06'
  }
];
