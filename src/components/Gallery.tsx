import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, ZoomIn, Camera } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80',
    title: 'Gourmet Pizza Prep',
    desc: 'Our chefs layer fresh tomatoes and handmade mozzarella cheese onto freshly rolled sourdough base.',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    title: 'Wood-Fired Oven Craft',
    desc: 'Each pizza is baked inside our state-of-the-art brick ovens firing at 450 degrees Celsius for that unique smokey char.',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    title: 'Fresh Quality Ingredients',
    desc: 'Sourcing organic bell peppers, red onions, mushrooms, olives and locally grown fresh basil leaves.',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    title: 'Artisanal Slicing and Spicing',
    desc: 'Cutting the perfectly baked crisp crust and dressing it with fresh chili flakes, herbs, and oils.',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80',
    title: 'Cheesy Slices Pulled Hot',
    desc: 'A gorgeous view of the hot mozzarella cheese stretch directly after getting pulled from the baking stone.',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=800&q=80',
    title: 'Master Chef Dedication',
    desc: 'Attention to detail is our recipe. From proper dough fermentation to the exact baking time.',
  }
];

export default function Gallery() {
  const [activeImageId, setActiveImageId] = useState<number | null>(null);

  const activeImage = GALLERY_IMAGES.find((img) => img.id === activeImageId);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Camera size={12} /> Culinary Snapshots
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight"
          >
            Kitchen & Craft Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 mt-3 text-lg"
          >
            A sneak peek inside our ovens. Observe how we prepare your favorite wood-fired pizzas with premium fresh ingredients.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveImageId(img.id)}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer bg-stone-100"
            >
              <img
                src={img.url}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <motion.div
                  initial={{ y: 15 }}
                  whileInView={{ y: 0 }}
                  className="text-white"
                >
                  <div className="w-10 h-10 rounded-full bg-pizza-red flex items-center justify-center mb-3 text-white shadow-lg">
                    <Eye size={18} />
                  </div>
                  <h3 className="font-display text-lg font-black">{img.title}</h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">{img.desc}</p>
                </motion.div>
              </div>

              {/* Decorative Zoom Indicator */}
              <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <ZoomIn size={16} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageId && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center p-4 sm:p-10"
          >
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setActiveImageId(null)}></div>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImageId(null)}
                className="absolute top-4 right-4 p-2.5 bg-stone-950/80 text-white hover:bg-pizza-red rounded-full shadow-lg transition-colors z-20 focus:outline-none cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Image side */}
              <div className="w-full md:w-3/5 h-64 sm:h-96 md:h-110">
                <img
                  src={activeImage.url}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detail side */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-center bg-white">
                <span className="text-xs font-bold text-pizza-red uppercase tracking-wider mb-2">Wood-Fired Spotlight</span>
                <h3 className="font-display text-2xl font-black text-stone-900 leading-tight mb-4">
                  {activeImage.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {activeImage.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-extrabold text-sm">
                    450°
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-stone-800">Stone Baked Crust</p>
                    <p className="text-stone-500">Always prepared from scratch</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
