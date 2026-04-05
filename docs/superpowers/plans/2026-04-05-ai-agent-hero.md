# AI Agent Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the working mockup (`mockups/option-face-3d.html`) into a Next.js splash screen that shows a 3D Iron Man helmet greeting visitors, then reveals the portfolio on clap/click.

**Architecture:** SplashScreen is a client-side component that wraps the existing portfolio. It renders a fullscreen overlay with Three.js (helmet), canvas (matrix bg), and audio. On clap detection or button click, it unmounts and reveals the portfolio. Three.js resources are fully disposed on unmount.

**Tech Stack:** Next.js 14 (App Router), React 18, Three.js, TypeScript, Tailwind CSS

**Reference mockup:** `mockups/option-face-3d.html` (416 lines, fully working)

---

### Task 1: Install dependencies and move assets

**Files:**
- Modify: `package.json`
- Create: `public/models/iron_man_helmet.glb` (move from mockups/)
- Create: `public/audio/saludo.mp3` (move from mockups/)

- [ ] **Step 1: Install Three.js**

```bash
cd C:\Users\PC\jose\portafolio
npm install three @types/three
```

- [ ] **Step 2: Move assets to public/**

```bash
mkdir -p public/models public/audio
cp mockups/iron_man_helmet.glb public/models/
cp mockups/saludo.mp3 public/audio/
```

- [ ] **Step 3: Verify assets are accessible**

```bash
ls -la public/models/iron_man_helmet.glb public/audio/saludo.mp3
```

Expected: both files exist (4.3MB glb, ~120KB mp3)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json public/models/ public/audio/
git commit -m "chore: add three.js dependency and 3D model + audio assets"
```

---

### Task 2: Create MatrixBackground component

**Files:**
- Create: `app/components/SplashScreen/MatrixBackground.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/SplashScreen/MatrixBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = '01アイウエオカキクケコ:;{}[]<>/=+*#@'.split('');
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    }
    init();
    window.addEventListener('resize', init);

    function draw() {
      ctx!.fillStyle = 'rgba(3, 3, 6, 0.06)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.font = fontSize + 'px monospace';

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        if (brightness > 0.97) {
          ctx!.fillStyle = '#ffffff';
        } else if (brightness > 0.9) {
          ctx!.fillStyle = 'rgba(0, 212, 255, 0.9)';
        } else {
          ctx!.fillStyle = 'rgba(0, 100, 140, 0.25)';
        }

        ctx!.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/SplashScreen/MatrixBackground.tsx
git commit -m "feat: add MatrixBackground canvas component"
```

---

### Task 3: Create HelmetScene component

**Files:**
- Create: `app/components/SplashScreen/HelmetScene.tsx`

This is the largest component — the Three.js scene with the 3D helmet, lighting, eye fills, audio sync, mouse follow, and assembly animation. Ported directly from the working mockup.

- [ ] **Step 1: Create the component**

```tsx
// app/components/SplashScreen/HelmetScene.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface HelmetSceneProps {
  started: boolean;
  onModelLoaded?: () => void;
  loadProgress?: (pct: number) => void;
}

export function HelmetScene({ started, onModelLoaded, loadProgress }: HelmetSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    headGroup: THREE.Group;
    leftEyeFill: THREE.Mesh;
    rightEyeFill: THREE.Mesh;
    leftEyeLight: THREE.PointLight;
    rightEyeLight: THREE.PointLight;
    envMap: THREE.Texture;
    clock: THREE.Clock;
    animId: number;
    modelLoaded: boolean;
    modelReady: boolean;
    assemblyProgress: number;
    time: number;
    mouseX: number;
    mouseY: number;
    isSpeaking: boolean;
    wordPulse: number;
    audio: HTMLAudioElement;
    audioCtx: AudioContext | null;
    analyser: AnalyserNode | null;
    dataArray: Uint8Array | null;
    disposed: boolean;
  } | null>(null);

  const startedRef = useRef(started);
  startedRef.current = started;

  const initScene = useCallback(() => {
    const container = containerRef.current;
    if (!container || sceneRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1, 100
    );
    camera.position.set(0, 0.3, 5.0);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    container.appendChild(renderer.domElement);

    // Environment map
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x111122);
    [
      { color: 0x4488ff, intensity: 80, pos: [5, 5, 5] as [number, number, number] },
      { color: 0xff6633, intensity: 60, pos: [-5, 3, -3] as [number, number, number] },
      { color: 0x22ddee, intensity: 70, pos: [0, -4, 5] as [number, number, number] },
      { color: 0xffffff, intensity: 40, pos: [3, -2, -5] as [number, number, number] },
      { color: 0x8844ff, intensity: 50, pos: [-3, 5, 0] as [number, number, number] },
    ].forEach(l => {
      const p = new THREE.PointLight(l.color, l.intensity, 0);
      p.position.set(...l.pos);
      envScene.add(p);
    });
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    pmrem.dispose();

    // Lighting
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    scene.add(new THREE.HemisphereLight(0x8899cc, 0x443322, 0.8));

    const key = new THREE.DirectionalLight(0xffeedd, 2.0);
    key.position.set(3, 4, 3);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3366cc, 0.8);
    fill.position.set(-4, 1, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x00ddff, 1.2);
    rim.position.set(0, 2, -5);
    scene.add(rim);

    const front = new THREE.DirectionalLight(0xddeeff, 1.0);
    front.position.set(0, 0.5, 5);
    scene.add(front);

    // Head group
    const headGroup = new THREE.Group();
    headGroup.scale.setScalar(0);
    scene.add(headGroup);

    // Eye fills
    const eyeBoxGeo = new THREE.BoxGeometry(0.42, 0.11, 0.02);
    const eyeFillMatL = new THREE.MeshBasicMaterial({ color: 0x55ccff, transparent: true, opacity: 0.1 });
    const eyeFillMatR = new THREE.MeshBasicMaterial({ color: 0x55ccff, transparent: true, opacity: 0.1 });
    const leftEyeFill = new THREE.Mesh(eyeBoxGeo, eyeFillMatL);
    const rightEyeFill = new THREE.Mesh(eyeBoxGeo, eyeFillMatR);
    leftEyeFill.position.set(-0.22, 0.08, 0.43);
    rightEyeFill.position.set(0.22, 0.08, 0.43);
    leftEyeFill.rotation.z = 0.05;
    rightEyeFill.rotation.z = -0.05;

    const leftEyeLight = new THREE.PointLight(0x44ccff, 0.3, 3);
    leftEyeLight.position.set(-0.22, 0.10, 0.5);
    const rightEyeLight = new THREE.PointLight(0x44ccff, 0.3, 3);
    rightEyeLight.position.set(0.22, 0.10, 0.5);

    headGroup.add(leftEyeFill, rightEyeFill, leftEyeLight, rightEyeLight);

    // Audio
    const audio = new Audio('/audio/saludo.mp3');

    // State ref
    const state = {
      renderer, scene, camera, headGroup,
      leftEyeFill, rightEyeFill, leftEyeLight, rightEyeLight,
      envMap, clock: new THREE.Clock(),
      animId: 0, modelLoaded: false, modelReady: false,
      assemblyProgress: 0, time: 0,
      mouseX: 0, mouseY: 0,
      isSpeaking: false, wordPulse: 0,
      audio, audioCtx: null as AudioContext | null,
      analyser: null as AnalyserNode | null,
      dataArray: null as Uint8Array | null,
      disposed: false,
    };
    sceneRef.current = state;

    // Mouse follow (desktop only)
    if (!isMobile) {
      const onMouse = (e: MouseEvent) => {
        state.mouseX = (e.clientX / innerWidth - 0.5) * 2;
        state.mouseY = (e.clientY / innerHeight - 0.5) * 2;
      };
      document.addEventListener('mousemove', onMouse);
    }

    // Load model
    new GLTFLoader().load('/models/iron_man_helmet.glb', (gltf) => {
      if (state.disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const sc = 2.2 / Math.max(size.x, size.y, size.z);

      model.scale.setScalar(sc);
      model.position.set(-center.x * sc, -center.y * sc, -center.z * sc);

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.metalness = 0.85;
            mat.roughness = 0.2;
            mat.envMap = envMap;
            mat.envMapIntensity = 1.5;
            mat.side = THREE.DoubleSide;
            mat.needsUpdate = true;
          }
        }
      });

      headGroup.add(model);
      state.modelLoaded = true;
      onModelLoaded?.();
    }, (xhr) => {
      if (xhr.lengthComputable) {
        loadProgress?.(Math.round((xhr.loaded / xhr.total) * 100));
      }
    });

    // Easing
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    // Animation loop
    function animate() {
      if (state.disposed) return;
      state.animId = requestAnimationFrame(animate);
      const dt = state.clock.getDelta();
      state.time += dt;

      if (!startedRef.current) {
        renderer.render(scene, camera);
        return;
      }

      // Assembly
      if (state.modelLoaded && state.assemblyProgress < 1) {
        state.assemblyProgress = Math.min(1, state.assemblyProgress + dt * 0.5);
        const t = easeOutCubic(state.assemblyProgress);
        camera.position.z = 9 - (9 - 5.0) * t;
        camera.position.y = 0.3;
        camera.lookAt(0, 0, 0);
        headGroup.scale.setScalar(t);

        if (state.assemblyProgress > 0.85) {
          const flash = (state.assemblyProgress - 0.85) / 0.15;
          leftEyeLight.intensity = flash * 4.0;
          rightEyeLight.intensity = flash * 4.0;
        }
      } else if (state.modelLoaded) {
        state.modelReady = true;
      }

      // Idle (after assembly)
      if (state.modelReady) {
        // Mouse follow (or gentle idle on mobile)
        const fx = isMobile ? Math.sin(state.time * 0.3) * 0.15 : state.mouseX * 0.2;
        const fy = isMobile ? Math.sin(state.time * 0.2) * 0.05 : state.mouseY * 0.1;
        headGroup.rotation.y += (fx - headGroup.rotation.y) * 0.025;
        headGroup.rotation.x += (fy - headGroup.rotation.x) * 0.025;

        // Float
        headGroup.position.y = Math.sin(state.time * 0.7) * 0.03;

        // Eyes
        if (state.isSpeaking) {
          const wp = Math.min(1, state.wordPulse);
          const targetOp = 0.95;
          const targetInt = 6.0 + wp * 2.0;
          leftEyeFill.material.opacity += (targetOp - leftEyeFill.material.opacity) * 0.2;
          rightEyeFill.material.opacity += (targetOp - rightEyeFill.material.opacity) * 0.2;
          (leftEyeFill.material as THREE.MeshBasicMaterial).color.setHex(0x88eeff);
          (rightEyeFill.material as THREE.MeshBasicMaterial).color.setHex(0x88eeff);
          leftEyeLight.intensity += (targetInt - leftEyeLight.intensity) * 0.15;
          rightEyeLight.intensity += (targetInt - rightEyeLight.intensity) * 0.15;
          state.wordPulse *= 0.88;
        } else {
          const p = 0.12 + Math.sin(state.time * 1.0) * 0.08;
          const lp = 0.3 + Math.sin(state.time * 1.0) * 0.2;
          leftEyeFill.material.opacity += (p - leftEyeFill.material.opacity) * 0.04;
          rightEyeFill.material.opacity += (p - rightEyeFill.material.opacity) * 0.04;
          (leftEyeFill.material as THREE.MeshBasicMaterial).color.setHex(0x55ccff);
          (rightEyeFill.material as THREE.MeshBasicMaterial).color.setHex(0x55ccff);
          leftEyeLight.intensity += (lp - leftEyeLight.intensity) * 0.04;
          rightEyeLight.intensity += (lp - rightEyeLight.intensity) * 0.04;
        }
      }

      // Audio pulse
      if (state.isSpeaking && state.analyser && state.dataArray) {
        state.analyser.getByteFrequencyData(state.dataArray);
        let sum = 0;
        for (let i = 2; i < 25; i++) sum += state.dataArray[i];
        const avg = sum / 23 / 255;
        state.wordPulse = avg > 0.1 ? avg * 1.5 : 0;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const onResize = () => {
      if (!container || state.disposed) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onModelLoaded, loadProgress]);

  // Init on mount
  useEffect(() => {
    const cleanup = initScene();
    return () => {
      cleanup?.();
      const s = sceneRef.current;
      if (s) {
        s.disposed = true;
        cancelAnimationFrame(s.animId);
        s.renderer.dispose();
        s.scene.clear();
        s.audio.pause();
        if (s.audioCtx) s.audioCtx.close();
        sceneRef.current = null;
      }
    };
  }, [initScene]);

  // Speak when started
  useEffect(() => {
    if (!started) return;
    const s = sceneRef.current;
    if (!s) return;

    const speakTimeout = setTimeout(() => {
      if (!s.audioCtx) {
        s.audioCtx = new AudioContext();
        s.analyser = s.audioCtx.createAnalyser();
        s.analyser.fftSize = 256;
        s.analyser.smoothingTimeConstant = 0.7;
        const source = s.audioCtx.createMediaElementSource(s.audio);
        source.connect(s.analyser);
        s.analyser.connect(s.audioCtx.destination);
        s.dataArray = new Uint8Array(s.analyser.frequencyBinCount);
      }
      if (s.audioCtx.state === 'suspended') s.audioCtx.resume();
      s.audio.currentTime = 0;
      s.audio.play();
      s.isSpeaking = true;
      s.audio.onended = () => { s.isSpeaking = false; s.wordPulse = 0; };
    }, 2500);

    return () => clearTimeout(speakTimeout);
  }, [started]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-[2]"
      style={{ height: '58vh' }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/SplashScreen/HelmetScene.tsx
git commit -m "feat: add HelmetScene Three.js component with audio sync"
```

---

### Task 4: Create ClapDetector hook

**Files:**
- Create: `app/components/SplashScreen/useClapDetector.ts`

- [ ] **Step 1: Create the hook**

```tsx
// app/components/SplashScreen/useClapDetector.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseClapDetectorOptions {
  requiredClaps: number;
  clapWindow: number;    // ms — time window for all claps
  cooldown: number;      // ms — minimum time between claps
  enabled: boolean;
}

export function useClapDetector({
  requiredClaps = 2,
  clapWindow = 2000,
  cooldown = 400,
  enabled = true,
}: Partial<UseClapDetectorOptions> = {}) {
  const [detected, setDetected] = useState(false);
  const [clapCount, setClapCount] = useState(0);
  const [micAvailable, setMicAvailable] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const startListening = useCallback(async () => {
    if (!enabled || detected) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicAvailable(true);

      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const clapTimes: number[] = [];
      let lastClapTime = 0;

      function detect() {
        if (!enabled) return;
        analyser.getByteFrequencyData(dataArray);

        // Check energy in clap frequency range (2-8kHz, bins ~23-93 for 512 FFT at 48kHz)
        let energy = 0;
        for (let i = 23; i < 93; i++) energy += dataArray[i];
        energy /= 70;

        const now = Date.now();
        if (energy > 120 && now - lastClapTime > cooldown) {
          lastClapTime = now;
          // Remove old claps outside window
          while (clapTimes.length > 0 && now - clapTimes[0] > clapWindow) {
            clapTimes.shift();
          }
          clapTimes.push(now);
          setClapCount(clapTimes.length);

          if (clapTimes.length >= requiredClaps) {
            setDetected(true);
            cleanup();
            return;
          }
        }
        requestAnimationFrame(detect);
      }
      detect();
    } catch {
      setMicAvailable(false);
    }
  }, [enabled, detected, requiredClaps, clapWindow, cooldown]);

  function cleanup() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }

  useEffect(() => {
    return cleanup;
  }, []);

  return { detected, clapCount, micAvailable, startListening };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/SplashScreen/useClapDetector.ts
git commit -m "feat: add useClapDetector hook for microphone clap detection"
```

---

### Task 5: Create SplashScreen component

**Files:**
- Create: `app/components/SplashScreen/SplashScreen.tsx`
- Create: `app/components/SplashScreen/index.ts`

- [ ] **Step 1: Create the SplashScreen**

```tsx
// app/components/SplashScreen/SplashScreen.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { MatrixBackground } from './MatrixBackground';
import { HelmetScene } from './HelmetScene';
import { useClapDetector } from './useClapDetector';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [started, setStarted] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [exiting, setExiting] = useState(false);

  const { detected, clapCount, micAvailable, startListening } = useClapDetector({
    enabled: started,
  });

  // Start listening for claps after user clicks start
  useEffect(() => {
    if (started) startListening();
  }, [started, startListening]);

  // Clap detected → exit
  useEffect(() => {
    if (detected) handleExit();
  }, [detected]);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const handleExit = useCallback(() => {
    setExiting(true);
    setTimeout(() => onComplete(), 800);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-700 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <MatrixBackground />

      <HelmetScene
        started={started}
        onModelLoaded={() => setModelReady(true)}
        loadProgress={setLoadPct}
      />

      {/* Click-to-start overlay */}
      {!started && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(3,3,6,0.92)] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000"
          onClick={handleStart}
        >
          <div className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:scale-105 transition-all">
            <div className="w-0 h-0 ml-1 border-l-[18px] border-y-[10px] border-l-white/40 border-y-transparent" />
          </div>
          <p className="text-xs text-white/30 tracking-[0.14em] uppercase mt-6">
            Click para iniciar
          </p>
        </div>
      )}

      {/* Loading bar */}
      {started && !modelReady && (
        <div className="fixed bottom-[40%] left-1/2 -translate-x-1/2 z-[90] w-[200px] text-center pointer-events-none">
          <p className="text-[0.6rem] text-white/25 tracking-[0.15em] uppercase">
            Cargando modelo
          </p>
          <div className="w-full h-[2px] bg-white/5 rounded mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-500 rounded transition-all duration-200"
              style={{ width: `${loadPct}%` }}
            />
          </div>
          <p className="text-[0.55rem] text-white/20 mt-1.5">{loadPct}%</p>
        </div>
      )}

      {/* Text overlay — bottom section */}
      <div className="fixed bottom-0 left-0 right-0 top-[58vh] z-10 text-center pt-8 flex flex-col items-center justify-start pointer-events-none">
        <p className="font-serif text-sm text-white/40 tracking-wider animate-fade-up [animation-delay:2.6s] opacity-0">
          Bienvenido al laboratorio de
        </p>
        <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight bg-gradient-to-br from-[#d4a853] to-[#f0c66e] bg-clip-text text-transparent mt-1 mb-1 animate-fade-up [animation-delay:2.9s] opacity-0">
          Jose Da Luz
        </h1>
        <p className="text-sm text-white/35 tracking-[0.15em] uppercase font-light animate-fade-up [animation-delay:3.2s] opacity-0">
          INGENIERO EN SOFTWARE
        </p>
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent my-4 animate-fade-up [animation-delay:3.5s] opacity-0" />

        <div className="flex items-center gap-3 animate-fade-up [animation-delay:3.8s] opacity-0">
          <div className={`text-3xl w-[52px] h-[52px] flex items-center justify-center rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 animate-bounce-subtle ${clapCount >= 1 ? 'border-cyan-400 bg-cyan-400/10' : ''}`}>
            👏
          </div>
          <span className="text-[0.7rem] text-white/40 tracking-wider uppercase">
            Aplaudí dos veces para ver sus proyectos
          </span>
          <div className={`text-3xl w-[52px] h-[52px] flex items-center justify-center rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 animate-bounce-subtle [animation-delay:0.4s] ${clapCount >= 2 ? 'border-cyan-400 bg-cyan-400/10' : ''}`}>
            👏
          </div>
        </div>

        <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-cyan-400 uppercase mt-2 animate-fade-up [animation-delay:4.1s] opacity-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ESCUCHANDO
        </div>

        {/* Fallback button for users without microphone */}
        <button
          onClick={handleExit}
          className="pointer-events-auto mt-4 text-[0.7rem] text-white/30 hover:text-white/60 tracking-wider uppercase transition-colors animate-fade-up [animation-delay:5s] opacity-0"
        >
          Continuar sin micrófono →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create barrel export**

```tsx
// app/components/SplashScreen/index.ts
export { SplashScreen } from './SplashScreen';
```

- [ ] **Step 3: Add custom animations to tailwind.config.ts**

Add these to the `extend.keyframes` and `extend.animation` sections in `tailwind.config.ts`:

```ts
// Inside theme.extend:
keyframes: {
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(12px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'bounce-subtle': {
    '0%, 100%': { borderColor: 'rgba(212,168,83,0.2)', transform: 'scale(1)' },
    '50%': { borderColor: 'rgba(212,168,83,0.5)', transform: 'scale(1.08)' },
  },
},
animation: {
  'fade-up': 'fade-up 0.8s ease forwards',
  'bounce-subtle': 'bounce-subtle 2.5s ease-in-out infinite',
},
```

- [ ] **Step 4: Commit**

```bash
git add app/components/SplashScreen/
git commit -m "feat: add SplashScreen component with clap detection and fallback button"
```

---

### Task 6: Wire up page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Modify page.tsx**

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Stack } from "./components/Stack";
import { Certs } from "./components/Certs";
import { Footer } from "./components/Footer";

// Dynamic import — Three.js must not SSR
const SplashScreen = dynamic(
  () => import('./components/SplashScreen').then(m => ({ default: m.SplashScreen })),
  { ssr: false }
);

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <>
      {!showPortfolio && (
        <SplashScreen onComplete={() => setShowPortfolio(true)} />
      )}
      {showPortfolio && (
        <>
          <Nav />
          <main>
            <Hero />
            <Projects />
            <Services />
            <Stack />
            <Certs />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify dev server runs**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: click-to-start → helmet assembles → audio plays → eyes glow → clap or click "Continuar" → portfolio appears.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire SplashScreen as intro gate before portfolio"
```

---

### Task 7: Test mobile responsiveness

**Files:** No file changes — testing only

- [ ] **Step 1: Test on Chrome DevTools mobile emulation**

Open Chrome DevTools → Toggle device toolbar → Select iPhone 14 Pro / Galaxy S21.

Verify:
- Matrix background renders
- Helmet loads and displays (smaller on mobile)
- Helmet does gentle idle rotation (no mouse follow on mobile)
- Audio plays after click
- "Continuar sin micrófono" button is accessible
- Text is readable, not overlapping helmet
- Click-to-start works with touch

- [ ] **Step 2: Fix any layout issues found**

Common fixes if needed:
- Adjust `58vh` split to `50vh` on mobile via Tailwind `md:` prefix
- Reduce helmet scale on mobile
- Increase button tap target size

---

### Task 8: Final cleanup

**Files:**
- Delete: `mockups/option-face-3d.html` (no longer needed)
- Delete: `mockups/ironman-source.png` (not used in final)
- Delete: `mockups/test-glb.html` (if still exists)

- [ ] **Step 1: Remove mockup files**

```bash
rm -f mockups/option-face-3d.html mockups/ironman-source.png mockups/test-glb.html
```

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "chore: remove development mockups, implementation complete"
```
