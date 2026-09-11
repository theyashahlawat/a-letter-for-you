import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface FinalSectionProps {
  whatsappNumber?: string;
  onOpenSettings?: () => void;
}

export const FinalSection: React.FC<FinalSectionProps> = ({
  whatsappNumber = '917618496942',
  onOpenSettings,
}) => {
  // Construct direct 1-to-1 WhatsApp chat URL:
  // With international format (917618496942), WhatsApp opens your direct private chat
  // directly without asking her to forward to contacts, even if your number is not saved in her phone.
  const formatNumber = (num?: string): string => {
    const raw = num ? num.replace(/[^0-9]/g, '') : '';
    if (!raw) return '917618496942';
    if (raw.length === 10) return '91' + raw;
    return raw;
  };

  const targetNumber = formatNumber(whatsappNumber);
  const encodedText = encodeURIComponent('Hey, I read your letter 🙂');
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedText}`;

  return (
    <footer
      id="final-closing-section"
      className="relative mx-auto mt-24 sm:mt-32 w-full max-w-2xl px-6 pb-28 pt-10 text-center text-[#f2e7dc]"
    >
      {/* 11. Final Section - Quiet Transition */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.6 }}
          className="space-y-3 font-serif text-lg sm:text-xl font-light text-[#ded0c7]"
        >
          <p className="text-[#ecdcd3] italic">
            “No expectations, no pressure. Just honest thoughts from my heart.”
          </p>
        </motion.div>

        {/* Delicate Pause Divider */}
        <div className="mx-auto flex w-16 items-center justify-center gap-1.5 opacity-30 py-2">
          <span className="h-[1px] w-full bg-[#d7b578]" />
          <span className="h-1 w-1 rounded-full bg-[#d7b578]" />
          <span className="h-[1px] w-full bg-[#d7b578]" />
        </div>
      </div>

      {/* 12. WhatsApp Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.6, delay: 0.4 }}
        className="mt-24 sm:mt-32 rounded-2xl border border-[#d7b578]/20 bg-gradient-to-b from-[#1b0814]/70 to-[#12050e]/90 p-8 sm:p-12 shadow-xl shadow-black/60 backdrop-blur-sm"
      >
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#f7ede2] mb-3">
          If you ever feel like talking...
        </h3>

        <p className="font-sans text-xs sm:text-sm font-light text-[#b8a49c] tracking-wide max-w-md mx-auto mb-8 leading-relaxed">
          Only if you genuinely want to.<br />
          <span className="text-[#d7b578]/90 font-medium">No pressure, ever.</span>
        </p>

        {/* Button: "Talk to me  ♡" - Opens WhatsApp */}
        <div className="relative inline-block group">
          {/* Subtle gold glow */}
          <div className="absolute -inset-1 rounded-full bg-[#d7b578]/20 blur-md opacity-30 group-hover:opacity-75 transition-all duration-500 pointer-events-none" />

          <a
            id="whatsapp-contact-button"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2.5 rounded-full border border-[#d7b578]/50 bg-[#280d1e] px-8 py-3.5 font-serif text-base sm:text-lg tracking-wider text-[#faefe2] shadow-lg transition-all duration-300 hover:border-[#d7b578] hover:bg-[#361129] hover:shadow-[0_0_25px_rgba(215,181,120,0.25)] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b578]" />
            <span>Talk to me</span>
            <span className="text-[#e297a3] font-serif text-lg" aria-hidden="true">
              ♡
            </span>
          </a>
        </div>
      </motion.div>

      {/* 13. Ending - Generous Whitespace */}
      <div className="mt-32 sm:mt-44 mb-16 space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="font-handwriting text-3xl sm:text-4xl text-[#edd2aa] select-none"
        >
          That’s all I wanted to say.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.8, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="text-lg text-[#c98893] select-none"
          aria-hidden="true"
        >
          ♡
        </motion.div>
      </div>

      {/* Subtle Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2 }}
        className="border-t border-[#d7b578]/10 pt-10 text-center font-sans text-xs tracking-widest text-[#9d8a83]"
      >
        <p className="italic font-serif text-sm text-[#b8a69d]">
          “Some things are better said, even if they’re said quietly.”
        </p>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="mt-6 font-sans text-[11px] text-[#6d5e5b] hover:text-[#bca49b] transition-colors duration-300 underline underline-offset-4 opacity-50 hover:opacity-100 cursor-pointer"
          >
            Configure message details
          </button>
        )}
      </motion.div>
    </footer>
  );
};
