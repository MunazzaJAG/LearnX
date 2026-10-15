// Web Audio API Synthesizer for cozy, warm RPG sound effects
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = "sine", gainLevel = 0.15, delay = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Soft cozy tap for navigation & buttons
  playClick() {
    this.playTone(520, 0.06, "triangle", 0.08);
  }

  // Sparkle chime when hints are revealed
  playHint() {
    this.playTone(659.25, 0.12, "sine", 0.1, 0.0);   // E5
    this.playTone(880.00, 0.18, "sine", 0.12, 0.08);  // A5
    this.playTone(1046.50, 0.25, "sine", 0.09, 0.16); // C6
  }

  // Uplifting chord progression on completing a mission
  playVictory() {
    const notes = [
      { f: 523.25, d: 0.15, t: 0.0 },   // C5
      { f: 659.25, d: 0.18, t: 0.12 },  // E5
      { f: 783.99, d: 0.22, t: 0.24 },  // G5
      { f: 1046.50, d: 0.45, t: 0.38 }  // C6
    ];
    notes.forEach(n => this.playTone(n.f, n.d, "triangle", 0.16, n.t));
  }

  // Grand celebratory fanfare on unlocking a new badge
  playBadgeUnlock() {
    const notes = [
      { f: 440.00, d: 0.12, t: 0.0 },   // A4
      { f: 554.37, d: 0.12, t: 0.1 },   // C#5
      { f: 659.25, d: 0.15, t: 0.2 },   // E5
      { f: 880.00, d: 0.22, t: 0.3 },   // A5
      { f: 1108.73, d: 0.45, t: 0.45 }  // C#6
    ];
    notes.forEach(n => this.playTone(n.f, n.d, "triangle", 0.2, n.t));
  }

  // Gentle, soft feedback if output does not match expected
  playIncorrect() {
    this.playTone(320, 0.15, "sine", 0.1, 0.0);
    this.playTone(280, 0.22, "sine", 0.08, 0.12);
  }

  // Uplifting sound effect for stage completion and level ups
  playLevelUp() {
    this.playVictory();
  }

  // Success chime alias
  playSuccess() {
    this.playVictory();
  }
}

export const soundEngine = new SoundEngine();
