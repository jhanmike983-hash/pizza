import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/menu';
import { Star, MessageSquare, PenTool, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setComment('');
    setRating(5);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section id="reviews" className="py-20 bg-stone-50 border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
          >
            <MessageSquare size={12} /> True Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight"
          >
            What Pizza Lovers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 mt-3 text-lg"
          >
            Don't just take our word for it. Hear from hundreds of foodies who enjoy our hot and crispy wood-fired bakes daily.
          </motion.p>
        </div>

        {/* Content Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reviews List Feed (8 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Sparkles className="text-pizza-gold" size={18} /> Verified Feed ({reviews.length})
            </h3>

            <div className="flex flex-col gap-4 max-h-[580px] overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {reviews.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                    className="p-6 bg-white rounded-2xl border border-stone-200/60 shadow-sm relative overflow-hidden"
                  >
                    {/* Glowing Accent */}
                    {r.rating === 5 && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-pizza-gold"></div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display font-black text-stone-900 flex items-center gap-1.5">
                          {r.name}
                          <ShieldCheck size={14} className="text-blue-500 fill-blue-50" />
                        </h4>
                        <div className="flex items-center gap-1 mt-1 text-pizza-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < r.rating ? 'fill-pizza-gold text-pizza-gold' : 'text-stone-200'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                        <Calendar size={12} /> {r.date}
                      </span>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed italic">
                      "{r.comment}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Review Submission Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl shadow-md lg:sticky lg:top-24">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
              <PenTool className="text-pizza-red" size={18} /> Share Your Experience
            </h3>
            <p className="text-stone-500 text-xs mb-6">
              Your feedback fuels our wood-fired oven! Tell us what you loved about our slices.
            </p>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 text-green-950 p-6 rounded-2xl border border-green-200 text-center flex flex-col items-center justify-center h-60"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mb-3 shadow-md"
                  >
                    <Star size={20} className="fill-white" />
                  </motion.div>
                  <h4 className="font-display font-black text-lg">Shukriya!</h4>
                  <p className="text-xs text-green-800 mt-1 max-w-xs">
                    Your rating was posted successfully and is now live on our official menu feed.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Rating Stars Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              star <= (hoverRating ?? rating)
                                ? 'fill-pizza-gold text-pizza-gold drop-shadow-sm'
                                : 'text-stone-300 hover:text-stone-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all"
                    />
                  </div>

                  {/* Comments textarea */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Your Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What was your favorite pizza? How was the crust, baking, and delivery?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-pizza-red/20 focus:border-pizza-red transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-pizza-red hover:bg-pizza-crimson text-white font-bold rounded-xl text-sm transition-all focus:outline-none shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
