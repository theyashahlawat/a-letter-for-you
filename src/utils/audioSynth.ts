// Audio Engine - MP3 soundtrack player
// Supports user-uploaded songs (persisted in IndexedDB) and default public/song.mp3.
// Procedural synthesizer is completely removed - only real audio files are played.

import { saveAudioToStorage, getAudioFromStorage, clearAudioFromStorage } from './audioStorage';

function getCandidatePaths(): string[] {
  const metaEnv = (import.meta as unknown as { env?: { BASE_URL?: string } })?.env;
  const base = metaEnv?.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

  const rawList = [
    `${cleanBase}/song.mp3`,
    '/song.mp3',
    'song.mp3',
    `${cleanBase}/music.mp3`,
    '/music.mp3',
    'music.mp3',
  ];

  // Return unique, non-empty candidates
  return Array.from(new Set(rawList.filter(Boolean)));
}

class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isCustomTrackActive = false;
  private songVolume = 0.70; // Fixed 70% volume so it never overpowers reading
  private candidateIndex = 0;
  private candidateFiles: string[] = [];
  private customSongUrl: string | null = null;
  private userUploadedBlob: string | null = null;
  private savedSongName: string | null = null;
  private isStorageChecked = false;
  private isPlaying = false;
  private isMutedByUser = false;
  private pendingAutoplay = false;

  constructor() {
    this.candidateFiles = getCandidatePaths();
    if (this.candidateFiles.length > 0) {
      this.customSongUrl = this.candidateFiles[0];
    }
    this.attachAutoplayUnlockListeners();
  }

  private attachAutoplayUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = async () => {
      if (this.isMutedByUser) return;
      if (this.pendingAutoplay || !this.isPlaying) {
        await this.start();
      } else if (this.audioElement && this.audioElement.paused) {
        try {
          await this.audioElement.play();
          this.isPlaying = true;
          this.pendingAutoplay = false;
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('click', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  public async loadSavedAudioFromStorage(): Promise<string | null> {
    if (this.isStorageChecked && this.savedSongName) {
      return this.savedSongName;
    }
    try {
      const saved = await getAudioFromStorage();
      this.isStorageChecked = true;
      if (saved && saved.blob) {
        if (this.userUploadedBlob) {
          URL.revokeObjectURL(this.userUploadedBlob);
        }
        const blobUrl = URL.createObjectURL(saved.blob);
        this.userUploadedBlob = blobUrl;
        this.customSongUrl = blobUrl;
        this.savedSongName = saved.name;
        return saved.name;
      }
    } catch {
      this.isStorageChecked = true;
    }
    return null;
  }

  public async setCustomAudioFile(file: File): Promise<string> {
    this.isMutedByUser = false;
    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
    }
    const blobUrl = URL.createObjectURL(file);
    this.userUploadedBlob = blobUrl;
    this.customSongUrl = blobUrl;
    this.savedSongName = file.name;
    this.candidateIndex = 0;
    this.isStorageChecked = true;

    // Permanently persist in IndexedDB
    await saveAudioToStorage(file, file.name);

    this.stop();
    await this.start();
    return file.name;
  }

  public async resetToDefault(): Promise<void> {
    this.isMutedByUser = false;
    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
      this.userUploadedBlob = null;
    }
    this.savedSongName = null;
    this.candidateFiles = getCandidatePaths();
    this.candidateIndex = 0;
    this.customSongUrl = this.candidateFiles[0] || '/song.mp3';
    await clearAudioFromStorage();
    this.stop();
    await this.start();
  }

  public getSavedSongName(): string | null {
    return this.savedSongName;
  }

  public isUsingCustomTrack(): boolean {
    return this.isCustomTrackActive;
  }

  public setVolume(volume: number): void {
    this.songVolume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.songVolume;
    }
  }

  public getVolume(): number {
    return this.songVolume;
  }

  public async start(): Promise<boolean> {
    if (this.isMutedByUser) return false;

    // Check IndexedDB if not checked yet
    if (!this.isStorageChecked) {
      await this.loadSavedAudioFromStorage();
    }

    const success = await this.playCurrentCandidate();
    if (success) {
      this.isPlaying = true;
      this.isCustomTrackActive = true;
      this.pendingAutoplay = false;
      return true;
    }

    return false;
  }

  private playCurrentCandidate(): Promise<boolean> {
    return new Promise((resolve) => {
      const urlToTry = this.customSongUrl || this.candidateFiles[this.candidateIndex] || '/song.mp3';

      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement = null;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = this.songVolume;

      let resolved = false;

      const tryNextCandidate = () => {
        if (resolved) return;
        resolved = true;
        // If it was a default file that 404ed, try next path candidate
        if (!this.userUploadedBlob && this.candidateIndex < this.candidateFiles.length - 1) {
          this.candidateIndex++;
          this.customSongUrl = this.candidateFiles[this.candidateIndex];
          this.playCurrentCandidate().then(resolve);
          return;
        }
        // No more candidates, stay silent (NO annoying synth sound!)
        this.isCustomTrackActive = false;
        resolve(false);
      };

      audio.addEventListener('error', () => {
        tryNextCandidate();
      });

      audio.src = urlToTry;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!resolved) {
              resolved = true;
              this.audioElement = audio;
              this.isCustomTrackActive = true;
              this.isPlaying = true;
              this.pendingAutoplay = false;
              resolve(true);
            }
          })
          .catch((err) => {
            // Check if it's browser autoplay policy block (NotAllowedError)
            if (err && err.name === 'NotAllowedError') {
              // Not a 404! The file is ready, just waiting for user interaction
              if (!resolved) {
                resolved = true;
                this.audioElement = audio;
                this.pendingAutoplay = true;
                // Will play automatically on first user click/touch/scroll
                resolve(true);
              }
            } else {
              tryNextCandidate();
            }
          });
      } else {
        this.audioElement = audio;
        this.isCustomTrackActive = true;
        this.isPlaying = true;
        resolve(true);
      }
    });
  }

  public async resume(): Promise<boolean> {
    this.isMutedByUser = false;
    if (this.audioElement) {
      try {
        await this.audioElement.play();
        this.isPlaying = true;
        this.pendingAutoplay = false;
        return true;
      } catch {
        return this.start();
      }
    }
    return this.start();
  }

  public stop(): void {
    this.isPlaying = false;
    this.isMutedByUser = true;
    this.pendingAutoplay = false;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();
