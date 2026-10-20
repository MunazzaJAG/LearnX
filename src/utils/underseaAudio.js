/**
 * LearnX Undersea Sound Synthesizer Engine
 * Zero-asset, fully procedural Web Audio API sound generator.
 * Creates realistic, high-quality underwater sound effects and spatial ambience.
 */

class UnderseaAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (!this.enabled && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (this.enabled && this.ambientGain && this.isAmbientPlaying) {
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx?.currentTime || 0);
    }
  }

  // Continuous subtle underwater ambience (filtered low rumble + gentle wave movement)
  startAmbient() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn("Could not start ambient sound", e);
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    this.isAmbientPlaying = false;
  }

  // Bubble sound (sine frequency sweep up)
  playBubble() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 300 + Math.random() * 200;
    const endFreq = startFreq + 350 + Math.random() * 150;

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.12);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Sonar Pulse chime (pure sine with high harmonic resonance & gentle decay)
  playSonarPing() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [880, 1760]; // A5 and octave harmonic
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      const vol = idx === 0 ? 0.15 : 0.06;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  // Hydro-thruster boost sound (filtered low rumble)
  playThrusterBoost() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.6);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.7);

    // Pair with bubbles
    setTimeout(() => this.playBubble(), 100);
    setTimeout(() => this.playBubble(), 220);
  }

  // Laser repair beam hum
  playRepairBeam() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.linearRampToValueAtTime(440, t + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.Q.setValueAtTime(5, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.52);
  }

  // Hydraulic gate clank
  playHydraulicMove() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.75);
  }

  // Python execution success fanfare
  playSuccess() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Harmonic arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const t = this.ctx.currentTime + i * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // Python error / condition not met boop
  playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.28);

    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Level complete grand victory fanfare
  playGrandFanfare() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99], // C major
      [587.33, 739.99, 880.00], // D major
      [659.25, 830.61, 987.77], // E major
      [783.99, 987.77, 1174.66, 1567.98] // G major octave
    ];

    chords.forEach((chord, step) => {
      const stepTime = this.ctx.currentTime + step * 0.22;
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, stepTime);

        gain.gain.setValueAtTime(0.1, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, stepTime + (step === 3 ? 1.5 : 0.4));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(stepTime);
        osc.stop(stepTime + (step === 3 ? 1.6 : 0.45));
      });
    });
  }
}

export const underseaAudio = new UnderseaAudioEngine();
