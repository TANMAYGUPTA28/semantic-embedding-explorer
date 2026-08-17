// Web Audio API Sound Synthesizer Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  beep(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.ctx?.resume();
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playQuerySelect() {
    this.beep(540, 'sine', 0.1, 0.12);
    setTimeout(() => this.beep(880, 'triangle', 0.15, 0.1), 60);
  }

  playHover() {
    this.beep(1250, 'sine', 0.03, 0.02);
  }

  playRecompute() {
    this.beep(280, 'sawtooth', 0.25, 0.07);
    setTimeout(() => this.beep(660, 'sine', 0.3, 0.1), 180);
  }

  playToggle() {
    this.beep(720, 'sine', 0.08, 0.06);
  }
}

export const AudioEngine = new SoundEngine();
