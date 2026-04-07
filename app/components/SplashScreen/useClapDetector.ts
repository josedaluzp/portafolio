'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseClapDetectorOptions {
  requiredClaps?: number; // default 2
  clapWindow?: number;    // default 2000ms
  cooldown?: number;      // default 400ms
  enabled?: boolean;      // default true
}

function useClapDetector(options?: UseClapDetectorOptions): {
  detected: boolean;
  clapCount: number;
  micAvailable: boolean | null;
  startListening: () => Promise<void>;
} {
  const {
    requiredClaps = 2,
    clapWindow = 2000,
    cooldown = 400,
    enabled = true,
  } = options ?? {};

  const [detected, setDetected] = useState(false);
  const [clapCount, setClapCount] = useState(0);
  const [micAvailable, setMicAvailable] = useState<boolean | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastClapTimeRef = useRef<number>(0);
  const clapTimestampsRef = useRef<number[]>([]);
  const detectedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const startListening = useCallback(async () => {
    if (detectedRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicAvailable(true);

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detect = () => {
        if (!analyserRef.current || detectedRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Average energy in bins 23–93 (approximately 2–8 kHz range)
        let sum = 0;
        for (let i = 23; i <= 93; i++) {
          sum += dataArray[i];
        }
        const energy = sum / (93 - 23 + 1);

        const now = Date.now();

        if (energy > 130 && now - lastClapTimeRef.current > cooldown) {
          lastClapTimeRef.current = now;
          clapTimestampsRef.current.push(now);

          // Remove claps outside the detection window
          clapTimestampsRef.current = clapTimestampsRef.current.filter(
            (t) => now - t <= clapWindow
          );

          const count = clapTimestampsRef.current.length;
          setClapCount(count);

          if (count >= requiredClaps) {
            detectedRef.current = true;
            setDetected(true);
            cleanup();
            return;
          }
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      animationFrameRef.current = requestAnimationFrame(detect);
    } catch {
      // Permission denied or device unavailable
      setMicAvailable(false);
    }
  }, [enabled, requiredClaps, clapWindow, cooldown, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { detected, clapCount, micAvailable, startListening };
}

export default useClapDetector;
