// Unified Audio Engine
// Supports custom MP3 files (e.g. /song.mp3, /music.mp3 in the /public folder or uploaded audio)
// and automatically falls back to procedural ambient chord synthesis if no custom song is found.
// Audio uploaded via "Change Music" is permanently saved in browser IndexedDB.

import { saveAudioToStorage, getAudioFromStorage, clearAudioFromStorage } from './audioStorage';

class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isCustomTrackActive = false;
  private songVolume = 0.50; // 50% volume so it doesn't overpower reading
  private candidateIndex = 0;
  private candidateFiles = ['/song.mp3'];
  private customSongUrl: string | null = null;
  private userUploadedBlob: string | null = null;
  private savedSongName: string | null = null;
  private isStorageChecked = false;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;

  // Cinematic pentatonic / romantic chord roots in Hz (Db, Fm, Bbm, Ab)
  private chords = [
    [138.59, 174.61, 207.65, 277.18, 329.63], // Db major add9
    [130.81, 164.81, 196.00, 261.63, 392.00], // C minor 7 / Ab maj
    [116.54, 138.59, 174.61, 233.08, 349.23], // Bb minor 7
    [103.83, 130.81, 155.56, 207.65, 311.13], // Ab sus2
  ];
  private chordIndex = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.customSongUrl = this.candidateFiles[0];
    }
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
    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
      this.userUploadedBlob = null;
    }
    this.savedSongName = null;
    this.customSongUrl = this.candidateFiles[0];
    this.candidateIndex = 0;
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
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.35 * this.songVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.songVolume;
  }

  private initSynth() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(650, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;

    // Load permanently saved song from storage if not checked yet
    if (!this.isStorageChecked) {
      await this.loadSavedAudioFromStorage();
    }

    // 1. Try playing custom song first (/song.mp3 or uploaded blob)
    const customSuccess = await this.tryPlayCustomSong();
    if (customSuccess) {
      this.isPlaying = true;
      this.isCustomTrackActive = true;
      return true;
    }

    // 2. Fallback to procedural ambient synthesizer
    return this.startSynth();
  }

  private tryPlayCustomSong(): Promise<boolean> {
    return new Promise((resolve) => {
      const urlToTry = this.customSongUrl || this.candidateFiles[this.candidateIndex];

      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement = null;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = this.songVolume; // 70% volume so it doesn't interrupt or overpower reading

      let resolved = false;

      const handleFail = () => {
        if (resolved) return;
        resolved = true;
        // If user hasn't explicitly uploaded a blob and we still have candidates (/music.mp3)
        if (!this.userUploadedBlob && this.candidateIndex < this.candidateFiles.length - 1) {
          this.candidateIndex++;
          this.customSongUrl = this.candidateFiles[this.candidateIndex];
          this.tryPlayCustomSong().then(resolve);
          return;
        }
        this.isCustomTrackActive = false;
        resolve(false);
      };

      audio.addEventListener('error', handleFail);

      audio.src = urlToTry;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!resolved) {
              resolved = true;
              this.audioElement = audio;
              this.isCustomTrackActive = true;
              resolve(true);
            }
          })
          .catch(() => {
            // Autoplay prevented or file not reachable
            handleFail();
          });
      } else {
        this.audioElement = audio;
        this.isCustomTrackActive = true;
        resolve(true);
      }
    });
  }

  private async startSynth(): Promise<boolean> {
    this.initSynth();
    if (!this.ctx || !this.masterGain) return false;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch {
      // Browser blocked until gesture
      return false;
    }

    this.isPlaying = true;
    this.isCustomTrackActive = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 3);

    this.scheduleNextChord();
    return true;
  }

  public async resume(): Promise<boolean> {
    if (this.isCustomTrackActive && this.audioElement) {
      try {
        await this.audioElement.play();
        this.isPlaying = true;
        return true;
      } catch {
        // Fallback below
      }
    }

    if (!this.isPlaying) {
      return this.start();
    }

    if (this.ctx) {
      try {
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume();
        }
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }

  private playTone(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.filterNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    const detune = (Math.random() - 0.5) * 6;
    osc.detune.setValueAtTime(detune, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    const attack = 2.5;
    gain.gain.linearRampToValueAtTime(volume, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  private scheduleNextChord = () => {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = this.chords[this.chordIndex % this.chords.length];
    this.chordIndex++;

    const chordDuration = 9.0;

    chord.forEach((freq, idx) => {
      const noteDelay = idx * 0.45;
      const noteVol = 0.05 + 0.04 / (idx + 1);
      this.playTone(freq, now + noteDelay, chordDuration + 2, noteVol);
    });

    if (Math.random() > 0.3) {
      const bellFreq = chord[Math.floor(Math.random() * chord.length)] * 2;
      this.playTone(bellFreq, now + 3.2, 5.0, 0.025);
    }

    this.timerId = window.setTimeout(this.scheduleNextChord, (chordDuration - 1.5) * 1000);
  };

  public stop(): void {
    this.isPlaying = false;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
    }

    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

      setTimeout(() => {
        if (!this.isPlaying && this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend();
        }
      }, 1600);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();
