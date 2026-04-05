'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface HelmetSceneProps {
  started: boolean;
  onModelLoaded?: () => void;
  loadProgress?: (pct: number) => void;
}

// Easing function
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export default function HelmetScene({ started, onModelLoaded, loadProgress }: HelmetSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // All mutable Three.js / audio state lives in a single ref to avoid stale closures
  const stateRef = useRef<{
    // Three.js core
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    clock: THREE.Clock | null;
    envMap: THREE.Texture | null;

    // Groups & meshes
    headGroup: THREE.Group | null;
    leftEyeFill: THREE.Mesh | null;
    rightEyeFill: THREE.Mesh | null;
    eyeFillMatL: THREE.MeshBasicMaterial | null;
    eyeFillMatR: THREE.MeshBasicMaterial | null;
    leftEyeLight: THREE.PointLight | null;
    rightEyeLight: THREE.PointLight | null;

    // Audio
    audio: HTMLAudioElement | null;
    audioCtx: AudioContext | null;
    analyser: AnalyserNode | null;
    audioSource: MediaElementAudioSourceNode | null;
    dataArray: Uint8Array<ArrayBuffer> | null;

    // Animation state
    started: boolean;
    modelLoaded: boolean;
    modelReady: boolean;
    isSpeaking: boolean;
    wordPulse: number;
    assemblyProgress: number;
    time: number;
    mouseX: number;
    mouseY: number;
    isMobile: boolean;
    animationFrameId: number;
    disposed: boolean;
    audioPlayed: boolean;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    envMap: null,
    headGroup: null,
    leftEyeFill: null,
    rightEyeFill: null,
    eyeFillMatL: null,
    eyeFillMatR: null,
    leftEyeLight: null,
    rightEyeLight: null,
    audio: null,
    audioCtx: null,
    analyser: null,
    audioSource: null,
    dataArray: null,
    started: false,
    modelLoaded: false,
    modelReady: false,
    isSpeaking: false,
    wordPulse: 0,
    assemblyProgress: 0,
    time: 0,
    mouseX: 0,
    mouseY: 0,
    isMobile: false,
    animationFrameId: 0,
    disposed: false,
    audioPlayed: false,
  });

  // Speech function
  const speak = useCallback(() => {
    const s = stateRef.current;
    if (!s.audio || s.disposed || s.audioPlayed) return;

    // Setup audio analyser on first play
    if (!s.audioCtx) {
      try {
        s.audioCtx = new AudioContext();
        s.analyser = s.audioCtx.createAnalyser();
        s.analyser.fftSize = 256;
        s.analyser.smoothingTimeConstant = 0.7;
        s.audioSource = s.audioCtx.createMediaElementSource(s.audio);
        s.audioSource.connect(s.analyser);
        s.analyser.connect(s.audioCtx.destination);
        s.dataArray = new Uint8Array(s.analyser.frequencyBinCount);
      } catch {
        // Audio context creation can fail in some environments
        return;
      }
    }

    if (s.audioCtx.state === 'suspended') {
      s.audioCtx.resume();
    }

    s.audio.currentTime = 0;
    s.audio.play().catch(() => {
      // Autoplay blocked — silently ignore
    });
    s.isSpeaking = true;
    s.audioPlayed = true;

    s.audio.onended = () => {
      s.isSpeaking = false;
      s.wordPulse = 0;
    };
  }, []);

  // Keep started prop in sync with ref
  useEffect(() => {
    const s = stateRef.current;
    const wasStarted = s.started;
    s.started = started;

    if (started && !wasStarted) {
      if (s.camera) {
        s.camera.position.set(0, 0.3, 9);
      }
      s.assemblyProgress = 0;
      s.modelReady = false;

      setTimeout(() => {
        if (!stateRef.current.disposed) {
          speak();
        }
      }, 2500);
    }
  }, [started, speak]);

  // Initialize Three.js scene (once on mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;
    s.disposed = false;
    s.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

    // ── Scene
    const scene = new THREE.Scene();
    s.scene = scene;

    // ── Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.3, 5.0);
    camera.lookAt(0, 0, 0);
    s.camera = camera;

    // ── Renderer (alpha:true for transparent background)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);
    s.renderer = renderer;

    // ── Environment map (metallic reflections)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x111122);

    const envLights: { color: number; intensity: number; pos: [number, number, number] }[] = [
      { color: 0x4488ff, intensity: 80, pos: [5, 5, 5] },
      { color: 0xff6633, intensity: 60, pos: [-5, 3, -3] },
      { color: 0x22ddee, intensity: 70, pos: [0, -4, 5] },
      { color: 0xffffff, intensity: 40, pos: [3, -2, -5] },
      { color: 0x8844ff, intensity: 50, pos: [-3, 5, 0] },
    ];
    envLights.forEach((l) => {
      const p = new THREE.PointLight(l.color, l.intensity, 0);
      p.position.set(...l.pos);
      envScene.add(p);
    });
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    s.envMap = envMap;
    pmrem.dispose();

    // ── Lighting
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

    // ── Head group
    const headGroup = new THREE.Group();
    headGroup.scale.setScalar(0);
    scene.add(headGroup);
    s.headGroup = headGroup;

    // ── Eye fills: wide flat boxes positioned behind the eye slits
    const eyeBoxGeo = new THREE.BoxGeometry(0.42, 0.11, 0.02);

    const eyeFillMatL = new THREE.MeshBasicMaterial({
      color: 0x55ccff,
      transparent: true,
      opacity: 0.1,
    });
    const eyeFillMatR = new THREE.MeshBasicMaterial({
      color: 0x55ccff,
      transparent: true,
      opacity: 0.1,
    });
    s.eyeFillMatL = eyeFillMatL;
    s.eyeFillMatR = eyeFillMatR;

    const leftEyeFill = new THREE.Mesh(eyeBoxGeo, eyeFillMatL);
    const rightEyeFill = new THREE.Mesh(eyeBoxGeo, eyeFillMatR);
    leftEyeFill.position.set(-0.22, 0.08, 0.43);
    rightEyeFill.position.set(0.22, 0.08, 0.43);
    leftEyeFill.rotation.z = 0.05;
    rightEyeFill.rotation.z = -0.05;
    s.leftEyeFill = leftEyeFill;
    s.rightEyeFill = rightEyeFill;

    const leftEyeLight = new THREE.PointLight(0x44ccff, 0.3, 3);
    leftEyeLight.position.set(-0.22, 0.10, 0.5);
    const rightEyeLight = new THREE.PointLight(0x44ccff, 0.3, 3);
    rightEyeLight.position.set(0.22, 0.10, 0.5);
    s.leftEyeLight = leftEyeLight;
    s.rightEyeLight = rightEyeLight;

    headGroup.add(leftEyeFill, rightEyeFill, leftEyeLight, rightEyeLight);

    // ── Audio element
    const audio = new Audio('/audio/saludo.mp3');
    audio.preload = 'auto';
    s.audio = audio;

    // ── Load GLB model
    new GLTFLoader().load(
      '/models/iron_man_helmet.glb',
      (gltf) => {
        if (s.disposed) return;

        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const sc = 2.2 / Math.max(size.x, size.y, size.z);

        // CRITICAL centering formula — model center is at Y~68.9
        model.scale.setScalar(sc);
        model.position.set(-center.x * sc, -center.y * sc, -center.z * sc);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
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
        s.modelLoaded = true;
        onModelLoaded?.();
      },
      (xhr) => {
        if (s.disposed) return;
        if (xhr.lengthComputable) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          loadProgress?.(pct);
        } else {
          // Estimate progress for non-computable loads
          const pct = Math.min(95, Math.round(xhr.loaded / 45000));
          loadProgress?.(pct);
        }
      },
      (err) => {
        console.error('Failed to load Iron Man helmet model:', err);
      }
    );

    // ── Animation functions (closures over s)
    function animateAssembly(dt: number) {
      if (!s.modelLoaded || s.assemblyProgress >= 1) {
        if (s.modelLoaded && s.assemblyProgress >= 1) s.modelReady = true;
        return;
      }
      s.assemblyProgress = Math.min(1, s.assemblyProgress + dt * 0.5);
      const t = easeOutCubic(s.assemblyProgress);

      if (s.camera) {
        s.camera.position.z = 9 - (9 - 5.8) * t;
        s.camera.position.y = 0.5;
        s.camera.lookAt(0, 0, 0);
      }
      if (s.headGroup) {
        s.headGroup.scale.setScalar(t);
      }

      // Eye light flash at end of assembly
      if (s.assemblyProgress > 0.85 && s.leftEyeLight && s.rightEyeLight) {
        const flash = (s.assemblyProgress - 0.85) / 0.15;
        s.leftEyeLight.intensity = flash * 4.0;
        s.rightEyeLight.intensity = flash * 4.0;
      }
    }

    function animateIdle() {
      if (!s.modelReady || !s.headGroup || !s.leftEyeLight || !s.rightEyeLight || !s.eyeFillMatL || !s.eyeFillMatR) return;

      // Mouse follow (desktop) or idle rotation (mobile)
      if (s.isMobile) {
        // Gentle idle rotation on mobile (sin wave)
        const idleY = Math.sin(s.time * 0.5) * 0.15;
        const idleX = Math.sin(s.time * 0.3) * 0.05;
        s.headGroup.rotation.y += (idleY - s.headGroup.rotation.y) * 0.025;
        s.headGroup.rotation.x += (idleX - s.headGroup.rotation.x) * 0.025;
      } else {
        // Follow cursor on desktop
        const fx = s.mouseX * 0.2;
        const fy = s.mouseY * 0.1;
        s.headGroup.rotation.y += (fx - s.headGroup.rotation.y) * 0.025;
        s.headGroup.rotation.x += (fy - s.headGroup.rotation.x) * 0.025;
      }

      // Float
      s.headGroup.position.y = Math.sin(s.time * 0.7) * 0.03;

      // Eye fills + lights — synced to audio volume when speaking
      if (s.isSpeaking) {
        const wp = Math.min(1, s.wordPulse);
        const targetOp = 0.95;
        const targetInt = 6.0 + wp * 2.0;
        s.eyeFillMatL.opacity += (targetOp - s.eyeFillMatL.opacity) * 0.2;
        s.eyeFillMatR.opacity += (targetOp - s.eyeFillMatR.opacity) * 0.2;
        s.eyeFillMatL.color.setHex(0x88eeff);
        s.eyeFillMatR.color.setHex(0x88eeff);
        s.leftEyeLight.intensity += (targetInt - s.leftEyeLight.intensity) * 0.15;
        s.rightEyeLight.intensity += (targetInt - s.rightEyeLight.intensity) * 0.15;
        s.wordPulse *= 0.88;
      } else {
        // Idle: dim subtle glow
        const p = 0.12 + Math.sin(s.time * 1.0) * 0.08;
        const lp = 0.3 + Math.sin(s.time * 1.0) * 0.2;
        s.eyeFillMatL.opacity += (p - s.eyeFillMatL.opacity) * 0.04;
        s.eyeFillMatR.opacity += (p - s.eyeFillMatR.opacity) * 0.04;
        s.eyeFillMatL.color.setHex(0x55ccff);
        s.eyeFillMatR.color.setHex(0x55ccff);
        s.leftEyeLight.intensity += (lp - s.leftEyeLight.intensity) * 0.04;
        s.rightEyeLight.intensity += (lp - s.rightEyeLight.intensity) * 0.04;
      }
    }

    function updateAudioPulse() {
      if (!s.isSpeaking || !s.analyser || !s.dataArray) return;
      s.analyser.getByteFrequencyData(s.dataArray);
      // Average volume in speech frequency range (300-3000Hz ~ bins 2-25)
      let sum = 0;
      for (let i = 2; i < 25; i++) sum += s.dataArray[i];
      const avg = sum / 23 / 255;
      s.wordPulse = avg > 0.1 ? avg * 1.5 : 0;
    }

    // ── Clock
    const clock = new THREE.Clock();
    s.clock = clock;

    // ── Render loop
    function animate() {
      if (s.disposed) return;
      s.animationFrameId = requestAnimationFrame(animate);

      const dt = clock.getDelta();
      s.time += dt;

      if (s.started) {
        animateAssembly(dt);
        animateIdle();
        updateAudioPulse();
      }

      if (s.renderer && s.scene && s.camera) {
        s.renderer.render(s.scene, s.camera);
      }
    }
    animate();

    // ── Mouse tracking (desktop)
    function handleMouseMove(e: MouseEvent) {
      s.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      s.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    // ── Resize handler
    function handleResize() {
      if (!container || !s.camera || !s.renderer) return;
      s.camera.aspect = container.clientWidth / container.clientHeight;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(container.clientWidth, container.clientHeight);
      s.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ── Cleanup on unmount
    return () => {
      s.disposed = true;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(s.animationFrameId);

      // Dispose audio
      if (s.audio) {
        s.audio.pause();
        s.audio.src = '';
        s.audio.onended = null;
      }
      if (s.audioCtx) {
        s.audioCtx.close().catch(() => {});
      }

      // Dispose Three.js
      if (s.renderer) {
        s.renderer.dispose();
        if (s.renderer.domElement.parentNode) {
          s.renderer.domElement.parentNode.removeChild(s.renderer.domElement);
        }
      }
      if (s.envMap) {
        s.envMap.dispose();
      }
      if (s.scene) {
        s.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }

      // Null out refs
      s.scene = null;
      s.camera = null;
      s.renderer = null;
      s.clock = null;
      s.envMap = null;
      s.headGroup = null;
      s.leftEyeFill = null;
      s.rightEyeFill = null;
      s.eyeFillMatL = null;
      s.eyeFillMatR = null;
      s.leftEyeLight = null;
      s.rightEyeLight = null;
      s.audio = null;
      s.audioCtx = null;
      s.analyser = null;
      s.audioSource = null;
      s.dataArray = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '58vh',
        zIndex: 2,
      }}
    />
  );
}
