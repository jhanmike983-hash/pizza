import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { SIZE_LABELS, CRUST_LABELS } from '../data/menu';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  cartTotal: number;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  cartTotal,
  onCheckout
}: CartDrawerProps) {
  
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950 z-45"
          />

          {/* Slider Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full border-l border-stone-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pizza-red/5 text-pizza-red rounded-xl">
                  <ShoppingBag size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-stone-900">Your Basket</h3>
                  <span className="text-xs text-stone-500 font-semibold">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-55 rounded-full transition-all focus:outline-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <span className="text-5xl mb-3 block">🍕</span>
                  <h4 className="font-display font-bold text-stone-900 text-lg">Your basket is empty</h4>
                  <p className="text-stone-500 text-xs mt-1.5 max-w-xs leading-normal">
                    Browse our signature wood-fired pizzas or customize your own slice to load up your order!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-5 py-2.5 bg-stone-950 hover:bg-pizza-red text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-stone-50 border border-stone-200/50 rounded-2xl flex gap-4 relative group"
                  >
                    {/* Pizza Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                      <img
                        src={item.pizza.image}
                        alt={item.pizza.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-black text-sm text-stone-900 truncate">
                          {item.pizza.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-pizza-red transition-colors p-0.5 rounded cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {SIZE_LABELS[item.selectedSize]} &bull; {CRUST_LABELS[item.selectedCrust]}
                      </p>

                      {item.addedToppings.length > 0 && (
                        <p className="text-[10px] text-stone-400 font-semibold mt-1">
                          + {item.addedToppings.map(id => id.replace('-', ' ')).join(', ')}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-stone-200/40">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-1.5 text-stone-500 hover:bg-stone-50 transition-colors focus:outline-none cursor-pointer"
                          >
                            <Minus size={11} strokeWidth={2.5} />
                          </button>
                          <span className="px-2.5 font-mono text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-1.5 text-stone-500 hover:bg-stone-50 transition-colors focus:outline-none cursor-pointer"
                          >
                            <Plus size={11} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-mono text-sm font-bold text-stone-950">
                          Rs. {item.totalItemPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-2.5 mb-5">
                  <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-mono">Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>Delivery Charge</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>Estimated GST (5%)</span>
                    <span className="font-mono">Rs. {Math.round(cartTotal * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-stone-950 pt-3 border-t border-stone-100 mt-1">
                    <span>Total Cost</span>
                    <span className="font-mono text-pizza-red">
                      Rs. {Math.round(cartTotal * 1.05).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger button */}
                <button
                  onClick={onCheckout}
                  className="w-full bg-pizza-red hover:bg-pizza-crimson text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-medium text-center mt-3">
                  <ShieldCheck size={12} className="text-green-600" /> Secure, swift delivery in 20 minutes.
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
