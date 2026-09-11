import React from 'react';
import { motion } from 'motion/react';
import { HeartSection } from './HeartSection';

interface LetterSectionProps {
  recipientName?: string;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ recipientName = 'Bhumi' }) => {
  return (
    <article
      id="main-letter-container"
      className="relative mx-auto w-full max-w-2xl sm:max-w-3xl px-4 sm:px-6 py-6"
    >
      {/* Physical Letter Container with Luxury Rag Paper Aesthetic */}
      <div className="paper-texture relative rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-18 text-[#221619] transition-all duration-700 shadow-2xl">
        
        {/* Subtle Deckled Edge & Gold Foil Inset Line */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 rounded-xl sm:rounded-2xl border border-[#d7b578]/25" />

        {/* Delicate Corner Accents */}
        <div className="pointer-events-none absolute top-6 left-6 h-3 w-3 border-t border-l border-[#d7b578]/50" />
        <div className="pointer-events-none absolute top-6 right-6 h-3 w-3 border-t border-r border-[#d7b578]/50" />
        <div className="pointer-events-none absolute bottom-6 left-6 h-3 w-3 border-b border-l border-[#d7b578]/50" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-3 w-3 border-b border-r border-[#d7b578]/50" />

        {/* Letter Header / Salutation */}
        <div className="mb-12 sm:mb-16 text-center">
          {/* Subtle Monogram / Wax Seal Motif */}
          <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b578]/40 bg-[#f4ece1] text-[#9b3a4a] shadow-inner">
            <span className="font-serif text-sm italic font-semibold">✦</span>
          </div>

          <p className="font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.24em] text-[#8c746e]">
            A Personal Letter
          </p>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-normal text-[#2a171c] italic">
            For {recipientName}
          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2 opacity-50">
            <span className="h-[1px] w-12 bg-[#c9a664]" />
            <span className="h-1 w-1 rotate-45 bg-[#c9a664]" />
            <span className="h-[1px] w-12 bg-[#c9a664]" />
          </div>
        </div>

        {/* Letter Body - Exact Word-for-Word Text with Emotional Visual Craft */}
        <div className="space-y-10 sm:space-y-12 font-serif text-lg sm:text-xl md:text-[1.32rem] leading-[1.8] sm:leading-[1.9] text-[#332225] font-light">
          
          {/* 1. Opening Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="border-b border-[#d7b578]/25 pb-6 text-center sm:text-left"
          >
            <h3 className="font-serif text-2xl sm:text-3xl italic text-[#2c1219] font-normal">
              Ek baat jo tumhe kabhi bata nahi paaya...
            </h3>
          </motion.div>

          {/* 2. Introductory thoughts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-5"
          >
            <p>
              Mujhe nahi pata ye letter tum tak kaise pahunch raha hai, aur jab tum ise padhogi to tumhare mind mein kya chalega.
            </p>
            <p className="text-[#4a3438] italic">
              Bas itna chahta hoon ki ise kisi pressure ya expectation ki tarah mat lena.
            </p>
            <p>
              Main bas ek baat kehna chahta hoon jo shayad main kabhi saamne nahi keh paaya.
            </p>
          </motion.div>

          {/* 3. Career & Admiration */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p>
              Hum dono apni life ke us phase mein hain jahan hum apna-apna career banane ke liye bahut mehnat kar rahe hain.
            </p>
            <p>
              Tum apne dreams ke liye mehnat kar rahi ho, aur main apne.
            </p>
            <p className="text-[#4a3438]">
              Aur honestly, mujhe tumhari ye dedication achhi lagti hai. Shayad tumhe pata bhi nahi hai ki main tumhari is cheez ko kitna admire karta hoon.
            </p>
          </motion.div>

          {/* 4. Distraction & Library Situation Quote block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="my-8 rounded-xl border-l-2 border-[#b84d64]/60 bg-[#f4ebdf]/75 px-6 py-5 sm:px-8 sm:py-6"
          >
            <p className="font-serif text-xl sm:text-2xl italic text-[#221016] leading-relaxed">
              “Shayad isi wajah se main kabhi tumhari life mein apne aap ko distraction nahi banana chahta tha.”
            </p>
          </motion.div>

          {/* 5. Wanting to talk / Care */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p>
              Main tumse baat karna chahta tha...
            </p>
            <p className="font-normal italic text-[#722b3c] text-xl sm:text-2xl">
              Bahut baar.
            </p>
            <p className="text-[#4a3438]">
              Lekin mere mind mein hamesha ye tha ki kahin meri wajah se tumhari padhai ya tumhara career disturb na ho jaye. Main nahi chahta tha ki meri wajah se tum apne goals se distract ho.
            </p>
          </motion.div>

          {/* 6. Library situation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p>
              Aur library ki situation ki wajah se bhi main aur zyada careful raha.
            </p>
            <p className="text-[#4a3438]">
              Main nahi chahta tha ki humari kisi baat ki wajah se tum uncomfortable feel karo, tumhara naam kisi discussion mein aaye, ya tumhe kisi unnecessary situation ka saamna karna pade.
            </p>
            <p>
              Isliye shayad main bahut kuch kehna chahte hue bhi chup raha.
            </p>
          </motion.div>

          {/* 7. Hesitation & Silent Observation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-3 pl-4 sm:pl-6 border-l border-[#d7b578]/40 italic text-[#3c252a]"
          >
            <p>Kabhi-kabhi tumse baat karne ka mann hua, lekin maine khud ko rok liya.</p>
            <p>Kabhi tum saamne hoti thi aur bahut kuch kehne ka mann hota tha, lekin main bas normal rehne ki koshish karta tha.</p>
          </motion.div>

          {/* 8. Farq padta tha */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="my-10 space-y-3"
          >
            <p>
              Shayad tumhe laga ho ki mujhe koi farq nahi padta.
            </p>
            <p className="text-[#4a3438]">
              Lekin sach iska bilkul opposite tha.
            </p>
            
            <div className="py-4 text-center sm:text-left">
              <span className="inline-block font-serif text-2xl sm:text-3xl font-semibold text-[#8c2a3e] border-b border-[#8c2a3e]/30 pb-1">
                Mujhe farq padta tha.
              </span>
              <span className="block font-serif text-xl sm:text-2xl italic text-[#4a1d27] mt-1">
                Bahut.
              </span>
            </div>
          </motion.div>

          {/* 9. Tum mere liye special ho gayi */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p>
              Pata nahi exactly kab aur kaise...
            </p>
            <p className="text-xl sm:text-2xl font-normal text-[#270f15] italic">
              Lekin tum mere liye special ho gayi.
            </p>
            <p className="text-[#4a3438]">
              Tumhari chhoti-chhoti baatein, tumse hui woh normal si conversations, tumhara aas-paas hona...
            </p>
            <p className="text-[#554044] italic">
              shayad tumhare liye ye sab ordinary moments honge.
            </p>
            <p className="font-medium text-[#200f14]">
              Lekin mere liye nahi.
            </p>
          </motion.div>

          {/* 10. Sach kahun... Mujhe tum pasand ho (Special Emotional Reveal) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="my-16 sm:my-20 text-center"
          >
            <p className="font-sans text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-[#9e4659] mb-4">
              Sach kahun...
            </p>

            <div className="py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="relative inline-block"
              >
                <span className="absolute -inset-x-6 -inset-y-3 bg-[#f3e1d6]/70 -skew-y-1 rounded-xl -z-10 shadow-sm" />
                <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#2b0f19] tracking-tight">
                  Mujhe tum pasand ho.
                </h3>
                <p className="font-serif text-2xl sm:text-3xl italic text-[#8c2a3e] mt-3">
                  Really.
                </p>
              </motion.div>
            </div>

            <p className="font-sans text-xs text-[#8a7276] italic mt-2 tracking-wider">
              Aur ye koi ek din ka feeling nahi hai.
            </p>
          </motion.div>

          {/* 11. Care & Well-wishes */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p className="font-normal text-xl sm:text-2xl text-[#241016]">
              Main tumhari fikar karta hoon.
            </p>
            <p className="text-[#4a3438]">
              Tum khush raho, apne dreams achieve karo, apne career mein bahut aage jao — ye sab main genuinely chahta hoon.
            </p>
          </motion.div>

        </div>

        {/* 12. SECTION 10: Centerpiece (I want you in my life, but never at the cost of your dreams) */}
        <HeartSection />

        {/* 13. Second Half of the Letter */}
        <div className="space-y-10 sm:space-y-12 font-serif text-lg sm:text-xl md:text-[1.32rem] leading-[1.8] sm:leading-[1.9] text-[#332225] font-light">
          
          {/* Life directions & Possible separation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4 pt-6"
          >
            <p>
              Kabhi-kabhi main sochta hoon ki shayad life hum dono ko alag-alag directions mein le jaaye.
            </p>
            <p>
              Ho sakta hai kal mujhe apne career ke liye yahan se kahin aur jaana pade.
            </p>
            <p>
              Ho sakta hai main yahan na rahun.
            </p>
            <div className="space-y-1 pl-4 sm:pl-6 border-l border-[#b84d64]/40 italic text-[#4a2e34]">
              <p>Ho sakta hai humari phir kabhi mulaqat ho...</p>
              <p>ya shayad na ho.</p>
            </div>
            <p className="pt-2">
              Aur isi thought ne mujhe ye letter likhne par majboor kiya.
            </p>
          </motion.div>

          {/* Regret Quote Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="my-8 rounded-xl border-l-2 border-[#b84d64]/60 bg-[#f4ebdf]/75 px-6 py-5 sm:px-8 sm:py-6"
          >
            <p className="text-sm font-sans uppercase tracking-widest text-[#9e4659] mb-2">
              Ek regret se bachne ke liye...
            </p>
            <blockquote className="font-serif text-xl sm:text-2xl font-normal italic text-[#221016] leading-relaxed">
              “Main nahi chahta ki ek din main yahan se chala jaun aur mere mind mein sirf ye regret reh jaaye ki... <span className="text-[#8c2a3e] font-semibold">Maine apne dil ki baat usse kabhi kahi hi nahi.</span>”
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p className="text-[#4a3438]">
              Main nahi chahta ki time beetne ke baad main peeche mudkar dekhu aur sochu ki kaash ek baar himmat karke bata diya hota.
            </p>
            <p>
              Isliye aaj bata raha hoon.
            </p>
            <p className="text-[#523d41] italic">
              Na isliye ki mujhe tumse koi answer chahiye.
            </p>
            <p className="text-[#523d41] italic">
              Na isliye ki tumhe kuch decide karna hai.
            </p>
            <p className="font-normal text-xl sm:text-2xl text-[#200e13]">
              Bas isliye... <span className="italic text-[#8c2a3e]">ki tumhe pata hona chahiye tha.</span>
            </p>
          </motion.div>

          {/* Delicate Divider */}
          <div className="mx-auto flex items-center justify-center gap-2 opacity-40 py-6">
            <span className="h-[1px] w-16 bg-[#c9a664]" />
            <span className="text-xs text-[#c9a664]">✦</span>
            <span className="h-[1px] w-16 bg-[#c9a664]" />
          </div>

          {/* Complete Comfort & No Pressure */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-5"
          >
            <p className="text-xl sm:text-2xl font-normal text-[#2b0f19]">
              Tumhe mujhse kuch kehna zaroori nahi hai.
            </p>
            <p className="text-[#4a3438]">
              Agar tumhare dil mein mere liye bhi kuch hai, to kabhi jab tum genuinely comfortable feel karo, tab bata dena.
            </p>
            <p className="text-[#4a3438]">
              Aur agar nahi hai... to bhi it's completely okay.
            </p>
            <p className="italic text-[#2b0f19]">
              Main tumhari choice ko respect karunga.
            </p>
            <p className="text-[#4a3438]">
              Main nahi chahta ki is letter ke baad tumhe koi awkwardness feel ho ya tumhe lage ki ab tumhe mere saath kuch differently behave karna hai.
            </p>
            
            {/* Nothing has to change */}
            <div className="py-4 text-center sm:text-left">
              <span className="inline-block font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-[#220d13] border-b-2 border-[#b84d64]/40 pb-1">
                Nothing has to change.
              </span>
            </div>

            <p className="text-[#4a3438]">
              Tum apni life, apne dreams aur apne career par focus karo.
            </p>
            <p>
              Main bas khush rahunga ki kam se kam ab tumhe ye pata hai ki kahin ek insaan tha...
            </p>
            <div className="space-y-2 pl-4 sm:pl-6 border-l border-[#d7b578]/40 italic text-[#4a2e34]">
              <p>jo tumhe genuinely pasand karta tha,</p>
              <p>tumhari fikar karta tha,</p>
              <p className="text-[#7e2539] font-normal">aur tumhari khushi ko apni feelings se bhi zyada important maanta tha.</p>
            </div>
          </motion.div>

          {/* Delicate Divider */}
          <div className="mx-auto flex items-center justify-center gap-2 opacity-40 py-6">
            <span className="h-[1px] w-16 bg-[#c9a664]" />
            <span className="text-xs text-[#c9a664]">✦</span>
            <span className="h-[1px] w-16 bg-[#c9a664]" />
          </div>

          {/* Final Conclusion of Letter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#2b0f19] italic">
              Bas itna hi kehna tha.
            </h4>
            <p className="text-[#4a3438]">
              Shayad main ye sab kabhi saamne nahi keh paata. Isliye ek letter ka sahara liya.
            </p>
            <p className="text-[#4a3438]">
              Aur agar future mein humari mulaqat na bhi ho... to kam se kam mere dil mein ye regret nahi rahega ki maine apni feelings ko hamesha apne andar hi chhupa kar rakha.
            </p>
            <p className="font-serif text-2xl sm:text-3xl italic text-[#221016] py-2">
              I just wanted you to know.
            </p>
            <p>
              Apne dreams ke liye mehnat karti rehna.
            </p>
            <p>
              Khud par believe karti rehna.
            </p>
            <p>
              Aur life tumhe jahan bhi le jaaye...
            </p>
            <p className="italic text-[#722031] font-normal text-xl sm:text-2xl">
              I genuinely hope tum bahut khush raho.
            </p>

            {/* Closing Signature */}
            <div className="pt-10 sm:pt-14 text-center sm:text-right space-y-2">
              <p className="font-serif text-2xl sm:text-3xl font-medium text-[#290d15]">
                Take care Bhumi. <span className="text-[#c93b57] text-2xl" aria-hidden="true">❤️</span>
              </p>
              <p className="font-serif text-base sm:text-lg italic text-[#8c6d73]">
                — from the heart
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </article>
  );
};
