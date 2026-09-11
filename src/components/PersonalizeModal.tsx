import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Sparkles, Music, Upload, RotateCcw } from 'lucide-react';
import { LetterConfig } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LetterConfig;
  onSave: (newConfig: LetterConfig) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [recipient, setRecipient] = useState(config.recipientName || '');
  const [phone, setPhone] = useState(config.whatsappNumber || '');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(() => audioEngine.getSavedSongName());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFileName(audioEngine.getSavedSongName());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      await audioEngine.setCustomAudioFile(file);
    }
  };

  const handleResetAudio = async () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    await audioEngine.resetToDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      recipientName: recipient.trim(),
      whatsappNumber: phone.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-[#d7b578]/30 bg-[#190812] p-6 sm:p-8 text-[#f7ede2] shadow-2xl shadow-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close configuration"
          className="absolute top-4 right-4 rounded-full p-1.5 text-[#b09ba0] hover:bg-white/5 hover:text-[#f7ede2] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-2 text-[#d7b578]">
          <Sparkles className="h-4 w-4" />
          <h4 className="font-serif text-xl font-normal tracking-wide">Personalize Letter</h4>
        </div>

        <p className="font-sans text-xs text-[#b8a49c] leading-relaxed mb-6">
          You can optionally configure recipient details and your WhatsApp phone number.
          Your phone number will stay private and is never shown publicly on the page.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#d5c3ba] mb-1.5">
              Recipient Name (optional)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Maya"
              className="w-full rounded-xl border border-[#d7b578]/25 bg-[#250d1b] px-4 py-2.5 text-sm text-[#f7ede2] placeholder-[#7d686f] focus:border-[#d7b578] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#d5c3ba] mb-1.5">
              Your WhatsApp Number (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="7618496942"
              className="w-full rounded-xl border border-[#d7b578]/25 bg-[#250d1b] px-4 py-2.5 text-sm text-[#f7ede2] placeholder-[#7d686f] focus:border-[#d7b578] focus:outline-none transition-colors"
            />
            <p className="mt-1 text-[11px] text-[#8e7a7f]">
              Directly opens 1-on-1 private chat on WhatsApp even if unsaved in contacts.
            </p>
          </div>

          {/* Background Song Section */}
          <div className="rounded-xl border border-[#d7b578]/20 bg-[#210c18]/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#d7b578]">
                <Music className="h-3.5 w-3.5 text-[#d7b578]" />
                <span>Background Song / Music</span>
              </div>
              {selectedFileName && (
                <button
                  type="button"
                  onClick={handleResetAudio}
                  className="flex items-center gap-1 text-[11px] text-[#b8959c] hover:text-[#f7ede2] transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#b8a49c] leading-relaxed">
              <strong className="text-[#f7ede2]">VS Code mein lagane ke liye:</strong> Apni pasand ka koi bhi song <code className="rounded bg-[#331124] px-1 py-0.5 text-[#e5caa6]">song.mp3</code> naam se project ke <code className="rounded bg-[#331124] px-1 py-0.5 text-[#e5caa6]">public/</code> folder mein rakh dein.
            </p>

            <div className="pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="song-file-upload-input"
              />
              <label
                htmlFor="song-file-upload-input"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-[#d7b578]/35 bg-[#2a0e1f] px-3 py-2.5 text-xs text-[#eedfd1] hover:border-[#d7b578] hover:bg-[#341127] cursor-pointer transition-all"
              >
                <Upload className="h-3.5 w-3.5 text-[#d7b578]" />
                <span>
                  {selectedFileName ? `Loaded: ${selectedFileName}` : 'Browser mein abhi test karein (Choose .mp3)'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7b578]/15">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs text-[#b8a49c] hover:text-[#f7ede2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#d7b578]/40 bg-[#3a1327] px-5 py-2 text-xs font-medium text-[#f7ede2] hover:border-[#d7b578] hover:bg-[#481831] transition-all"
            >
              <Heart className="h-3.5 w-3.5 text-[#d7b578]" />
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
