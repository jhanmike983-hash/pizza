import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pizza as PizzaType, CartItem, PizzaSize, CrustType, OrderDetails } from './types';
import { PIZZAS, TOPPINGS, CRUST_PREMIUMS, SIZE_LABELS, CRUST_LABELS } from './data/menu';

// Subcomponents
import Header from './components/Header';
import PizzaCustomizer from './components/PizzaCustomizer';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import OrderTracker from './components/OrderTracker';

// Icons
import { 
  Pizza as PizzaIcon, Star, Heart, Flame, Sparkles, Plus, Minus, 
  Clock, ArrowRight, Search, Filter, Check, Eye, HelpCircle, X
} from 'lucide-react';

export default function App() {
  // Navigation and core layout states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeOrder, setActiveOrder] = useState<{
    details: OrderDetails;
    cart: CartItem[];
    total: number;
  } | null>(null);

  // Home states (menu search, filters, inline customizing)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'veg' | 'non-veg' | 'chicken' | 'pepperoni'>('all');
  const [customizingPizza, setCustomizingPizza] = useState<PizzaType | null>(null);
  const [inlineSize, setInlineSize] = useState<PizzaSize>('medium');
  const [inlineCrust, setInlineCrust] = useState<CrustType>('classic');
  const [inlineToppings, setInlineToppings] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const cachedCart = localStorage.getItem('pizza_oven_cart');
    const cachedActiveOrder = localStorage.getItem('pizza_oven_active_order');
    const cachedFavs = localStorage.getItem('pizza_oven_favs');

    if (cachedCart) setCartItems(JSON.parse(cachedCart));
    if (cachedActiveOrder) setActiveOrder(JSON.parse(cachedActiveOrder));
    if (cachedFavs) setFavorites(JSON.parse(cachedFavs));
  }, []);

  // Sync to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('pizza_oven_cart', JSON.stringify(newCart));
  };

  const handleToggleFavorite = (id: string) => {
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('pizza_oven_favs', JSON.stringify(updated));
  };

  // Cart operations
  const handleAddSignaturePizza = (pizza: PizzaType, size: PizzaSize, crust: CrustType, toppings: string[] = []) => {
    const uniqueId = `${pizza.id}-${size}-${crust}-${toppings.sort().join('-')}`;
    
    // Compute total single item cost
    const sizePrice = pizza.prices[size];
    const crustPremium = CRUST_PREMIUMS[crust];
    const toppingsCost = toppings.reduce((total, toppingId) => {
      const t = TOPPINGS.find((top) => top.id === toppingId);
      return total + (t ? t.price : 0);
    }, 0);
    const singlePrice = sizePrice + crustPremium + toppingsCost;

    const existingIdx = cartItems.findIndex((item) => item.id === uniqueId);
    
    if (existingIdx > -1) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      updated[existingIdx].totalItemPrice = updated[existingIdx].quantity * singlePrice;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        id: uniqueId,
        pizza,
        selectedSize: size,
        selectedCrust: crust,
        quantity: 1,
        addedToppings: toppings,
        totalItemPrice: singlePrice,
      };
      saveCart([...cartItems, newItem]);
    }

    // Small floating notice or sound can go here, let's open cart drawer briefly
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          
          const singleItemPrice = item.totalItemPrice / item.quantity;
          return {
            ...item,
            quantity: newQty,
            totalItemPrice: newQty * singleItemPrice,
          };
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
    
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const filtered = cartItems.filter((item) => item.id !== id);
    saveCart(filtered);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  };

  // Add Custom Pizza built in Customizer
  const handleAddCustomPizza = (customItem: CartItem) => {
    saveCart([...cartItems, customItem]);
    setIsCartOpen(true);
  };

  // Checkout and orders
  const handleConfirmOrder = (details: OrderDetails) => {
    const orderData = {
      details,
      cart: cartItems,
      total: getCartTotal(),
    };
    setActiveOrder(orderData);
    localStorage.setItem('pizza_oven_active_order', JSON.stringify(orderData));
    
    // Clear cart
    saveCart([]);
    isCartOpen && setIsCartOpen(false);
    setIsCheckingOut(false);
  };

  const handleResetOrder = () => {
    setActiveOrder(null);
    localStorage.removeItem('pizza_oven_active_order');
  };

  // Inline customizations for signature pizzas
  const openCustomizerModal = (pizza: PizzaType) => {
    setCustomizingPizza(pizza);
    setInlineSize('medium');
    setInlineCrust('classic');
    setInlineToppings([]);
  };

  const toggleInlineTopping = (toppingId: string) => {
    setInlineToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
    );
  };

  const getInlineTotal = () => {
    if (!customizingPizza) return 0;
    const sizePrice = customizingPizza.prices[inlineSize];
    const crustPremium = CRUST_PREMIUMS[inlineCrust];
    const toppingsCost = inlineToppings.reduce((total, id) => {
      const t = TOPPINGS.find((top) => top.id === id);
      return total + (t ? t.price : 0);
    }, 0);
    return sizePrice + crustPremium + toppingsCost;
  };

  // Filter and search menu items
  const filteredPizzas = PIZZAS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'veg') return matchesSearch && p.category === 'veg';
    if (selectedCategory === 'non-veg') return matchesSearch && p.category !== 'veg';
    return matchesSearch && p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <Header 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        cartTotal={getCartTotal()} 
        onCartOpen={() => setIsCartOpen(true)} 
      />

      {/* 2. Slide Drawer Basket */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        cartTotal={getCartTotal()}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckingOut(true);
        }}
      />

      {/* Conditional Screens: Checkout, Live Tracker, or Main Landing */}
      <AnimatePresence mode="wait">
        {activeOrder ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrderTracker
              orderDetails={activeOrder.details}
              cartItems={activeOrder.cart}
              cartTotal={activeOrder.total}
              onResetOrder={handleResetOrder}
            />
          </motion.div>
        ) : isCheckingOut ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <CheckoutForm
              cartItems={cartItems}
              cartTotal={getCartTotal()}
              onConfirmOrder={handleConfirmOrder}
              onCancel={() => setIsCheckingOut(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section
              id="home"
              className="relative min-h-screen bg-stone-900 text-white flex items-center justify-center pt-28 pb-20 px-4 overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.82)), url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay animated fire particles */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 w-full px-4 sm:px-6">
                
                {/* Hero Words */}
                <div className="flex-1 text-center lg:text-left max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pizza-red/20 text-pizza-red rounded-full text-xs font-black uppercase tracking-wider mb-5 border border-pizza-red/30"
                  >
                    <Flame size={12} className="text-pizza-red animate-pulse" /> Wood-Fired Brick Oven Authentic Slices
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white"
                  >
                    Perfectly Baked <br />
                    <span className="text-pizza-gold">Every Single Time.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-stone-300 text-base sm:text-lg lg:text-xl mt-6 leading-relaxed font-sans"
                  >
                    Sourdough fermented for 48 hours, stone baked at 450&deg;C, and layered with premium rich mozzarella. Delivered piping hot to your doorstep in 20 minutes.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mt-10 justify-center lg:justify-start"
                  >
                    <button
                      onClick={() => {
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto bg-pizza-red hover:bg-pizza-crimson text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
                    >
                      Explore Signature Menu <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => {
                        document.getElementById('custom-pizza')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-full border border-white/20 hover:border-white/30 transition-all text-sm uppercase tracking-wide backdrop-blur-sm cursor-pointer"
                    >
                      Bake Custom Pizza
                    </button>
                  </motion.div>

                  {/* Trust factors */}
                  <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                    <div className="text-center lg:text-left">
                      <span className="block text-xl sm:text-2xl font-black text-pizza-gold">450°C</span>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">Brick Baked</span>
                    </div>
                    <div className="text-center lg:text-left">
                      <span className="block text-xl sm:text-2xl font-black text-pizza-gold">48 Hrs</span>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">Sourdough fermentation</span>
                    </div>
                    <div className="text-center lg:text-left">
                      <span className="block text-xl sm:text-2xl font-black text-pizza-gold">20 Min</span>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">Guaranteed Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Hero Big Pizza Visual illustration */}
                <div className="flex-1 flex justify-center relative select-none mt-8 lg:mt-0">
                  <div className="absolute w-80 h-80 sm:w-110 sm:h-110 bg-pizza-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="relative w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full shadow-2xl overflow-hidden border-8 border-stone-800"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
                      alt="Oven hot Pizza"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                  </motion.div>
                </div>

              </div>
            </section>

            {/* Signature Menu Section */}
            <section id="menu" className="py-20 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-pizza-red rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <PizzaIcon size={12} /> Artisanal Recipes
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
                    Our Signature Slices
                  </h2>
                  <p className="text-stone-600 mt-2 text-sm sm:text-base">
                    Handmade daily using locally sourced organic vegetables, selected aged premium cheeses, and top quality meats.
                  </p>
                </div>

                {/* Toolbar: Category Filters & Search bar */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
                  
                  {/* Category select buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {[
                      { id: 'all', label: 'All Slices' },
                      { id: 'veg', label: '🌱 Pure Vegetarian' },
                      { id: 'non-veg', label: '🍖 Meat Feast' },
                      { id: 'chicken', label: '🍗 Spiced Chicken' },
                      { id: 'pepperoni', label: '🍕 Pepperoni' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-pizza-red text-white shadow-sm font-black'
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search box input */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-3 text-stone-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search name, toppings, ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-pizza-red focus:border-pizza-red transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                </div>

                {/* Pizzas grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredPizzas.map((pizza) => {
                      const isFav = favorites.includes(pizza.id);
                      return (
                        <motion.div
                          key={pizza.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-3xl overflow-hidden border border-stone-200/60 shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
                        >
                          {/* Image Box */}
                          <div className="relative h-60 overflow-hidden bg-stone-100 shrink-0">
                            <img
                              src={pizza.image}
                              alt={pizza.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Badges: Spicy, Popular, New */}
                            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                              {pizza.isPopular && (
                                <span className="bg-pizza-gold text-stone-950 font-black text-[9px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                                  🔥 Popular
                                </span>
                              )}
                              {pizza.isNew && (
                                <span className="bg-pizza-red text-white font-black text-[9px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                                  ✨ New
                                </span>
                              )}
                              {pizza.spicyLevel && pizza.spicyLevel > 0 && (
                                <span className="bg-orange-500 text-white font-black text-[9px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-0.5">
                                  🌶️ {pizza.spicyLevel === 3 ? 'Fiery' : 'Spicy'}
                                </span>
                              )}
                            </div>

                            {/* Fav button */}
                            <button
                              onClick={() => handleToggleFavorite(pizza.id)}
                              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all focus:outline-none cursor-pointer ${
                                isFav 
                                  ? 'bg-red-50 text-pizza-red' 
                                  : 'bg-white/80 hover:bg-white text-stone-600 hover:text-pizza-red'
                              }`}
                            >
                              <Heart size={16} className={isFav ? 'fill-pizza-red' : ''} />
                            </button>
                            
                            {/* Fast Buy overlay on image */}
                            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                              <button
                                onClick={() => openCustomizerModal(pizza)}
                                className="bg-white text-stone-900 px-4 py-2 rounded-full font-bold text-xs shadow-md hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={12} /> Fast Customize
                              </button>
                            </div>
                          </div>

                          {/* Detail Box */}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h3 className="font-display text-lg font-black text-stone-900 leading-snug">
                                  {pizza.name}
                                </h3>
                                <div className="text-right shrink-0">
                                  <span className="text-xs text-stone-400 block font-semibold">Starts at</span>
                                  <span className="font-mono text-base font-bold text-pizza-red">
                                    Rs. {pizza.basePrice.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                                {pizza.description}
                              </p>
                            </div>

                            {/* Base CTA bar inside card */}
                            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => openCustomizerModal(pizza)}
                                className="text-xs font-extrabold text-stone-700 hover:text-pizza-red transition-colors focus:outline-none cursor-pointer"
                              >
                                Customize crust &amp; sizes
                              </button>

                              <button
                                onClick={() => handleAddSignaturePizza(pizza, 'medium', 'classic')}
                                className="bg-stone-900 hover:bg-pizza-red text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                Add Medium (10")
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* 3. Build-Your-Own Customizer Section */}
            <PizzaCustomizer onAddCustomPizza={handleAddCustomPizza} />

            {/* 4. Kitchen Photo Lightbox Gallery */}
            <Gallery />

            {/* 5. User Feedback Testimonial Carousel */}
            <Reviews />

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400 py-12 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-display text-white text-lg font-extrabold mb-4 flex items-center gap-2">
                    <PizzaIcon size={18} className="text-pizza-red" /> The Pizza Oven
                  </h3>
                  <p className="text-xs leading-relaxed max-w-sm">
                    Bringing the world-renowned taste of authentic stone-baked wood-fired pizzas right into your home. Baked with love, passion, and premium quality imports.
                  </p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Kitchen Timings</h4>
                  <p className="text-xs leading-loose">
                    Monday - Friday: 12:00 PM - 12:00 AM <br />
                    Saturday - Sunday: 11:00 AM - 02:00 AM
                  </p>
                  <p className="text-xs text-pizza-gold font-bold mt-2">
                    Delivering in 20 minutes across the metropolitan radius.
                  </p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Contact & support</h4>
                  <p className="text-xs leading-loose">
                    Head Office: Food Street, Sector 4, Metropolitan Area <br />
                    Hotline: +92 (51) 111-OVEN-77 <br />
                    Support: order@thepizzaoven.com
                  </p>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/5 text-center text-xs">
                &copy; {new Date().getFullYear()} The Pizza Oven. Freshly crafted by Google AI Studio. All rights reserved.
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Fast Customizer Modal Overlay */}
      <AnimatePresence>
        {customizingPizza && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={() => setCustomizingPizza(null)}></div>
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div>
                  <span className="text-[10px] text-pizza-red uppercase font-extrabold tracking-wider">Custom Chef Panel</span>
                  <h3 className="font-display text-xl font-black text-stone-900 leading-tight">
                    Customize {customizingPizza.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizingPizza(null)}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex flex-col gap-6">
                
                {/* 1. Size Options */}
                <div>
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2.5">
                    1. Choose Diameter Size
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['small', 'medium', 'large', 'jumbo'] as PizzaSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setInlineSize(sz)}
                        className={`p-3 rounded-xl border-2 text-left transition-all focus:outline-none cursor-pointer flex flex-col justify-between ${
                          inlineSize === sz
                            ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-xs font-bold capitalize">{SIZE_LABELS[sz]}</span>
                        <span className="text-[11px] font-black text-stone-500 mt-1 block">
                          Rs. {customizingPizza.prices[sz].toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Crust options */}
                <div>
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2.5">
                    2. Select Baked Crust Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['classic', 'thin-crust', 'pan', 'cheese-burst'] as CrustType[]).map((crt) => (
                      <button
                        key={crt}
                        onClick={() => setInlineCrust(crt)}
                        className={`p-2.5 px-3.5 rounded-xl border-2 flex items-center justify-between transition-all focus:outline-none cursor-pointer ${
                          inlineCrust === crt
                            ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-xs font-bold capitalize">{crt.replace('-', ' ')}</span>
                        {CRUST_PREMIUMS[crt] > 0 && (
                          <span className="text-[10px] font-black bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                            + Rs. {CRUST_PREMIUMS[crt]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Extra Toppings */}
                <div>
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2.5">
                    3. Toss Extra Toppings (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TOPPINGS.slice(0, 8).map((top) => (
                      <button
                        key={top.id}
                        onClick={() => toggleInlineTopping(top.id)}
                        className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-left transition-all focus:outline-none cursor-pointer ${
                          inlineToppings.includes(top.id)
                            ? 'border-green-600 bg-green-50 text-green-950 font-bold'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-xs font-bold truncate pr-1">{top.name}</span>
                        <span className="text-[10px] text-stone-500 shrink-0">+Rs. {top.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action summary bar inside modal */}
              <div className="p-6 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Total Price</span>
                  <span className="font-mono text-xl font-black text-pizza-red">
                    Rs. {getInlineTotal().toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleAddSignaturePizza(customizingPizza, inlineSize, inlineCrust, inlineToppings);
                    setCustomizingPizza(null);
                  }}
                  className="bg-pizza-red hover:bg-pizza-crimson text-white py-3 px-5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <Sparkles size={13} /> Add Slices to Cart
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
