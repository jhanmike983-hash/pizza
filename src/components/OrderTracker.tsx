import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderDetails, CartItem } from '../types';
import { SIZE_LABELS, CRUST_LABELS } from '../data/menu';
import { 
  CheckCircle2, Flame, Bike, Check, Phone, MessageSquare, Send, 
  MapPin, Clipboard, Navigation, Smile, X, Timer, ChevronRight 
} from 'lucide-react';

interface OrderTrackerProps {
  orderDetails: OrderDetails;
  cartItems: CartItem[];
  cartTotal: number;
  onResetOrder: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'driver' | 'user';
  text: string;
  time: string;
}

export default function OrderTracker({ orderDetails, cartItems, cartTotal, onResetOrder }: OrderTrackerProps) {
  const [currentStage, setCurrentStage] = useState(0); // 0 to 4
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: `Assalam-o-Alaikum! My name is Sajid. I'm assigned to deliver your hot wood-fired pizza. I will chat here if I need address help.`,
      time: 'Just now'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  // Stage simulation speed configuration: 
  // Let's do 12 seconds per stage so it fully cycles in ~1 minute for demo purposes, with visual countdown ticking
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < 4) {
          // Add automated contextual messages when stages update
          const stageNotes = [
            `I have arrived at the Pizza Oven kitchen. Your order is confirmed and they are hand-rolling the dough!`,
            `Your pizza is loaded with cheese and toppings and has been slid onto the stone baking deck! It smells incredible.`,
            `The pizza is freshly boxed and packed with your tissues and condiments. Loading it onto the delivery bike now!`,
            `Bhai, I'm just 2 minutes away from your address! Please keep your phone active.`
          ];
          
          setTimeout(() => {
            setChatMessages((prevMsg) => [
              ...prevMsg,
              {
                id: `driver-auto-${Date.now()}`,
                sender: 'driver',
                text: stageNotes[prev],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }, 1000);

          return prev + 1;
        }
        return prev;
      });
    }, 15000); // 15 seconds per stage

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const stages = [
    { label: 'Confirmed', desc: 'Order received & confirmed', icon: Clipboard, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { label: 'Preparing', desc: 'Hand-rolling and layering toppings', icon: Smile, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { label: 'Baking', desc: 'Wood-fired brick oven sizzle', icon: Flame, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { label: 'Delivering', desc: 'Sajid is racing on his scooter', icon: Bike, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { label: 'Arrived', desc: 'Fresh & hot at your doorstep', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
  ];

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const inputToMatch = chatInput.toLowerCase();
    setChatInput('');

    // Responsive mock replies from Sajid
    setTimeout(() => {
      let driverReply = `Jee bilkul bhai, noted! I will make sure the kitchen handles this.`;
      
      if (inputToMatch.includes('kahan') || inputToMatch.includes('where') || inputToMatch.includes('time')) {
        if (currentStage < 3) {
          driverReply = `The pizza is still baking in the brick oven. I will pick it up and drive as fast as a rocket soon!`;
        } else if (currentStage === 3) {
          driverReply = `I am on my way on the main road. Traffic is a bit slow near the bridge but I am navigating quickly!`;
        } else {
          driverReply = `I have entered your street! Looking for house number.`;
        }
      } else if (inputToMatch.includes('garam') || inputToMatch.includes('hot')) {
        driverReply = `Absolutely! I have the pizza sealed inside our heat-retention insulated thermal delivery bag. It will feel oven-fresh.`;
      } else if (inputToMatch.includes('sauce') || inputToMatch.includes('garlic') || inputToMatch.includes('dip')) {
        driverReply = `Zaroor bhai! I checked and placed 2 extra garlic mayo dips and oregano packets inside your carton.`;
      } else if (inputToMatch.includes('change') || inputToMatch.includes('address') || inputToMatch.includes('address')) {
        driverReply = `Noted bhai! I am reading the address coordinates. Keep your mobile nearby so I can ring you once I arrive.`;
      } else if (inputToMatch.includes('shukriya') || inputToMatch.includes('thanks') || inputToMatch.includes('thank')) {
        driverReply = `You are very welcome! It is my pleasure. Enjoy your meal!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `driver-reply-${Date.now()}`,
          sender: 'driver',
          text: driverReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 15000); // 1.5 seconds response lag for natural conversation feel
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Tracker Splash Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-stone-200/80 shadow-lg overflow-hidden mb-8"
        >
          {/* Header Banner */}
          <div className="bg-pizza-navy text-white px-6 sm:px-8 py-8 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pizza-red/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-pizza-gold uppercase tracking-wider block mb-1">Live Order Status</span>
                <h2 className="font-display text-2xl sm:text-3xl font-black">
                  Tracker ID: <span className="font-mono text-pizza-gold">#PO-{Math.floor(1000 + Math.random() * 9000)}</span>
                </h2>
                <p className="text-xs text-stone-300 mt-1">
                  Deliver to: <span className="font-bold text-white">{orderDetails.name}</span> &bull; {orderDetails.address}
                </p>
              </div>

              {/* Live Countdown Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:px-5 flex items-center gap-3 border border-white/10 self-start sm:self-center">
                <div className="p-2 rounded-xl bg-pizza-gold text-stone-900 animate-pulse">
                  <Timer size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-stone-300 uppercase font-bold block">Estimated Arrival</span>
                  <span className="font-mono text-xl font-bold tracking-tight text-white">
                    {currentStage === 4 ? 'ARRIVED!' : `${formatTime(timeLeft)} min`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Horizontal Progress Timeline */}
            <div className="relative mb-12 mt-4 px-2">
              {/* Backing Bar */}
              <div className="absolute top-5.5 left-6 right-6 h-1 bg-stone-200 rounded-full -z-10"></div>
              
              {/* Active Progress Bar */}
              <motion.div
                className="absolute top-5.5 left-6 h-1 bg-pizza-red rounded-full -z-10"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStage / 4) * 94}%` }}
                transition={{ duration: 0.8 }}
              ></motion.div>

              <div className="flex justify-between items-start">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = idx <= currentStage;
                  const isCurrent = idx === currentStage;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center max-w-[120px] relative">
                      {/* Round Marker */}
                      <motion.div
                        animate={{
                          scale: isCurrent ? [1, 1.15, 1] : 1,
                        }}
                        transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                          isCurrent
                            ? 'bg-pizza-red border-pizza-red text-white shadow-md shadow-pizza-red/20'
                            : isActive
                            ? 'bg-green-600 border-green-600 text-white shadow-sm'
                            : 'bg-stone-100 border-stone-200 text-stone-400'
                        }`}
                      >
                        {isActive && idx < currentStage ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <Icon size={18} />
                        )}
                      </motion.div>

                      {/* Text details */}
                      <span
                        className={`font-display text-xs font-extrabold mt-3 block ${
                          isCurrent ? 'text-pizza-red' : isActive ? 'text-stone-800 font-semibold' : 'text-stone-400'
                        }`}
                      >
                        {stage.label}
                      </span>
                      <span className="text-[9px] text-stone-400 leading-tight mt-0.5 hidden sm:block">
                        {stage.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Interactive Stage Illustrations */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200/50 p-6 flex flex-col items-center justify-center text-center overflow-hidden h-52 relative">
              
              {/* Stage 0: Placed / Confirmed */}
              {currentStage === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3"
                  >
                    <Clipboard size={32} />
                  </motion.div>
                  <h4 className="font-display font-black text-lg text-stone-900">Order Confirmed!</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1">
                    The restaurant is reviewing your instructions and prepping the wood fire. Slicing starts in a moment!
                  </p>
                </motion.div>
              )}

              {/* Stage 1: Prep */}
              {currentStage === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex gap-2 mb-3 relative">
                    <motion.div
                      animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-extrabold text-sm"
                    >
                      🧑‍🍳
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-xl shadow"
                    >
                      🍕
                    </motion.div>
                  </div>
                  <h4 className="font-display font-black text-lg text-stone-900">Prepping & Layering</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1">
                    Your pizza is being rolled from freshly fermented dough, sauced with Napoli marinara, and loaded with fresh cheese and toppings.
                  </p>
                </motion.div>
              )}

              {/* Stage 2: Baking */}
              {currentStage === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3 flex items-center justify-center w-16 h-16">
                    {/* Fire backdrop */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 bg-orange-500/20 rounded-full blur-md"
                    ></motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                      className="text-orange-500 z-10"
                    >
                      <Flame size={44} className="fill-orange-50" />
                    </motion.div>
                  </div>
                  <h4 className="font-display font-black text-lg text-stone-900">Stone Oven Baking</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1">
                    Sizzling inside our classic wood-fired brick dome. High temperature stone baking ensures that smoky taste and bubbly cheese crust!
                  </p>
                </motion.div>
              )}

              {/* Stage 3: Delivering */}
              {currentStage === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Moving Scooter Track */}
                  <div className="w-full max-w-xs relative h-10 mb-2 overflow-hidden border-b border-stone-200/50">
                    <motion.div
                      animate={{ x: ['-20%', '110%'] }}
                      transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                      className="absolute bottom-1 text-pizza-red flex items-center gap-1"
                    >
                      <Bike size={24} className="fill-pizza-red/10" />
                      <div className="w-1.5 h-1 bg-stone-400 rounded-full animate-bounce"></div>
                    </motion.div>
                  </div>
                  <h4 className="font-display font-black text-lg text-stone-900">Sajid is on his Way!</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1">
                    Your pizza is tucked safely inside our special insulated thermal delivery bag, speeding towards your address right now.
                  </p>
                </motion.div>
              )}

              {/* Stage 4: Arrived */}
              {currentStage === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 1, type: 'spring' }}
                    className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 shadow-inner"
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h4 className="font-display font-black text-lg text-green-950">Arrived & Delivered!</h4>
                  <p className="text-stone-600 text-xs max-w-sm mt-1">
                    Sajid has reached! Your hot, wood-fired pizza has been delivered. Thank you (Shukriya) for ordering with us. Enjoy every slice!
                  </p>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>

        {/* Details & Driver Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Order Details list (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
            <h3 className="font-display text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Clipboard size={18} className="text-stone-500" /> Order Summary
            </h3>
            
            <div className="flex flex-col gap-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm pb-3 border-b border-stone-50">
                  <div>
                    <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                      {item.pizza.name}
                      <span className="text-xs font-black text-pizza-red px-1.5 py-0.5 bg-red-50 rounded">
                        x{item.quantity}
                      </span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {SIZE_LABELS[item.selectedSize]} &bull; {CRUST_LABELS[item.selectedCrust]}
                    </p>
                    {item.addedToppings.length > 0 && (
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                        + Toppings: {item.addedToppings.map(id => id.replace('-', ' ')).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-stone-900">
                    Rs. {item.totalItemPrice.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Standard Delivery Charge</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>GST Taxes (5%)</span>
                  <span className="font-mono">Rs. {Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-dashed border-stone-200">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-pizza-red">
                    Rs. {Math.round(cartTotal * 1.05).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/50 flex gap-3">
                <MapPin size={18} className="text-pizza-red shrink-0 mt-0.5" />
                <div className="text-xs leading-tight">
                  <p className="font-bold text-stone-800">Delivery Location</p>
                  <p className="text-stone-500 mt-1">{orderDetails.address}</p>
                  <p className="text-stone-400 mt-1 font-mono">{orderDetails.phone}</p>
                </div>
              </div>

              {currentStage === 4 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onResetOrder}
                  className="w-full py-4 bg-pizza-navy text-white font-black rounded-2xl hover:bg-stone-900 transition-colors shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Order Another Pizza <ChevronRight size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Simulated Driver Chat Drawer (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden">
            {/* Driver card header */}
            <div className="bg-stone-100 p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-pizza-navy text-white rounded-full flex items-center justify-center text-lg font-black">
                    🏍️
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-stone-900">Sajid (Rider)</h4>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                    Online &bull; Active Order
                  </span>
                </div>
              </div>
              
              <a
                href={`tel:${orderDetails.phone}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Connecting you to Sajid's phone via simulated call: +92 300 1234567. He says: "Bhai bas pohnch gya hun, 2 minute dein!"`);
                }}
                className="p-2.5 bg-white border border-stone-200 rounded-full text-pizza-navy hover:text-pizza-red hover:border-pizza-red transition-all shadow-sm focus:outline-none"
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Chat Body */}
            <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3 bg-stone-50/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-pizza-red text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-1 font-mono px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask Sajid: e.g. Extra sauce?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-pizza-red focus:border-pizza-red"
              />
              <button
                type="submit"
                className="p-2.5 bg-pizza-red text-white hover:bg-pizza-crimson rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
