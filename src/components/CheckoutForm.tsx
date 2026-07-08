import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderDetails, CartItem } from '../types';
import { SIZE_LABELS, CRUST_LABELS } from '../data/menu';
import { CreditCard, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Sparkles, AlertCircle } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  onConfirmOrder: (details: OrderDetails) => void;
  onCancel: () => void;
}

export default function CheckoutForm({ cartItems, cartTotal, onConfirmOrder, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Auto-detect card type
  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleanNum)) return 'Mastercard';
    if (/^3[47]/.test(cleanNum)) return 'Amex';
    return 'Generic';
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = val.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(val);
    }
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length >= 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    
    // Simple phone validator for Pakistan formats (e.g., 03xxxxxxxxx or +923xxxxxxxxx)
    const phoneRegex = /^((\+92)|(0092)|0)?3\d{9}$/;
    if (val && !phoneRegex.test(val)) {
      setPhoneError('Please enter a valid Pakistani mobile number (e.g., 03001234567)');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Double check phone error
    const phoneRegex = /^((\+92)|(0092)|0)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid Pakistani mobile number (e.g., 03001234567)');
      return;
    }

    onConfirmOrder({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      instructions: instructions.trim(),
      paymentMethod,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      cardExpiry: paymentMethod === 'card' ? cardExpiry : undefined,
      cardCvv: paymentMethod === 'card' ? cardCvv : undefined,
    });
  };

  const cardType = getCardType(cardNumber);

  return (
    <div className="min-h-screen bg-stone-100 pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-stone-600 hover:text-pizza-red text-sm font-bold mb-6 focus:outline-none transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Return to Menu
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-100">
            <h2 className="font-display text-2xl font-extrabold text-stone-900 mb-2 flex items-center gap-2">
              <Truck className="text-pizza-red" size={24} /> Delivery details
            </h2>
            <p className="text-stone-500 text-xs mb-8">
              Confirm your contact info and secure address. We will cook and dispatch instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-pizza-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-pizza-red">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03001234567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-stone-50 border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all ${
                      phoneError ? 'border-red-500 bg-red-50/10' : 'border-stone-200'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[10px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertCircle size={10} /> {phoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Complete Address <span className="text-pizza-red">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Street Address, Appt / House No, Area Landmark, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all resize-none"
                ></textarea>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Rider Directions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring doorbell, leave at gate, bring 500 rupees change"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all"
                />
              </div>

              {/* Payment Methods */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Payment Method
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border-2 text-left flex flex-col gap-1 cursor-pointer transition-all focus:outline-none ${
                      paymentMethod === 'cod'
                        ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-sm font-bold">🏍️ Cash on Delivery</span>
                    <span className="text-[10px] text-stone-500">Pay cash directly to Sajid at your door.</span>
                  </button>

                  {/* Simulated Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 text-left flex flex-col gap-1 cursor-pointer transition-all focus:outline-none ${
                      paymentMethod === 'card'
                        ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      <CreditCard size={14} /> Credit / Debit Card
                    </span>
                    <span className="text-[10px] text-stone-500">Simulate modern online payment.</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Simulated Card Fields */}
              <AnimatePresence>
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden flex flex-col gap-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-stone-800">Card Credentials (Simulated)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-bold">
                        Demo Mode Sandbox
                      </span>
                    </div>

                    {/* Card Number */}
                    <div className="relative">
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        maxLength={19}
                        placeholder="4123 4567 8901 2345"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-pizza-red"
                      />
                      <span className="absolute right-4 top-3 text-xs font-bold text-stone-400">
                        {cardType !== 'Generic' ? cardType : 'Card No'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Expiry */}
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-pizza-red"
                      />

                      {/* CVV */}
                      <input
                        type="password"
                        required={paymentMethod === 'card'}
                        maxLength={3}
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-pizza-red"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                className="w-full bg-pizza-red hover:bg-pizza-crimson text-white py-4.5 rounded-2xl font-black text-sm tracking-wide shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Sparkles size={16} /> Confirm & Bake My Pizza (Rs. {Math.round(cartTotal * 1.05).toLocaleString()})
              </button>

            </form>
          </div>

          {/* Right Basket Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
            <h3 className="font-display text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
              <ShoppingBag size={18} className="text-stone-500" /> Your Slices
            </h3>

            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto mb-6 pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="font-bold text-stone-800">
                      {item.pizza.name} <span className="text-pizza-red font-black">x{item.quantity}</span>
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {SIZE_LABELS[item.selectedSize]} &bull; {CRUST_LABELS[item.selectedCrust]}
                    </p>
                    {item.addedToppings.length > 0 && (
                      <p className="text-[9px] text-stone-400 mt-0.5 font-medium">
                        + Toppings: {item.addedToppings.map(id => id.replace('-', ' ')).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-stone-900 font-semibold">
                    Rs. {item.totalItemPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-stone-200">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>GST (5%)</span>
                <span className="font-mono">Rs. {Math.round(cartTotal * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-stone-100 mt-2">
                <span>Final Total</span>
                <span className="font-mono text-pizza-red">
                  Rs. {Math.round(cartTotal * 1.05).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100/80 flex gap-2.5">
              <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-green-950 leading-relaxed">
                <p className="font-bold">Authentic Freshness Promise</p>
                <p className="text-green-800 mt-0.5">
                  Our delivery rider Sajid guarantees 20-minute delivery. If your pizza crust isn't hot and steaming, your next pizza is absolutely free!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
