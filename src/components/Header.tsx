import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pizza as PizzaIcon, ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onCartOpen: () => void;
}

export default function Header({ cartCount, cartTotal, onCartOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section on scroll
      const sections = ['home', 'menu', 'custom-pizza', 'gallery', 'reviews'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'custom-pizza', label: 'Custom Pizza' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-100 py-3'
            : 'bg-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`p-2 rounded-full ${isScrolled ? 'bg-pizza-red text-white' : 'bg-white text-pizza-red shadow-lg'}`}
            >
              <PizzaIcon size={24} className="stroke-[2.5]" />
            </motion.div>
            <span
              className={`font-display text-2xl font-black tracking-tight ${
                isScrolled ? 'text-stone-950' : 'text-white drop-shadow-sm'
              }`}
            >
              The Pizza<span className="text-pizza-red"> Oven</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`font-sans text-sm font-semibold transition-all duration-200 relative py-1 focus:outline-none cursor-pointer ${
                      activeSection === item.id
                        ? 'text-pizza-red font-bold'
                        : isScrolled
                        ? 'text-stone-600 hover:text-pizza-red'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pizza-red"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Shopping Cart button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold transition-all duration-300 focus:outline-none relative shadow-md hover:shadow-lg cursor-pointer ${
                isScrolled
                  ? 'bg-pizza-red text-white hover:bg-pizza-crimson'
                  : 'bg-white text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag size={18} />
              <span className="text-sm hidden sm:inline">Rs. {cartTotal.toLocaleString()}</span>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-pizza-gold text-stone-950 flex items-center justify-center text-xs font-black shadow-md border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </nav>

          {/* Mobile Toolbar */}
          <div className="flex md:hidden items-center gap-4">
            {/* Shopping Cart button for mobile */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCartOpen}
              className={`p-2.5 rounded-full transition-all duration-300 relative focus:outline-none shadow-sm ${
                isScrolled ? 'bg-pizza-red text-white' : 'bg-white text-stone-950'
              }`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 rounded-full bg-pizza-gold text-stone-950 flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none ${
                isScrolled ? 'text-stone-900 hover:bg-stone-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[58px] left-0 w-full bg-white border-b border-stone-200 shadow-xl z-35 py-4 px-6 md:hidden flex flex-col gap-4"
          >
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none ${
                      activeSection === item.id
                        ? 'bg-stone-100 text-pizza-red font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onCartOpen();
              }}
              className="w-full flex items-center justify-center gap-2 bg-pizza-red text-white py-3 rounded-xl font-bold hover:bg-pizza-crimson transition-colors shadow-md"
            >
              <ShoppingBag size={18} />
              <span>Cart &bull; Rs. {cartTotal.toLocaleString()}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
