'use client';

import { useState, useEffect, useCallback } from 'react';
import MatrixBackground from './MatrixBackground';
import HelmetScene from './HelmetScene';
import useClapDetector from './useClapDetector';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [started, setStarted] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const { detected, clapCount, startListening } = useClapDetector({
    requiredClaps: 2,
    enabled: started,
  });

  // Handle click-to-start
  const handleStart = useCallback(() => {
    setStarted(true);
    startListening();
  }, [startListening]);

  // Handle model loaded callback
  const handleModelLoaded = useCallback(() => {
    setModelLoaded(true);
  }, []);

  // Handle load progress callback
  const handleLoadProgress = useCallback((pct: number) => {
    setLoadProgress(pct);
  }, []);

  // Show fallback button after 5 seconds once started
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(timer);
  }, [started]);

  // Handle clap detection
  useEffect(() => {
    if (detected && !exiting) {
      handleExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detected]);

  // Exit handler
  const handleExit = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onComplete(), 800);
  }, [exiting, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-[800ms] ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: '#050508' }}
    >
      {/* Matrix rain background */}
      <MatrixBackground />

      {/* 3D Helmet scene */}
      <HelmetScene
        started={started}
        onModelLoaded={handleModelLoaded}
        loadProgress={handleLoadProgress}
      />

      {/* Click-to-start overlay */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-all duration-[1200ms] ${
          started
            ? 'opacity-0 invisible pointer-events-none'
            : 'opacity-100 visible'
        }`}
        style={{ background: 'rgba(3,3,6,0.92)' }}
        onClick={handleStart}
      >
        <div className="w-[72px] h-[72px] border-[1.5px] border-white/[0.12] rounded-full flex items-center justify-center transition-all duration-300 hover:border-[#00d4ff]/50 hover:scale-[1.08] group">
          <div
            className="ml-1"
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '10px 0 10px 18px',
              borderColor: 'transparent transparent transparent rgba(255,255,255,0.4)',
            }}
          />
        </div>
        <p className="text-[0.8rem] text-[#555] tracking-[0.14em] uppercase mt-6">
          Click para iniciar
        </p>
      </div>

      {/* Loading bar */}
      <div
        className={`fixed z-[90] text-center pointer-events-none transition-opacity duration-[800ms] ${
          !started || modelLoaded ? 'opacity-0 invisible' : 'opacity-100'
        }`}
        style={{
          bottom: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
        }}
      >
        <div className="text-[0.6rem] text-white/[0.25] tracking-[0.15em] uppercase">
          Cargando modelo
        </div>
        <div className="w-full h-[2px] bg-white/[0.06] rounded-[1px] overflow-hidden mt-3">
          <div
            className="h-full transition-[width] duration-200"
            style={{
              width: `${loadProgress}%`,
              background: 'linear-gradient(90deg, #00d4ff, #d4a853)',
            }}
          />
        </div>
        <div className="text-[0.55rem] text-white/[0.2] mt-1.5">
          {loadProgress}%
        </div>
      </div>

      {/* Text overlay */}
      <div
        className="fixed left-0 right-0 z-10 text-center pointer-events-none flex flex-col items-center justify-start"
        style={{ top: '58vh', bottom: 0, paddingTop: '2rem' }}
      >
        {/* Welcome text */}
        <p
          className={`font-serif text-[0.9rem] tracking-[0.08em] opacity-0 ${
            started ? 'animate-fade-up [animation-delay:2.6s]' : ''
          }`}
          style={{ color: 'rgba(240,237,230,0.5)' }}
        >
          Bienvenido al laboratorio de
        </p>

        {/* Name */}
        <h1
          className={`text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-[-0.02em] my-1 opacity-0 ${
            started ? 'animate-fade-up [animation-delay:2.9s]' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #d4a853, #f0c66e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Jose Da Luz
        </h1>

        {/* Subtitle */}
        <p
          className={`text-[0.85rem] tracking-[0.15em] uppercase font-light opacity-0 ${
            started ? 'animate-fade-up [animation-delay:3.2s]' : ''
          }`}
          style={{ color: 'rgba(240,237,230,0.4)' }}
        >
          INGENIERO EN SOFTWARE
        </p>

        {/* Divider */}
        <div
          className={`w-10 h-px mx-auto my-4 opacity-0 ${
            started ? 'animate-fade-up [animation-delay:3.5s]' : ''
          }`}
          style={{
            background:
              'linear-gradient(90deg, transparent, #d4a853, transparent)',
          }}
        />

        {/* Clap area */}
        <div
          className={`flex items-center justify-center gap-3 opacity-0 pointer-events-auto ${
            started ? 'animate-fade-up [animation-delay:3.8s]' : ''
          }`}
        >
          {/* Left clap icon */}
          <div
            className={`text-[1.8rem] w-[52px] h-[52px] flex items-center justify-center rounded-full border-[1.5px] ${
              clapCount >= 1
                ? 'border-[#00d4ff] bg-[#00d4ff]/10 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                : 'border-[rgba(212,168,83,0.3)] bg-[rgba(212,168,83,0.05)] animate-bounce-subtle'
            } transition-all duration-300`}
          >
            <span role="img" aria-label="clap">👏</span>
          </div>

          {/* Clap text */}
          <span
            className="text-[0.7rem] tracking-[0.08em] uppercase"
            style={{ color: 'rgba(240,237,230,0.4)' }}
          >
            APLAUD&Iacute; DOS VECES PARA VER SUS PROYECTOS
          </span>

          {/* Right clap icon */}
          <div
            className={`text-[1.8rem] w-[52px] h-[52px] flex items-center justify-center rounded-full border-[1.5px] ${
              clapCount >= 2
                ? 'border-[#00d4ff] bg-[#00d4ff]/10 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                : 'border-[rgba(212,168,83,0.3)] bg-[rgba(212,168,83,0.05)] animate-bounce-subtle [animation-delay:0.4s]'
            } transition-all duration-300`}
          >
            <span role="img" aria-label="clap">👏</span>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className={`inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase mt-2.5 opacity-0 ${
            started ? 'animate-fade-up [animation-delay:4.1s]' : ''
          }`}
          style={{ color: '#00d4ff' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
          ESCUCHANDO
        </div>

        {/* Fallback button */}
        <button
          onClick={handleExit}
          className={`mt-4 text-[0.7rem] tracking-[0.08em] uppercase pointer-events-auto transition-all duration-500 border-none bg-transparent cursor-pointer hover:text-white/60 ${
            showFallback && started
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          style={{ color: 'rgba(240,237,230,0.3)' }}
        >
          Continuar sin micr&oacute;fono &rarr;
        </button>
      </div>
    </div>
  );
}
