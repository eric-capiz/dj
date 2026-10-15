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
import { TRACKS, type Track } from "./y2k-data";

interface Y2KAudioValue {
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
  levels: (buckets: number) => number[];
}

const Ctx = createContext<Y2KAudioValue | null>(null);

export function Y2KAudioProvider({ children }: { children: React.ReactNode }) {
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    audioEngine.setQueue(TRACKS.map((t) => t.src));
    return audioEngine.subscribe(force);
  }, []);

  const playTrack = useCallback((i: number) => audioEngine.playTrack(i), []);
  const toggleTrack = useCallback((i?: number) => audioEngine.toggle(i), []);
  const next = useCallback(() => audioEngine.next(), []);
  const prev = useCallback(() => audioEngine.prev(), []);
  const seek = useCallback((r: number) => audioEngine.seek(r), []);
  const levels = useCallback((b: number) => audioEngine.levels(b), []);

  const value = useMemo<Y2KAudioValue>(
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
      levels,
    }),
    // Rebuilt on every engine event via `force`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      playTrack, toggleTrack, next, prev, seek, levels,
      audioEngine.trackIndex, audioEngine.isPlaying,
      audioEngine.progress, audioEngine.duration,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useY2KAudio(): Y2KAudioValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useY2KAudio must be used within Y2KAudioProvider");
  return v;
}
