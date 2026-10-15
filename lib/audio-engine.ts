/**
 * Singleton audio engine: one HTMLAudioElement + one WebAudio graph.
 * Provides a shared AnalyserNode for visualizers, a vinyl-crackle synth,
 * and scratch-friendly playbackRate control. No audio files required
 * beyond the track mp3s themselves.
 */

type Listener = () => void;

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const CLAMP_RATE = { min: 0.05, max: 3 };

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private freq: Uint8Array<ArrayBuffer> | null = null;
  private crackleGain: GainNode | null = null;
  private listeners = new Set<Listener>();
  private srcs: string[] = [];

  trackIndex = -1;
  isPlaying = false;
  progress = 0;
  duration = 0;
  durations: number[] = [];

  setQueue(srcs: string[]): void {
    this.srcs = srcs;
    this.durations = new Array(srcs.length).fill(0);
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn());
  }

  private absoluteSrc(src: string): string {
    return new URL(src, window.location.href).href;
  }

  private ensure(): boolean {
    if (typeof window === "undefined") return false;
    if (!this.audio) {
      const a = new Audio();
      a.preload = "metadata";
      a.addEventListener("play", () => {
        this.isPlaying = true;
        this.emit();
      });
      a.addEventListener("pause", () => {
        this.isPlaying = false;
        this.emit();
      });
      a.addEventListener("ended", () => {
        this.next();
      });
      a.addEventListener("timeupdate", () => {
        if (a.duration > 0) this.progress = a.currentTime / a.duration;
        this.emit();
      });
      a.addEventListener("loadedmetadata", () => {
        this.duration = Number.isFinite(a.duration) ? a.duration : 0;
        if (this.trackIndex >= 0) this.durations[this.trackIndex] = this.duration;
        this.emit();
      });
      this.audio = a;
    }
    if (!this.ctx) {
      const w = window as unknown as WindowWithWebkitAudio;
      const AC = window.AudioContext ?? w.webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        const srcNode = this.ctx.createMediaElementSource(this.audio);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.82;
        srcNode.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.freq = new Uint8Array(this.analyser.frequencyBinCount);
        this.startCrackle();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return true;
  }

  /** Looped filtered-noise vinyl crackle, gain-driven. */
  private startCrackle(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // sparse pops over soft hiss
      data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.0012 ? 1 : 0.015);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 4200;
    bp.Q.value = 0.7;
    this.crackleGain = ctx.createGain();
    this.crackleGain.gain.value = 0;
    noise.connect(bp);
    bp.connect(this.crackleGain);
    this.crackleGain.connect(ctx.destination);
    noise.start();
  }

  setCrackle(on: boolean): void {
    if (!this.ctx || !this.crackleGain) return;
    this.crackleGain.gain.setTargetAtTime(on ? 0.022 : 0, this.ctx.currentTime, 0.5);
  }

  playTrack(index: number): void {
    if (!this.ensure() || !this.audio) return;
    const count = this.srcs.length;
    if (count === 0) return;
    this.trackIndex = ((index % count) + count) % count;
    const src = this.srcs[this.trackIndex];
    if (this.audio.src !== this.absoluteSrc(src)) {
      this.audio.src = src;
      this.progress = 0;
      this.duration = this.durations[this.trackIndex] || 0;
    }
    this.audio.playbackRate = 1;
    void this.audio.play().catch(() => {
      /* autoplay policy — user gesture required */
    });
    this.setCrackle(true);
    this.emit();
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.setCrackle(false);
    this.emit();
  }

  toggle(index?: number): void {
    if (typeof index === "number" && index !== this.trackIndex) {
      this.playTrack(index);
      return;
    }
    if (this.trackIndex < 0) {
      this.playTrack(0);
      return;
    }
    if (this.isPlaying) this.pause();
    else {
      if (this.ensure() && this.audio) {
        void this.audio.play().catch(() => {});
        this.setCrackle(true);
      }
    }
  }

  next(): void {
    this.playTrack(this.trackIndex + 1);
  }

  prev(): void {
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    this.playTrack(this.trackIndex - 1);
  }

  seek(ratio: number): void {
    if (!this.audio || !this.duration) return;
    const r = Math.min(0.999, Math.max(0, ratio));
    this.audio.currentTime = r * this.duration;
    this.progress = r;
    this.emit();
  }

  /** Scratch-friendly playback rate. */
  setRate(rate: number): void {
    if (!this.audio) return;
    this.audio.playbackRate = Math.min(CLAMP_RATE.max, Math.max(CLAMP_RATE.min, rate));
  }

  /** Normalized 0..1 frequency buckets for visualizers. */
  levels(buckets: number): number[] {
    const out = new Array<number>(buckets).fill(0);
    if (!this.analyser || !this.freq) return out;
    this.analyser.getByteFrequencyData(this.freq);
    const usable = Math.min(this.freq.length, 48);
    const per = Math.max(1, Math.floor(usable / buckets));
    for (let b = 0; b < buckets; b++) {
      let sum = 0;
      let n = 0;
      for (let i = b * per; i < Math.min((b + 1) * per, usable); i++) {
        sum += this.freq[i] / 255;
        n++;
      }
      out[b] = n > 0 ? sum / n : 0;
    }
    return out;
  }
}

export const audioEngine = new AudioEngine();
