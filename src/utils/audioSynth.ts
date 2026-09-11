// Audio Engine - MP3 soundtrack player
// Plays the real audio file from /public/song.mp3.
// Audio starts only after a genuine user interaction.

import {
  saveAudioToStorage,
  getAudioFromStorage,
  clearAudioFromStorage,
} from './audioStorage';

function getDefaultAudioPath(): string {
  return '/song.mp3';
}

class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;

  private isCustomTrackActive = false;
  private songVolume = 0.70;

  private customSongUrl: string | null = null;
  private userUploadedBlob: string | null = null;
  private savedSongName: string | null = null;

  private isStorageChecked = false;
  private isPlaying = false;
  private isMutedByUser = false;

  constructor() {
    // Default public audio file
    this.customSongUrl = getDefaultAudioPath();

    // Load previously uploaded audio in the background.
    // We intentionally do NOT try to autoplay here.
    this.loadSavedAudioFromStorage().catch(() => {
      // Ignore storage errors and continue with default song.
    });
  }

  /**
   * Load previously uploaded audio from IndexedDB.
   */
  public async loadSavedAudioFromStorage(): Promise<string | null> {
    if (this.isStorageChecked) {
      return this.savedSongName;
    }

    try {
      const saved = await getAudioFromStorage();

      this.isStorageChecked = true;

      if (saved?.blob) {
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

  /**
   * Set a user-uploaded audio file.
   */
  public async setCustomAudioFile(file: File): Promise<string> {
    this.isMutedByUser = false;

    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
    }

    const blobUrl = URL.createObjectURL(file);

    this.userUploadedBlob = blobUrl;
    this.customSongUrl = blobUrl;
    this.savedSongName = file.name;
    this.isStorageChecked = true;

    await saveAudioToStorage(file, file.name);

    this.stop();

    // User selected the file, so this is a valid interaction.
    await this.start();

    return file.name;
  }

  /**
   * Reset to the default public/song.mp3.
   */
  public async resetToDefault(): Promise<void> {
    this.isMutedByUser = false;

    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
      this.userUploadedBlob = null;
    }

    this.savedSongName = null;
    this.customSongUrl = getDefaultAudioPath();
    this.isStorageChecked = true;

    await clearAudioFromStorage();

    this.stop();
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

  /**
   * Start music.
   *
   * IMPORTANT:
   * This method should be called directly from a user interaction,
   * such as clicking "Open the letter".
   */
  public async start(): Promise<boolean> {
    if (this.isMutedByUser) {
      return false;
    }

    const url = this.customSongUrl || getDefaultAudioPath();

    return this.playAudio(url);
  }

  /**
   * Actually create and play the audio element.
   */
  private async playAudio(url: string): Promise<boolean> {
    // Stop previous audio element
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore cleanup errors
      }
    }

    const audio = new Audio();

    audio.src = url;
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = this.songVolume;

    this.audioElement = audio;

    try {
      await audio.play();

      this.isPlaying = true;
      this.isCustomTrackActive = !!this.userUploadedBlob;

      return true;
    } catch (error) {
      console.warn('Audio could not start:', error);

      this.isPlaying = false;

      // Don't throw. The UI can continue without music.
      return false;
    }
  }

  /**
   * Resume paused music.
   */
  public async resume(): Promise<boolean> {
    this.isMutedByUser = false;

    if (this.audioElement) {
      try {
        await this.audioElement.play();

        this.isPlaying = true;

        return true;
      } catch {
        return false;
      }
    }

    return this.start();
  }

  /**
   * Stop and mute the music.
   */
  public stop(): void {
    this.isPlaying = false;
    this.isMutedByUser = true;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();
