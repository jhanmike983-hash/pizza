import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOPPINGS, CRUST_PREMIUMS, CRUST_LABELS, SIZE_LABELS } from '../data/menu';
import { Pizza, PizzaSize, CrustType, CartItem } from '../types';
import { Check, Flame, Sparkles, HelpCircle } from 'lucide-react';

interface PizzaCustomizerProps {
  onAddCustomPizza: (item: CartItem) => void;
}

export default function PizzaCustomizer({ onAddCustomPizza }: PizzaCustomizerProps) {
  const [size, setSize] = useState<PizzaSize>('medium');
  const [crust, setCrust] = useState<CrustType>('classic');
  const [sauce, setSauce] = useState<'tomato' | 'bbq' | 'white-garlic'>('tomato');
  const [cheese, setCheese] = useState<'regular' | 'double' | 'vegan'>('regular');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Prices and details for Custom Pizza
  const basePrices: Record<PizzaSize, number> = {
    small: 700,
    medium: 990,
    large: 1390,
    jumbo: 1890,
  };

  const getToppingPrice = (toppingId: string) => {
    const topping = TOPPINGS.find((t) => t.id === toppingId);
    return topping ? topping.price : 0;
  };

  const calculateTotalPrice = () => {
    const base = basePrices[size];
    const crustPremium = CRUST_PREMIUMS[crust];
    const cheesePremium = cheese === 'double' ? 180 : 0;
    const toppingsCost = selectedToppings.reduce((total, id) => total + getToppingPrice(id), 0);
    return base + crustPremium + cheesePremium + toppingsCost;
  };

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const customPizzaObj: Pizza = {
      id: `custom-${Date.now()}`,
      name: 'My Custom Pizza',
      description: `Custom ${SIZE_LABELS[size]} on ${CRUST_LABELS[crust]} with ${sauce} sauce, ${cheese} cheese. Toppings: ${
        selectedToppings.length > 0
          ? selectedToppings.map((id) => TOPPINGS.find((t) => t.id === id)?.name).join(', ')
          : 'None'
      }`,
      basePrice: basePrices.small,
      prices: basePrices,
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
      category: selectedToppings.some((id) => TOPPINGS.find((t) => t.id === id)?.type === 'meat') ? 'non-veg' : 'veg',
    };

    const cartItem: CartItem = {
      id: `custom-cart-${Date.now()}`,
      pizza: customPizzaObj,
      selectedSize: size,
      selectedCrust: crust,
      quantity: 1,
      addedToppings: selectedToppings,
      totalItemPrice: calculateTotalPrice(),
      specialInstructions: 'Custom built by creator.',
    };

    onAddCustomPizza(cartItem);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      // Reset toppings but keep parameters
      setSelectedToppings([]);
    }, 2500);
  };

  // Predefined visual coordinates for drawing toppings inside the pizza circle
  const toppingCoordinates: Record<string, { x: number; y: number; r: number }[]> = {
    mushrooms: [
      { x: 35, y: 35, r: 0 }, { x: 65, y: 32, r: 45 }, { x: 50, y: 68, r: -20 },
      { x: 28, y: 58, r: 90 }, { x: 72, y: 60, r: 15 }, { x: 50, y: 22, r: 180 },
    ],
    olives: [
      { x: 42, y: 40, r: 0 }, { x: 58, y: 38, r: 0 }, { x: 50, y: 55, r: 0 },
      { x: 33, y: 48, r: 0 }, { x: 67, y: 46, r: 0 }, { x: 48, y: 30, r: 0 },
      { x: 55, y: 68, r: 0 }, { x: 38, y: 62, r: 0 },
    ],
    jalapenos: [
      { x: 30, y: 38, r: 10 }, { x: 70, y: 42, r: -35 }, { x: 45, y: 65, r: 80 },
      { x: 55, y: 28, r: 45 }, { x: 32, y: 52, r: -15 }, { x: 68, y: 55, r: 110 },
    ],
    onions: [
      { x: 38, y: 26, r: 25 }, { x: 62, y: 28, r: -15 }, { x: 40, y: 68, r: 120 },
      { x: 65, y: 62, r: 40 }, { x: 26, y: 46, r: -80 }, { x: 74, y: 44, r: 75 },
    ],
    peppers: [
      { x: 44, y: 35, r: 45 }, { x: 56, y: 33, r: -15 }, { x: 48, y: 62, r: 115 },
      { x: 35, y: 50, r: 90 }, { x: 65, y: 52, r: -45 }, { x: 52, y: 46, r: 200 },
    ],
    tomatoes: [
      { x: 32, y: 32, r: 0 }, { x: 68, y: 35, r: 0 }, { x: 50, y: 72, r: 0 },
      { x: 26, y: 55, r: 0 }, { x: 74, y: 52, r: 0 },
    ],
    'sweet-corn': [
      { x: 36, y: 42, r: 0 }, { x: 64, y: 40, r: 0 }, { x: 50, y: 35, r: 0 },
      { x: 48, y: 60, r: 0 }, { x: 38, y: 58, r: 0 }, { x: 62, y: 58, r: 0 },
      { x: 44, y: 28, r: 0 }, { x: 56, y: 26, r: 0 }, { x: 52, y: 48, r: 0 },
    ],
    pepperoni: [
      { x: 35, y: 35, r: 0 }, { x: 65, y: 35, r: 0 }, { x: 50, y: 65, r: 0 },
      { x: 28, y: 48, r: 0 }, { x: 72, y: 48, r: 0 }, { x: 50, y: 25, r: 0 },
    ],
    'grilled-chicken': [
      { x: 40, y: 32, r: 15 }, { x: 60, y: 30, r: -45 }, { x: 48, y: 65, r: 60 },
      { x: 30, y: 52, r: -20 }, { x: 70, y: 55, r: 110 }, { x: 50, y: 46, r: 250 },
    ],
    'tikka-chicken': [
      { x: 42, y: 30, r: -20 }, { x: 58, y: 32, r: 40 }, { x: 46, y: 62, r: 130 },
      { x: 32, y: 48, r: 90 }, { x: 68, y: 50, r: -60 }, { x: 52, y: 45, r: 10 },
    ],
    'extra-cheese': [
      { x: 45, y: 45, r: 0 }, { x: 55, y: 45, r: 0 }, { x: 50, y: 50, r: 0 },
    ],
  };

  return (
    <section id="custom-pizza" className="py-20 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Sparkles size={12} /> Custom Bake Craft
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight"
          >
            Build Your Own Masterpiece
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 mt-3 text-lg"
          >
            Become the ultimate pizza chef. Pick your crust, sauce, cheese, and select fresh toppings to watch it update in real time.
          </motion.p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Pizza Visual Canvas (Sticky on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24 bg-white rounded-3xl p-8 shadow-md border border-stone-100">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Flame className="text-pizza-red animate-pulse" size={18} /> Live Oven Preview
            </h3>
            
            <div className="relative w-72 h-72 sm:w-85 sm:h-85 flex items-center justify-center bg-stone-50 rounded-full border border-stone-200 shadow-inner overflow-hidden">
              
              {/* Wooden Board Backing */}
              <div className="absolute w-[92%] h-[92%] rounded-full bg-orange-100 border-4 border-orange-200/50 shadow-md"></div>
              
              {/* 1. Base Pizza Crust */}
              <motion.div
                animate={{
                  scale: size === 'small' ? 0.8 : size === 'medium' ? 0.9 : size === 'large' ? 0.97 : 1.05
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`absolute rounded-full shadow-lg border-8 border-amber-700/80 transition-colors duration-300 ${
                  crust === 'cheese-burst' 
                    ? 'bg-amber-100 border-amber-600 ring-4 ring-pizza-gold/30' 
                    : crust === 'pan' 
                    ? 'bg-amber-200 border-amber-800' 
                    : crust === 'thin-crust'
                    ? 'bg-amber-100 border-amber-600'
                    : 'bg-amber-100 border-amber-700'
                }`}
                style={{ width: '80%', height: '80%' }}
              >
                
                {/* Crust baked textures */}
                <div className="absolute inset-2 rounded-full border-2 border-amber-600/30 border-dashed animate-pulse-slow"></div>

                {/* 2. Sauce Layer */}
                <div
                  className={`absolute inset-4 rounded-full transition-colors duration-500 shadow-inner ${
                    sauce === 'bbq'
                      ? 'bg-amber-950 border border-amber-900'
                      : sauce === 'white-garlic'
                      ? 'bg-stone-100 border border-stone-200'
                      : 'bg-red-800 border border-red-900'
                  }`}
                >
                  
                  {/* 3. Cheese Layer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: cheese === 'double' ? 0.95 : cheese === 'vegan' ? 0.75 : 0.85 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute inset-1.5 rounded-full mix-blend-screen transition-all ${
                      cheese === 'vegan'
                        ? 'bg-yellow-100/90'
                        : cheese === 'double'
                        ? 'bg-yellow-200 ring-2 ring-pizza-gold/20'
                        : 'bg-yellow-100'
                    }`}
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(254,243,199,0.8) 20%, transparent 60%)',
                    }}
                  >
                    
                    {/* Golden melted details */}
                    <div className="absolute inset-4 rounded-full border border-yellow-300/40 border-double bg-yellow-100/30 opacity-70"></div>

                    {/* 4. Active Toppings Layer */}
                    <div className="absolute inset-0 w-full h-full relative">
                      <AnimatePresence>
                        {selectedToppings.map((toppingId) => {
                          const coords = toppingCoordinates[toppingId] || [];
                          return coords.map((coord, idx) => {
                            // Render distinct visual tags/shapes for different toppings
                            let toppingMarkup = null;

                            if (toppingId === 'pepperoni') {
                              toppingMarkup = (
                                <div className="w-6 h-6 rounded-full bg-red-600 border border-red-800 flex items-center justify-center shadow-md">
                                  <div className="w-4 h-4 rounded-full bg-red-700 border border-red-900 border-dotted"></div>
                                </div>
                              );
                            } else if (toppingId === 'mushrooms') {
                              toppingMarkup = (
                                <div className="w-5 h-4 bg-stone-300 border-stone-400 rounded-t-full shadow-sm flex items-center justify-center relative">
                                  <div className="absolute top-3 w-1.5 h-2 bg-stone-400 rounded"></div>
                                </div>
                              );
                            } else if (toppingId === 'olives') {
                              toppingMarkup = (
                                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border-2 border-stone-800 shadow-md"></div>
                              );
                            } else if (toppingId === 'jalapenos') {
                              toppingMarkup = (
                                <div className="w-4.5 h-4.5 rounded-full bg-green-700 border-2 border-green-800 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-200"></div>
                                </div>
                              );
                            } else if (toppingId === 'onions') {
                              toppingMarkup = (
                                <div className="w-6 h-3 rounded-t-full border-t-3 border-r-3 border-purple-400"></div>
                              );
                            } else if (toppingId === 'peppers') {
                              toppingMarkup = (
                                <div className="w-5 h-2 bg-green-500 rounded border border-green-600"></div>
                              );
                            } else if (toppingId === 'tomatoes') {
                              toppingMarkup = (
                                <div className="w-5.5 h-5.5 rounded-full bg-red-500 border border-red-600 flex items-center justify-center shadow-md">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-700"></div>
                                </div>
                              );
                            } else if (toppingId === 'sweet-corn') {
                              toppingMarkup = (
                                <div className="w-2 h-3.5 bg-yellow-400 rounded-full border border-yellow-500 shadow-sm"></div>
                              );
                            } else if (toppingId === 'grilled-chicken' || toppingId === 'tikka-chicken') {
                              toppingMarkup = (
                                <div className="w-5.5 h-4.5 bg-amber-700 rounded-md border border-amber-900 flex items-center justify-center shadow-sm">
                                  <div className="w-3 h-1 bg-amber-900"></div>
                                </div>
                              );
                            } else if (toppingId === 'extra-cheese') {
                              toppingMarkup = (
                                <div className="w-5 h-1.5 bg-yellow-400 rounded-full opacity-80 shadow"></div>
                              );
                            }

                            return (
                              <motion.div
                                key={`${toppingId}-${idx}`}
                                initial={{ opacity: 0, scale: 3, y: -80 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 180, damping: 15 }}
                                className="absolute"
                                style={{
                                  left: `${coord.x}%`,
                                  top: `${coord.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${coord.r}deg)`,
                                }}
                              >
                                {toppingMarkup}
                              </motion.div>
                            );
                          });
                        })}
                      </AnimatePresence>
                    </div>

                  </motion.div>

                </div>

              </motion.div>

              {/* Confetti Success Animation inside Preview */}
              <AnimatePresence>
                {showConfetti && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-pizza-navy/80 flex flex-col items-center justify-center text-white p-4 text-center z-10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 10, 0], scale: [0.8, 1.1, 1] }}
                      className="bg-pizza-gold text-stone-900 rounded-full p-3 mb-2"
                    >
                      <Sparkles size={24} />
                    </motion.div>
                    <h4 className="font-display font-bold text-lg">Sent to Kitchen!</h4>
                    <p className="text-xs text-stone-300">Added custom craft pizza to cart.</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>

            {/* Total Display */}
            <div className="w-full mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wider">Estimated Total</span>
                <span className="font-sans text-2xl font-black text-pizza-red">Rs. {calculateTotalPrice().toLocaleString()}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="bg-pizza-red text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-pizza-crimson transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} /> Add Custom Pizza
              </motion.button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-7 flex flex-col gap-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-100">
            
            {/* 1. Size Selection */}
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-pizza-red rounded-full"></span> 1. Select Crust Diameter
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['small', 'medium', 'large', 'jumbo'] as PizzaSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`p-3 rounded-xl border-2 text-left transition-all focus:outline-none cursor-pointer ${
                      size === sz
                        ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs text-stone-400 capitalize">{sz}</span>
                    <span className="block font-bold text-sm">{SIZE_LABELS[sz]}</span>
                    <span className="block text-xs font-black text-stone-500 mt-1">
                      Rs. {basePrices[sz].toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Crust Selection */}
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-pizza-red rounded-full"></span> 2. Choose Base Crust
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['classic', 'thin-crust', 'pan', 'cheese-burst'] as CrustType[]).map((crt) => (
                  <button
                    key={crt}
                    onClick={() => setCrust(crt)}
                    className={`p-3 px-4 rounded-xl border-2 flex items-center justify-between transition-all focus:outline-none cursor-pointer ${
                      crust === crt
                        ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-left">
                      <span className="block font-bold text-sm capitalize">{crt.replace('-', ' ')}</span>
                      <span className="block text-xs text-stone-500">
                        {crt === 'classic' && 'Standard hand-tossed flour'}
                        {crt === 'thin-crust' && 'Light, thin and crackling crisp'}
                        {crt === 'pan' && 'Double proofed soft bread baked in tin'}
                        {crt === 'cheese-burst' && 'Stuffed liquid gold cheddar burst'}
                      </span>
                    </div>
                    {CRUST_PREMIUMS[crt] > 0 && (
                      <span className="text-xs font-black px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                        +Rs. {CRUST_PREMIUMS[crt]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sauce & Cheese Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Sauce Selection */}
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-pizza-red rounded-full"></span> 3. Select Base Sauce
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'tomato', name: 'Zesty Marinara', desc: 'Classic Napoli red sauce' },
                    { id: 'bbq', name: 'Smoky Hickory BBQ', desc: 'Tangy and slightly sweet' },
                    { id: 'white-garlic', name: 'Creamy Garlic Alfred', desc: 'Rich, buttery white base' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSauce(s.id as any)}
                      className={`p-2.5 px-3.5 rounded-xl border-2 text-left transition-all focus:outline-none cursor-pointer ${
                        sauce === s.id
                          ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block font-bold text-sm">{s.name}</span>
                      <span className="block text-xs text-stone-500">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cheese Selection */}
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-pizza-red rounded-full"></span> 4. Cheese Options
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'regular', name: 'Standard Mozzarella', desc: 'Creamy stretchy base cheese' },
                    { id: 'double', name: 'Double Mozzarella', desc: 'Loaded cheese layer (+Rs. 180)' },
                    { id: 'vegan', name: 'Vegan Cheese Alternative', desc: 'Daiya-style dairy-free base' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setCheese(ch.id as any)}
                      className={`p-2.5 px-3.5 rounded-xl border-2 text-left transition-all focus:outline-none cursor-pointer ${
                        cheese === ch.id
                          ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block font-bold text-sm">{ch.name}</span>
                      <span className="block text-xs text-stone-500">{ch.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 4. Toppings Checklist */}
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-pizza-red rounded-full"></span> 5. Select Premium Toppings
              </h3>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">Vegetarian Toppings</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {TOPPINGS.filter((t) => t.type === 'veg').map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all focus:outline-none cursor-pointer ${
                      selectedToppings.includes(t.id)
                        ? 'border-green-600 bg-green-50 text-green-950 font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-md flex items-center justify-center border ${
                        selectedToppings.includes(t.id)
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {selectedToppings.includes(t.id) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="leading-tight">
                      <span className="block text-xs font-bold">{t.name}</span>
                      <span className="block text-[10px] text-stone-500">Rs. {t.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded">Meat Toppings</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TOPPINGS.filter((t) => t.type === 'meat').map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all focus:outline-none cursor-pointer ${
                      selectedToppings.includes(t.id)
                        ? 'border-pizza-red bg-red-50 text-pizza-red font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-md flex items-center justify-center border ${
                        selectedToppings.includes(t.id)
                          ? 'bg-pizza-red border-pizza-red text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {selectedToppings.includes(t.id) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="leading-tight">
                      <span className="block text-xs font-bold">{t.name}</span>
                      <span className="block text-[10px] text-stone-500">Rs. {t.price}</span>
                    </div>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
