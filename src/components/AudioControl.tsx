import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Sliders,
  ChevronDown,
  Check,
  RotateCcw,
  Upload,
  Play,
  Pause,
  X,
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

export const AudioControl: React.FC = () => {
  // Music should NOT be considered playing until audio actually starts.
  const [isPlaying, setIsPlaying] = useState(false);

  const [activeSongName, setActiveSongName] = useState<string | null>(null);

  const [volume, setVolumeState] = useState<number>(70);

  const [isOpen, setIsOpen] = useState(false);

  // Tracks whether the user explicitly muted/stopped the music.
  const userMutedRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Play / Pause button inside Audio Controls.
   */
  const togglePlayPause = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (isPlaying) {
      // User explicitly paused the music.
      userMutedRef.current = true;

      audioEngine.stop();

      setIsPlaying(false);
    } else {
      // User explicitly requested playback.
      userMutedRef.current = false;

      const started = await audioEngine.start();

      setIsPlaying(started);
    }
  };

  /**
   * Volume control.
   */
  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVol = parseInt(e.target.value, 10);

    setVolumeState(newVol);

    audioEngine.setVolume(newVol / 100);

    // If user moves volume above 0, allow playback again.
    if (
      newVol > 0 &&
      !isPlaying &&
      !userMutedRef.current
    ) {
      audioEngine.start().then((started) => {
        setIsPlaying(started);
      });
    }

    // If volume is moved to 0, stop the audio.
    if (newVol === 0) {
      userMutedRef.current = true;

      audioEngine.stop();

      setIsPlaying(false);
    }
  };

  /**
   * User selected a custom audio file.
   */
  const handleCustomFileChosen = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setActiveSongName(file.name);

    userMutedRef.current = false;

    const started = await audioEngine.setCustomAudioFile(file);

    setIsPlaying(started);
  };

  /**
   * Reset back to /public/song.mp3.
   */
  const handleResetToDefault = async () => {
    userMutedRef.current = false;

    await audioEngine.resetToDefault();

    setActiveSongName(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset does not automatically start music.
    setIsPlaying(false);
  };

  /**
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, [isOpen]);

  /**
   * Initial audio setup.
   *
   * IMPORTANT:
   * We do NOT try to play immediately when the page loads.
   *
   * Instead:
   * 1. Load saved audio information.
   * 2. Wait 5 seconds.
   * 3. Try autoplay.
   *
   * If the browser blocks autoplay, the user can still
   * start the music by clicking "Open the letter".
   */
  useEffect(() => {
    let isMounted = true;

    // Initial volume sync.
    setVolumeState(
      Math.round(audioEngine.getVolume() * 100)
    );

    // Load previously saved custom audio.
    audioEngine
      .loadSavedAudioFromStorage()
      .then((savedName) => {
        if (!isMounted) {
          return;
        }

        if (savedName) {
          setActiveSongName(savedName);
        }
      })
      .catch(() => {
        // Keep using the default /song.mp3.
      });

    /**
     * Try autoplay after 5 seconds.
     *
     * Browser may reject this because there was no
     * user interaction. That is expected.
     */
    const autoplayTimer = window.setTimeout(async () => {
      if (!isMounted) {
        return;
      }

      // Don't override an explicit user mute.
      if (userMutedRef.current) {
        return;
      }

      // Don't restart music if it is already playing.
      if (audioEngine.getIsPlaying()) {
        setIsPlaying(true);
        return;
      }

      const started = await audioEngine.start();

      if (!isMounted) {
        return;
      }

      if (started) {
        setIsPlaying(true);
      } else {
        // Autoplay was probably blocked.
        // This is normal on Brave/mobile.
        setIsPlaying(false);
      }
    }, 5000);

    /**
     * Keep the UI synchronized with the actual audio engine.
     *
     * This is useful because the "Open the letter" button
     * starts the audio from HeroSection.
     */
    const syncTimer = window.setInterval(() => {
      if (!isMounted) {
        return;
      }

      const actuallyPlaying = audioEngine.getIsPlaying();

      setIsPlaying((previous) => {
        if (previous !== actuallyPlaying) {
          return actuallyPlaying;
        }

        return previous;
      });
    }, 500);

    return () => {
      isMounted = false;

      window.clearTimeout(autoplayTimer);

      window.clearInterval(syncTimer);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute top-5 right-5 z-50"
    >
      {/* Hidden file input for custom song selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleCustomFileChosen}
        className="hidden"
        id="master-audio-file-input"
      />

      {/* Single Master Button */}
      <button
        id="master-audio-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Soundtrack and audio controls"
        className="group relative flex items-center gap-2.5 rounded-full border border-[#d7b578]/40 bg-[#160711]/90 px-4 py-2.5 text-xs backdrop-blur-md transition-all duration-300 hover:border-[#d7b578] hover:bg-[#230b1b] shadow-xl shadow-black/60 cursor-pointer"
      >
        {/* Volume Icon */}
        <span className="relative flex h-4 w-4 items-center justify-center text-[#e8d5b5]">
          {!isPlaying || volume === 0 ? (
            <VolumeX className="h-4 w-4 text-[#a89094] group-hover:text-[#e8d5b5]" />
          ) : volume < 40 ? (
            <Volume1 className="h-4 w-4 text-[#d7b578]" />
          ) : (
            <Volume2 className="h-4 w-4 text-[#d7b578]" />
          )}
        </span>

        {/* Dynamic Label */}
        <div className="flex flex-col text-left">
          <span className="font-sans text-[11px] font-medium tracking-wide text-[#eddcd3] max-w-[120px] sm:max-w-[150px] truncate">
            {activeSongName
              ? activeSongName
              : isPlaying
              ? 'Soundtrack'
              : 'Music Paused'}
          </span>
        </div>

        {/* Equalizer */}
        {isPlaying && volume > 0 ? (
          <div
            className="flex items-center gap-0.5"
            aria-hidden="true"
          >
            <span
              className="h-2.5 w-0.5 animate-pulse bg-[#d7b578]"
              style={{ animationDelay: '0ms' }}
            />

            <span
              className="h-3.5 w-0.5 animate-pulse bg-[#d7b578]"
              style={{ animationDelay: '180ms' }}
            />

            <span
              className="h-2 w-0.5 animate-pulse bg-[#d7b578]"
              style={{ animationDelay: '360ms' }}
            />
          </div>
        ) : (
          <span className="text-[10px] text-[#937b80] font-sans">
            Off
          </span>
        )}

        {/* Dropdown Indicator */}
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#d7b578]/80 transition-transform duration-300 ${
            isOpen
              ? 'rotate-180 text-[#d7b578]'
              : ''
          }`}
        />
      </button>

      {/* Audio Control Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl border border-[#d7b578]/35 bg-[#170612]/95 p-4 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#d7b578]/15 pb-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#d7b578]" />

              <span className="font-serif text-sm font-normal text-[#f4ebdd] tracking-wide">
                Audio Controls
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-[#b59f9f] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Play / Pause */}
          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 mb-3 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-full ${
                  isPlaying
                    ? 'bg-[#d7b578]/20 text-[#d7b578]'
                    : 'bg-white/5 text-[#887076]'
                }`}
              >
                {isPlaying ? (
                  <Music className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </div>

              <div>
                <p className="text-xs font-sans font-medium text-[#f0e4d7]">
                  {isPlaying
                    ? 'Music Playing'
                    : 'Music Paused'}
                </p>

                <p className="text-[10px] text-[#a89094]">
                  {isPlaying
                    ? 'Smooth background audio'
                    : 'Click to resume soundtrack'}
                </p>
              </div>
            </div>

            <button
              onClick={togglePlayPause}
              className={`flex items-center justify-center h-8 w-8 rounded-full border transition-all duration-300 cursor-pointer ${
                isPlaying
                  ? 'border-[#d7b578] bg-[#d7b578] text-[#1a0815] shadow-md shadow-[#d7b578]/30 hover:scale-105'
                  : 'border-white/20 bg-white/10 text-white hover:border-white/40'
              }`}
              title={
                isPlaying
                  ? 'Pause / Mute'
                  : 'Play'
              }
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Volume */}
          <div className="mb-4 rounded-xl bg-white/[0.04] p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans text-[#eddcd3] flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-[#d7b578]" />
                Volume
              </span>

              <span className="text-xs font-mono font-medium text-[#d7b578]">
                {volume}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#d7b578] hover:accent-[#edd6a8]"
            />

            <div className="flex justify-between text-[9px] text-[#937b80] mt-1 font-sans">
              <span>Mute (0%)</span>

              <span className="text-[#d7b578]/80 font-medium">
                Optimal (70%)
              </span>

              <span>100%</span>
            </div>
          </div>

          {/* Track Selection */}
          <div className="rounded-xl bg-white/[0.04] p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider text-[#a89094]">
                Current Soundtrack
              </span>

              {activeSongName && (
                <span className="text-[10px] text-[#d7b578] flex items-center gap-1">
                  <Check className="h-3 w-3 inline" />
                  Saved
                </span>
              )}
            </div>

            <p className="text-xs font-serif text-[#f4ebdd] truncate mb-2.5">
              {activeSongName || 'song.mp3'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#d7b578]/40 bg-[#d7b578]/15 px-2.5 py-1.5 text-xs font-medium text-[#eddcd3] hover:bg-[#d7b578]/25 hover:border-[#d7b578] transition-all cursor-pointer"
              >
                <Upload className="h-3 w-3 text-[#d7b578]" />

                <span>Change Song</span>
              </button>

              {activeSongName && (
                <button
                  onClick={handleResetToDefault}
                  title="Reset to default song"
                  className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-[#b8a2a7] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
