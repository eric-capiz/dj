/**
 * GLOSS SYNTH — a candy-coated WebAudio monosynth. Zero samples.
 * XY pad: X = pitch glide (110–880 Hz), Y = lowpass cutoff.
 * Plus chord-stab presets, delay send, and oscillator switching.
 */
export type OscType = "sawtooth" | "square" | "triangle" | "sine";

export interface ChordStab {
  name: string;
  freqs: number[];
}

export const CHORDS: ChordStab[] = [
  { name: "NEON", freqs: [220.0, 261.63, 329.63] }, // Am
  { name: "BUBBLE", freqs: [174.61, 220.0, 261.63] }, // F
  { name: "MODEM", freqs: [196.0, 246.94, 293.66] }, // G
  { name: "GLITTER", freqs: [146.83, 174.61, 220.0] }, // Dm
];

class GlossSynth {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private oscGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private delay: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private master: GainNode | null = null;
  private type: OscType = "sawtooth";
  private padActive = false;
  private freq = 220;

  private ensure(): boolean {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return true;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    const ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.5;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp);
    comp.connect(ctx.destination);

    // Delay send (feedback loop kept tame).
    this.delay = ctx.createDelay(1.0);
    this.delay.delayTime.value = 0.32;
    this.delayGain = ctx.createGain();
    this.delayGain.gain.value = 0.25;
    const fb = ctx.createGain();
    fb.gain.value = 0.35;
    this.delay.connect(fb);
    fb.connect(this.delay);
    this.delay.connect(this.delayGain);
    this.delayGain.connect(this.master);

    // Voice chain: osc -> gain -> filter -> master (+ delay tap).
    this.oscGain = ctx.createGain();
    this.oscGain.gain.value = 0;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 2400;
    this.filter.Q.value = 6;
    this.oscGain.connect(this.filter);
    this.filter.connect(this.master);
    this.filter.connect(this.delay);

    this.osc = ctx.createOscillator();
    this.osc.type = this.type;
    this.osc.frequency.value = this.freq;
    this.osc.connect(this.oscGain);
    this.osc.start();
    return true;
  }

  setType(t: OscType) {
    this.type = t;
    if (this.osc) this.osc.type = t;
  }

  /** X: 0..1 pitch, Y: 0..1 cutoff. Call on pointer down/move over the pad. */
  pad(x: number, y: number) {
    if (!this.ensure() || !this.ctx || !this.osc || !this.filter || !this.oscGain) return;
    const t = this.ctx.currentTime;
    // Exponential pitch glide, 110 Hz → 880 Hz.
    this.freq = 110 * Math.pow(8, Math.min(1, Math.max(0, x)));
    this.osc.frequency.setTargetAtTime(this.freq, t, 0.03);
    // Y flipped: top of pad = open filter.
    const cutoff = 300 * Math.pow(40, 1 - Math.min(1, Math.max(0, y)));
    this.filter.frequency.setTargetAtTime(cutoff, t, 0.03);
    if (!this.padActive) {
      this.padActive = true;
      this.oscGain.gain.setTargetAtTime(0.5, t, 0.02);
    }
  }

  padRelease() {
    if (!this.ctx || !this.oscGain) return;
    this.padActive = false;
    this.oscGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
  }

  /** Fire a chord stab (all voices through the same filter for cohesion). */
  stab(chord: ChordStab) {
    if (!this.ensure() || !this.ctx || !this.master || !this.filter) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    for (const f of chord.freqs) {
      const o = ctx.createOscillator();
      o.type = this.type;
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      o.connect(g);
      g.connect(this.filter);
      o.start(t);
      o.stop(t + 1);
    }
  }

  setDelay(amount: number) {
    if (this.delayGain && this.ctx) {
      this.delayGain.gain.setTargetAtTime(amount * 0.6, this.ctx.currentTime, 0.05);
    }
  }
}

export const glossSynth = new GlossSynth();
