"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TRACKS, type ProTrack } from "./pro-data";

interface PlayerState {
  track: ProTrack;
  index: number;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  queueOpen: boolean;
  durations: Record<string, number>;
  analyser: AnalyserNode | null;
  play: (index?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setQueueOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer(): PlayerState {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const track = TRACKS[index];

  // Lazily create the WebAudio graph (autoplay-safe: only on user gesture).
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audio);
      const an = ctx.createAnalyser();
      an.fftSize = 64;
      an.smoothingTimeConstant = 0.82;
      src.connect(an);
      an.connect(ctx.destination);
      ctxRef.current = ctx;
      sourceRef.current = src;
      analyserRef.current = an;
      setAnalyser(an);
    } catch {
      /* analyser is decorative — playback still works */
    }
  }, []);

  // Preload real durations for every track (metadata only).
  useEffect(() => {
    let cancelled = false;
    TRACKS.forEach((t) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = t.src;
      const onMeta = () => {
        if (!cancelled && Number.isFinite(probe.duration)) {
          setDurations((d) => (d[t.src] === probe.duration ? d : { ...d, [t.src]: probe.duration }));
        }
      };
      probe.addEventListener("loadedmetadata", onMeta);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const play = useCallback(
    (i?: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      ensureGraph();
      if (ctxRef.current?.state === "suspended") void ctxRef.current.resume();
      const nextIndex = i ?? index;
      if (nextIndex !== index) {
        setIndex(nextIndex);
        // src swap happens via effect below; play after
        setTimeout(() => {
          audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        }, 30);
      } else {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    },
    [ensureGraph, index]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      play();
    }
  }, [playing, play]);

  const next = useCallback(() => {
    const n = (index + 1) % TRACKS.length;
    setIndex(n);
    setTimeout(() => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }, 30);
  }, [index]);

  const prev = useCallback(() => {
    const p = (index - 1 + TRACKS.length) % TRACKS.length;
    setIndex(p);
    setTimeout(() => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }, 30);
  }, [index]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(0, seconds), audio.duration);
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (audio) {
      audio.volume = clamped;
      audio.muted = false;
    }
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
  }, [muted]);

  // Keep the <audio> element's src in sync with the index.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audio.src !== new URL(track.src, window.location.href).href) {
      const wasPlaying = playing;
      audio.src = track.src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      if (wasPlaying) {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Volume sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const value = useMemo<PlayerState>(
    () => ({
      track,
      index,
      playing,
      currentTime,
      duration,
      volume,
      muted,
      queueOpen,
      durations,
      analyser,
      play,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      setQueueOpen,
    }),
    [track, index, playing, currentTime, duration, volume, muted, queueOpen, durations, analyser, play, toggle, next, prev, seek, setVolume, toggleMute, setQueueOpen]
  );

  return (
    <PlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => next()}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {children}
    </PlayerContext.Provider>
  );
}
