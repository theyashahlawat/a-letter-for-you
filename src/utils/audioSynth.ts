// Audio Engine - MP3 soundtrack player
// Plays the default /public/song.mp3 file.
// Custom uploaded songs are supported through IndexedDB.
// Playback is started through a genuine user interaction.

import {
  saveAudioToStorage,
  getAudioFromStorage,
  clearAudioFromStorage,
} from './audioStorage';

const DEFAULT_AUDIO_PATH = '/song.mp3';

class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;

  private isCustomTrackActive = false;
  private songVolume = 0.70;

  private customSongUrl: string = DEFAULT_AUDIO_PATH;

  private userUploadedBlob: string | null = null;
  private savedSongName: string | null = null;

  private isStorageChecked = false;
  private isPlaying = false;
  private isMutedByUser = false;

  constructor() {
    // Always start with the default public song.
    this.customSongUrl = DEFAULT_AUDIO_PATH;

    // Load saved custom audio in the background.
    // IMPORTANT:
    // We do NOT start playback here.
    this.loadSavedAudioFromStorage().catch(() => {
      // Ignore IndexedDB errors and keep using the default song.
    });
  }

  /**
   * Load a previously uploaded custom song from IndexedDB.
   *
   * This method only loads the file.
   * It NEVER starts playback automatically.
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
        this.isCustomTrackActive = true;

        return saved.name;
      }
    } catch {
      this.isStorageChecked = true;
    }

    return null;
  }

  /**
   * Set a custom uploaded audio file.
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
    this.isCustomTrackActive = true;
    this.isStorageChecked = true;

    await saveAudioToStorage(file, file.name);

    this.stop();

    // The file selection itself is a genuine user interaction.
    await this.start();

    return file.name;
  }

  /**
   * Reset back to the default /public/song.mp3.
   */
  public async resetToDefault(): Promise<void> {
    this.isMutedByUser = false;

    if (this.userUploadedBlob) {
      URL.revokeObjectURL(this.userUploadedBlob);
      this.userUploadedBlob = null;
    }

    this.savedSongName = null;
    this.customSongUrl = DEFAULT_AUDIO_PATH;
    this.isCustomTrackActive = false;
    this.isStorageChecked = true;

    await clearAudioFromStorage();

    this.stop();

    // Reset mute state so the next user interaction can start music.
    this.isMutedByUser = false;
  }

  public getSavedSongName(): string | null {
    return this.savedSongName;
  }

  public isUsingCustomTrack(): boolean {
    return this.isCustomTrackActive;
  }

  /**
   * Set volume between 0 and 1.
   */
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
   * There is NO IndexedDB await before audio.play().
   *
   * This method should be called directly from a user gesture,
   * for example:
   *
   * Open the letter button -> audioEngine.start()
   */
  public async start(): Promise<boolean> {
    if (this.isMutedByUser) {
      return false;
    }

    const audioUrl = this.customSongUrl || DEFAULT_AUDIO_PATH;

    return this.playAudio(audioUrl);
  }

  /**
   * Create the audio element and immediately request playback.
   */
  private async playAudio(url: string): Promise<boolean> {
    // Clean up previous audio element.
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore cleanup errors.
      }
    }

    const audio = new Audio();

    audio.src = url;
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = this.songVolume;

    this.audioElement = audio;

    try {
      // IMPORTANT:
      // Keep this play() call directly inside start().
      await audio.play();

      this.isPlaying = true;

      return true;
    } catch (error) {
      console.warn('Audio playback was blocked or failed:', error);

      this.isPlaying = false;

      return false;
    }
  }

  /**
   * Resume paused music.
   */
  public async resume(): Promise<boolean> {
    this.isMutedByUser = false;

    if (!this.audioElement) {
      return this.start();
    }

    try {
      await this.audioElement.play();

      this.isPlaying = true;

      return true;
    } catch (error) {
      console.warn('Audio resume failed:', error);

      this.isPlaying = false;

      return false;
    }
  }

  /**
   * Stop / mute music.
   */
  public stop(): void {
    this.isPlaying = false;
    this.isMutedByUser = true;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore cleanup errors.
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();
