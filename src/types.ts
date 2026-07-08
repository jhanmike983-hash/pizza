export type PizzaSize = 'small' | 'medium' | 'large' | 'jumbo';
export type CrustType = 'classic' | 'thin-crust' | 'pan' | 'cheese-burst';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Small size price
  prices: Record<PizzaSize, number>;
  image: string;
  category: 'veg' | 'non-veg' | 'chicken' | 'pepperoni';
  isPopular?: boolean;
  isNew?: boolean;
  spicyLevel?: number; // 0 to 3
}

export interface CartItem {
  id: string; // Unique ID including options to differentiate identical pizzas with different sizes/crusts
  pizza: Pizza;
  selectedSize: PizzaSize;
  selectedCrust: CrustType;
  quantity: number;
  addedToppings: string[];
  totalItemPrice: number;
  specialInstructions?: string;
}

export interface CustomPizza {
  size: PizzaSize;
  crust: CrustType;
  sauce: 'tomato' | 'bbq' | 'white-garlic';
  cheese: 'regular' | 'double' | 'vegan';
  toppings: string[];
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  instructions?: string;
  paymentMethod: 'cod' | 'card';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}
