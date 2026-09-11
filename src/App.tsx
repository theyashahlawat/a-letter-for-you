import React, { useState, useEffect } from 'react';
import { AmbientCanvas } from './components/AmbientCanvas';
import { AudioControl } from './components/AudioControl';
import { HeroSection } from './components/HeroSection';
import { LetterSection } from './components/LetterSection';
import { FinalSection } from './components/FinalSection';
import { PersonalizeModal } from './components/PersonalizeModal';
import { LetterConfig } from './types';
import { audioEngine } from './utils/audioSynth';

const STORAGE_KEY = 'private_letter_conf_v1';

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<LetterConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          recipientName: parsed.recipientName || 'Bhumi',
          whatsappNumber: parsed.whatsappNumber || '917618496942',
        };
      }
    } catch {
      // Fallback silently if storage unavailable
    }
    return {
      recipientName: 'Bhumi',
      whatsappNumber: '917618496942',
    };
  });

  const handleSaveConfig = (newConfig: LetterConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // Ignore storage errors
    }
  };

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    // Smoothly resume or start ambient music on user action
    audioEngine.resume();
    const letterEl = document.getElementById('main-letter-container');
    if (letterEl) {
      letterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Listen to scroll to automatically consider the letter opened once scrolled
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 150 && !isLetterOpen) {
        setIsLetterOpen(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLetterOpen]);

  return (
    <main className="relative min-h-screen w-full bg-[#10060d] text-[#f7ede2] selection:bg-[#7b243d] selection:text-[#faefe2]">
      {/* Subtle Grain & Ambient Particle Background */}
      <div className="pointer-events-none fixed inset-0 film-grain z-0 opacity-40" />
      <AmbientCanvas density={38} />

      {/* Floating Audio Control (Discreet, Top Right) */}
      <AudioControl />

      {/* 1. Cinematic Opening Hero Screen */}
      <HeroSection onOpenLetter={handleOpenLetter} isOpen={isLetterOpen} />

      {/* Cinematic Transition Bridge */}
      <div className="relative z-10 w-full overflow-hidden py-12 text-center">
        <div className="mx-auto flex w-48 items-center justify-center gap-3 opacity-40">
          <span className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#d7b578]" />
          <span className="text-xs text-[#d7b578]">✦</span>
          <span className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#d7b578]" />
        </div>
      </div>

      {/* 2. Main Letter Section (Luxury Rag Paper & Emotional Arc) */}
      <div className="relative z-10 w-full transition-opacity duration-1000">
        <LetterSection recipientName={config.recipientName} />
      </div>

      {/* 3. Final Closing Section, WhatsApp Contact & Subtle Signature */}
      <div className="relative z-10 w-full">
        <FinalSection
          whatsappNumber={config.whatsappNumber}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Optional Configuration Modal */}
      <PersonalizeModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={handleSaveConfig}
      />
    </main>
  );
}
