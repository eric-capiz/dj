// BASSMENT step-sequencer engine: all drum voices are synthesized with
// WebAudio — no samples. 16 steps, 6 voices, lookahead scheduler.

export type VoiceId = "kick" | "snare" | "clap" | "chat" | "ohat" | "bass";

export const VOICES: { id: VoiceId; label: string }[] = [
  { id: "kick", label: "KICK" },
  { id: "snare", label: "SNARE" },
  { id: "clap", label: "CLAP" },
  { id: "chat", label: "HAT" },
  { id: "ohat", label: "OPEN" },
  { id: "bass", label: "BASS" },
];

export const STEPS = 16;

// Driving A-minor bass riff, one MIDI note per step (0 = rest).
const BASS_RIFF = [33, 0, 33, 33, 36, 0, 33, 0, 31, 0, 33, 33, 36, 38, 36, 34];

export type Pattern = Record<VoiceId, boolean[]>;

const emptyPattern = (): Pattern =>
  Object.fromEntries(VOICES.map((v) => [v.id, Array(STEPS).fill(false)])) as Pattern;

export const PRESETS: { name: string; steps: Record<VoiceId, number[]> }[] = [
  {
    name: "WAREHOUSE",
    steps: {
      kick: [0, 4, 8, 12],
      snare: [],
      clap: [4, 12],
      chat: [2, 6, 10, 14],
      ohat: [14],
      bass: [0, 3, 6, 10, 12, 14],
    },
  },
  {
    name: "BREAKS",
    steps: {
      kick: [0, 7, 10],
      snare: [4, 12],
      clap: [],
      chat: [0, 2, 4, 6, 8, 10, 12, 14],
      ohat: [15],
      bass: [0, 7, 10],
    },
  },
  {
    name: "ACID LINE",
    steps: {
      kick: [0, 4, 8, 12],
      snare: [4, 12],
      clap: [],
      chat: [2, 6, 10, 14],
      ohat: [7, 15],
      bass: [1, 3, 5, 6, 9, 11, 13, 14],
    },
  },
  {
    name: "EMPTY",
    steps: { kick: [], snare: [], clap: [], chat: [], ohat: [], bass: [] },
  },
];

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class SequencerEngine {
  bpm = 132;
  onStep: (step: number) => void = () => {};

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;
  private pattern: Pattern = emptyPattern();

  get playing() {
    return this.timer !== null;
  }

  snapshot(): Pattern {
    return Object.fromEntries(
      VOICES.map((v) => [v.id, [...this.pattern[v.id]]]),
    ) as Pattern;
  }

  toggle(voice: VoiceId, step: number): boolean {
    this.pattern[voice][step] = !this.pattern[voice][step];
    return this.pattern[voice][step];
  }

  loadPreset(name: string) {
    const preset = PRESETS.find((p) => p.name === name);
    const next = emptyPattern();
    if (preset) {
      for (const v of VOICES) {
        for (const s of preset.steps[v.id]) next[v.id][s] = true;
      }
    }
    this.pattern = next;
  }

  private ensureCtx() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    const AC: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    comp.connect(this.ctx.destination);
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(comp);
    // shared white-noise buffer
    const len = this.ctx.sampleRate * 2;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  private noise(t: number, dur: number, filterType: BiquadFilterType, freq: number, gain: number, q = 1) {
    if (!this.ctx || !this.master || !this.noiseBuf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  private kick(t: number) {
    if (!this.ctx || !this.master) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.11);
    g.gain.setValueAtTime(1.0, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.5);
  }

  private snare(t: number) {
    if (!this.ctx || !this.master) return;
    this.noise(t, 0.22, "bandpass", 1900, 0.7, 0.9);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(190, t);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.12);
  }

  private clap(t: number) {
    for (let i = 0; i < 3; i++) {
      this.noise(t + i * 0.012, 0.16, "bandpass", 1300, 0.55, 1.4);
    }
  }

  private bass(t: number, step: number) {
    if (!this.ctx || !this.master) return;
    const midi = BASS_RIFF[step % STEPS];
    if (!midi) return;
    const o = this.ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = midiToFreq(midi);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(220, t + 0.2);
    f.Q.value = 9;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    o.connect(f).connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.3);
  }

  private scheduleStep(step: number, t: number) {
    const p = this.pattern;
    if (p.kick[step]) this.kick(t);
    if (p.snare[step]) this.snare(t);
    if (p.clap[step]) this.clap(t);
    if (p.chat[step]) this.noise(t, 0.05, "highpass", 7800, 0.32);
    if (p.ohat[step]) this.noise(t, 0.34, "highpass", 7600, 0.3);
    if (p.bass[step]) this.bass(t, step);
  }

  play() {
    this.ensureCtx();
    if (!this.ctx || this.timer) return;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => {
      if (!this.ctx) return;
      const stepDur = 60 / this.bpm / 4;
      while (this.nextTime < this.ctx.currentTime + 0.12) {
        this.scheduleStep(this.step, this.nextTime);
        const s = this.step;
        // fire the UI callback roughly on the beat, not ahead of it
        const delay = Math.max(0, (this.nextTime - this.ctx.currentTime) * 1000);
        setTimeout(() => this.onStep(s), delay);
        this.nextTime += stepDur;
        this.step = (this.step + 1) % STEPS;
      }
    }, 25);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.onStep(-1);
  }
}
