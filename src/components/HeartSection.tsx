import React from 'react';
import { motion } from 'motion/react';

export const HeartSection: React.FC = () => {
  return (
    <section
      id="emotional-heart-section"
      className="relative my-24 sm:my-32 w-full overflow-hidden rounded-3xl border border-[#d7b578]/20 bg-gradient-to-b from-[#1c0814] via-[#240a1a] to-[#14050f] px-6 py-20 sm:py-28 md:px-16 text-center shadow-2xl shadow-black/80"
    >
      {/* Background Soft Glows & Ambiance */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#d7b578]/8 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] rounded-full bg-[#c98893]/12 blur-[80px]" />

      {/* Delicate Decorative Top Crest */}
      <div className="mx-auto mb-10 flex items-center justify-center gap-3 opacity-60">
        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d7b578]" />
        <span className="font-serif text-sm tracking-widest text-[#d7b578] italic">from the heart</span>
        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d7b578]" />
      </div>

      <div className="mx-auto max-w-2xl relative z-10">
        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#d7b578]/80 mb-5">
          Aur shayad meri feelings ka sabse honest part ye hai ki...
        </p>

        {/* Standalone Emotional Climax Statement */}
        <motion.blockquote
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-2xl sm:text-4xl md:text-[2.65rem] font-light leading-[1.35] tracking-tight text-[#faf2e6]"
        >
          <span className="block mb-2">
            “Main tumhe apni life mein chahta hoon,
          </span>
          <span className="block italic text-[#edd2aa] drop-shadow-[0_2px_20px_rgba(215,181,120,0.25)]">
            but never at the cost of your dreams.”
          </span>
        </motion.blockquote>

        {/* Supporting Emotional Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="mt-8 space-y-2 font-serif text-base sm:text-lg font-light leading-relaxed text-[#dfd0c5] max-w-xl mx-auto"
        >
          <p>Main kabhi nahi chahta ki meri wajah se tum apni journey mein ek step bhi peeche jao.</p>
          <p className="text-[#edd2aa] italic">Tumhare dreams tumhare hain. Tumhari mehnat tumhari hai.</p>
          <p>Aur main uski respect karta hoon.</p>
        </motion.div>
      </div>

      {/* Delicate Bottom Motif */}
      <div className="mt-12 flex justify-center opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#d7b578]">
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="7" stroke="currentColor" strokeWidth="1" />
          <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1" />
          <line x1="17" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
};
