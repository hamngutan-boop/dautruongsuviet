
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  failure: 'https://assets.mixkit.co/active_storage/sfx/251/251-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/251/251-preview.mp3', // Using failure sound for wrong
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

export type SoundType = keyof typeof SOUNDS;

class SoundManager {
  private enabled: boolean = true;
  private audios: Map<SoundType, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.audios.set(key as SoundType, audio);
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(type: SoundType) {
    if (!this.enabled) return;
    const audio = this.audios.get(type);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.warn('Audio play failed:', err));
    }
  }
}

export const soundManager = new SoundManager();
