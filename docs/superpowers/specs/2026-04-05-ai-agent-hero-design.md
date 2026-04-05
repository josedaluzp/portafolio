# AI Agent Hero — Iron Man 3D Landing

## Overview

A 3D Iron Man helmet serves as an interactive AI agent that greets visitors on the portfolio landing page. The helmet speaks, its eyes glow with the audio, and it follows the user's cursor. After the greeting, users can clap twice (or click a fallback button) to reveal the full portfolio.

## User Flow

```
1. User visits josedaluz.com
2. Fullscreen splash: dark background + "Click para iniciar" overlay
3. User clicks → overlay fades out
4. Assembly animation: helmet scales in + camera zooms (~2s)
5. Audio plays: "Bienvenido al laboratorio de José..." (saludo.mp3)
6. Eyes glow cyan synced to audio volume (AudioContext analyser)
7. User sees: 3D helmet + welcome text + 👏 clap prompt + "Continuar sin micrófono" button
8. User either:
   a) Claps twice → detected via microphone → transition to portfolio
   b) Clicks "Continuar sin micrófono" button → transition to portfolio
9. Splash screen transitions out (fade/slide up)
10. Full portfolio revealed (Nav, Hero, Projects, Services, Stack, Certs, Footer)
```

## Architecture

### Component Structure

```
app/
  page.tsx                    # Main page — renders SplashScreen + Portfolio
  components/
    SplashScreen/
      SplashScreen.tsx        # Fullscreen intro with 3D helmet
      MatrixBackground.tsx    # Cyberpunk rain canvas animation
      HelmetScene.tsx         # Three.js scene (helmet, lights, camera)
      ClapDetector.tsx        # Microphone clap detection logic
    Portfolio/
      Portfolio.tsx           # Existing portfolio content (wrapped)
  
public/
  models/
    iron_man_helmet.glb       # 3D model (4.3MB)
  audio/
    saludo.mp3                # ElevenLabs greeting audio (~120KB)
```

### State Flow

```typescript
// page.tsx
const [showPortfolio, setShowPortfolio] = useState(false);

return (
  <>
    {!showPortfolio && (
      <SplashScreen onComplete={() => setShowPortfolio(true)} />
    )}
    {showPortfolio && <Portfolio />}
  </>
);
```

## Technical Specifications

### 1. SplashScreen Component

**Responsibilities:**
- Render fullscreen dark overlay with matrix background
- Load and display 3D helmet via Three.js
- Play audio on user interaction (click-to-start)
- Detect claps via microphone OR accept button click
- Transition out when user proceeds

**Props:**
```typescript
interface SplashScreenProps {
  onComplete: () => void; // called when user claps or clicks continue
}
```

### 2. Three.js Helmet Scene

**Model:** `iron_man_helmet.glb` loaded with GLTFLoader
- Scale: 2.2 / maxDimension
- Centering: `model.position.set(-center.x * sc, -center.y * sc, -center.z * sc)`
- Materials: keep original textures, adjust metalness=0.85, roughness=0.2, envMapIntensity=1.5

**Lighting:** 5-point cinematic setup
- Ambient (0x334466, 0.6)
- Hemisphere (0x8899cc / 0x443322, 0.8)
- Key directional (warm, 2.0, upper right)
- Fill directional (blue, 0.8, left)
- Rim directional (cyan, 1.2, behind)
- Front directional (cool white, 1.0)

**Eye fills:** BoxGeometry(0.42, 0.11, 0.02) at positions (±0.22, 0.08, 0.43)
- MeshBasicMaterial cyan, transparent
- Idle: opacity 0.1, PointLight intensity 0.3
- Speaking: opacity 0.95, PointLight intensity 5-8, synced to audio volume

**Animations:**
- Assembly: camera z 9→5.5, headGroup scale 0→1 (easeOutCubic, 2s)
- Mouse follow: headGroup.rotation.y/x follows cursor (lerp 0.025, ±0.2 rad)
- Float: headGroup.position.y oscillates ±0.03 (sin, 0.7Hz)

**Renderer:** alpha:true (transparent bg), ACESFilmic, exposure 1.8, no shadows, no bloom

### 3. Matrix Background

Standalone canvas behind the Three.js canvas:
- Characters: `01アイウエオカキクケコ:;{}[]<>/=+*#@`
- Colors: dim teal (rgba 0,100,140,0.25), occasional cyan (0,212,255,0.9), rare white
- Speed: slow (0.4-0.7 per frame)
- Trail: semi-transparent black overlay (rgba 3,3,6,0.06)

### 4. Audio Playback

**Source:** `saludo.mp3` (pre-generated ElevenLabs voice)
**Method:** HTML5 Audio + AudioContext AnalyserNode
- FFT size: 256
- Smoothing: 0.7
- Volume detection: average of bins 2-25 (speech frequency range)
- `wordPulse = avg > 0.1 ? avg * 1.5 : 0`
- Drives eye glow intensity in real-time

### 5. Clap Detection

**Method:** Web Audio API microphone input
- Request microphone permission
- AnalyserNode on mic stream
- Detect sharp energy spikes in 2-8kHz range
- 2 claps within 2 seconds → trigger onComplete
- Visual feedback: clap icons pulse/highlight on detection
- Cooldown: 400ms between clap detections

### 6. Fallback Button

For users without microphone:
```html
<button class="continue-btn">Continuar sin micrófono →</button>
```
- Positioned below "ESCUCHANDO" status
- Subtle, doesn't distract from the clap experience
- onClick → onComplete()

### 7. Transition to Portfolio

When onComplete fires:
1. Splash screen fades out (opacity 0, 800ms ease)
2. Three.js renderer disposed (free GPU memory)
3. Audio context closed
4. Microphone stream stopped
5. Splash DOM removed
6. Portfolio mounts with entrance animations

## Layout

```
┌──────────────────────────────────────┐
│           Matrix Background          │
│                                      │
│         ┌──────────────────┐         │
│         │                  │         │  58vh
│         │   3D Helmet      │         │
│         │   (Three.js)     │         │
│         └──────────────────┘         │
│                                      │
│     Bienvenido al laboratorio de     │
│          Jose Da Luz                 │  42vh
│       INGENIERO EN SOFTWARE          │
│              ───                     │
│   👏 APLAUDÍ DOS VECES... 👏         │
│         ● ESCUCHANDO                 │
│    [Continuar sin micrófono →]       │
└──────────────────────────────────────┘
```

## Dependencies

**New:**
- `three` (Three.js)
- `@types/three` (TypeScript types)

**Existing (already in project):**
- `next` 14.2.35
- `react` 18
- `framer-motion` 12.38.0
- `tailwind` 3.4.1

## Assets

| File | Size | Location |
|------|------|----------|
| iron_man_helmet.glb | 4.3MB | public/models/ |
| saludo.mp3 | 120KB | public/audio/ |

## Performance Targets

- 60fps on desktop (Three.js with single GLB model + lightweight canvas)
- Total additional page weight: ~4.5MB (loaded before portfolio, can show loading bar)
- Three.js disposed after splash → zero ongoing GPU cost for portfolio
- Matrix background uses requestAnimationFrame, cancelled on unmount

## Browser Support

- Chrome, Edge, Firefox, Safari (desktop)
- Mobile: simplified version (no clap detection, button-only, smaller model)
- Fallback: if WebGL not supported, skip splash → go directly to portfolio
