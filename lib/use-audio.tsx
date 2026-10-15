"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { audioEngine } from "./audio-engine";
import { TRACKS, type Track } from "./data";

interface AudioContextValue {
  tracks: Track[];
  trackIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  durations: number[];
  playTrack: (index: number) => void;
  toggleTrack: (index?: number) => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  setRate: (rate: number) => void;
  levels: (buckets: number) => number[];
}

const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    audioEngine.setQueue(TRACKS.map((t) => t.src));
    return audioEngine.subscribe(force);
  }, []);

  const playTrack = useCallback((index: number) => audioEngine.playTrack(index), []);
  const toggleTrack = useCallback((index?: number) => audioEngine.toggle(index), []);
  const next = useCallback(() => audioEngine.next(), []);
  const prev = useCallback(() => audioEngine.prev(), []);
  const seek = useCallback((ratio: number) => audioEngine.seek(ratio), []);
  const setRate = useCallback((rate: number) => audioEngine.setRate(rate), []);
  const levels = useCallback((buckets: number) => audioEngine.levels(buckets), []);

  const value = useMemo<AudioContextValue>(
    () => ({
      tracks: TRACKS,
      trackIndex: audioEngine.trackIndex,
      currentTrack: audioEngine.trackIndex >= 0 ? TRACKS[audioEngine.trackIndex] : null,
      isPlaying: audioEngine.isPlaying,
      progress: audioEngine.progress,
      duration: audioEngine.duration,
      durations: [...audioEngine.durations],
      playTrack,
      toggleTrack,
      next,
      prev,
      seek,
      setRate,
      levels,
    }),
    // Rebuilt on every engine event via `force`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playTrack, toggleTrack, next, prev, seek, setRate, levels, audioEngine.trackIndex, audioEngine.isPlaying, audioEngine.progress, audioEngine.duration],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAudio must be used within AudioProvider");
  return v;
}
