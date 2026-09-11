import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface HeroSectionProps {
  onOpenLetter: () => void;
  isOpen: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenLetter,
  isOpen,
}) => {
  const handleOpenLetter = () => {
    // Start music directly from the user's click.
    // This is more reliable on mobile browsers and Brave
    // because the audio play request happens inside a
    // genuine user interaction.
    void audioEngine.start();

    // Continue with the existing letter-opening animation.
    onOpenLetter();
  };

  return (
    <section
      id="hero-opening-screen"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 text-center select-none"
    >
      {/* Cinematic Ambient Atmosphere & Lighting */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-[#2d0d1e]/45 via-[#160611]/80 to-[#0c0409] -z-10" />

      {/* Soft Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 -z-10" />

      {/* Gentle Warm Halo in Center */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] sm:h-[580px] sm:w-[580px] rounded-full bg-[#d7b578]/5 blur-[120px] -z-10" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] sm:h-[440px] sm:w-[440px] rounded-full bg-[#c98893]/8 blur-[90px] -z-10" />

      {/* Decorative Top Flourish */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="mb-8 flex items-center justify-center gap-3"
      >
        <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#d7b578]/40"></span>

        <svg
          className="h-3.5 w-3.5 text-[#d7b578]/60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
        </svg>

        <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#d7b578]/40"></span>
      </motion.div>

      {/* Small Elegant Lead Text */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.6,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="font-sans text-xs sm:text-sm font-normal tracking-[0.2em] sm:tracking-[0.24em] text-[#d9a8a8] mb-6"
      >
        Some feelings are better written than left unsaid…
      </motion.p>

      {/* Large Elegant Serif Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2.0,
          delay: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#f9efe4] max-w-3xl leading-[1.25] sm:leading-[1.2] mb-6"
      >
        A letter I never found the courage to give you.
      </motion.h1>

      {/* Below Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{
          duration: 1.8,
          delay: 0.9,
          ease: 'easeOut',
        }}
        className="font-sans text-sm sm:text-base font-light text-[#cbb69d] tracking-wide mb-12 max-w-xl mx-auto"
      >
        No expectations. Just something I wanted you to know.
      </motion.p>

      {/* Minimal Button with Soft Glowing Hover Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.5,
          delay: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative group"
      >
        {/* Soft Gold Glow behind Button */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#d7b578]/25 via-[#c98893]/35 to-[#d7b578]/25 blur-md opacity-40 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 pointer-events-none" />

        <button
          id="open-letter-button"
          onClick={handleOpenLetter}
          className="relative flex items-center justify-center gap-3 rounded-full border border-[#e8d5b5]/40 bg-[#1e0a16]/85 px-8 py-3.5 text-sm sm:text-base font-serif tracking-wider text-[#f5ebd9] shadow-xl backdrop-blur-md transition-all duration-500 hover:border-[#e8d5b5]/80 hover:bg-[#2e0e22] hover:text-white cursor-pointer active:scale-[0.98]"
        >
          <span>Open the letter</span>

          <span
            className="text-[#e297a3] transition-transform duration-500 group-hover:scale-125 text-base"
            aria-hidden="true"
          >
            ♡
          </span>
        </button>
      </motion.div>

      {/* Subtle Scroll Hint if already opened */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute bottom-8 flex flex-col items-center gap-1.5 text-xs font-sans tracking-widest text-[#d5c3ba]/60 cursor-pointer"
          onClick={onOpenLetter}
        >
          <span>SCROLL DOWN</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      )}
    </section>
  );
};
