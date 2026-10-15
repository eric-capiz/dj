"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { audioEngine } from "@/lib/audio-engine";

/** Average 0..1 energy across frequency buckets (0 when idle). */
function energy(): number {
  const lv = audioEngine.levels(8);
  let s = 0;
  for (const v of lv) s += v;
  return Math.min(1, s / lv.length / 0.6);
}

function ChromeKnot() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state, dt) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const e = energy();
    mesh.current.rotation.x = t * 0.18;
    mesh.current.rotation.y = t * 0.24;
    // Audio-reactive pulse: the knot breathes with the music.
    const s = 1 + Math.sin(t * 1.4) * 0.04 + e * 0.22;
    mesh.current.scale.setScalar(s);
    // Mouse parallax tilt.
    mesh.current.rotation.z = THREE.MathUtils.lerp(
      mesh.current.rotation.z,
      state.pointer.x * 0.35,
      0.06,
    );
    if (mat.current) {
      mat.current.roughness = THREE.MathUtils.clamp(0.14 - e * 0.1, 0.02, 0.2);
    }
  });
  return (
    <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={mesh} position={[0, 0.2, 0]}>
        <torusKnotGeometry args={[1.15, 0.34, 220, 36]} />
        <meshStandardMaterial
          ref={mat}
          color="#e8ecf5"
          metalness={1}
          roughness={0.14}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

function GlassOrb({ position, scale = 1, hue = "#22d3ee" }: { position: [number, number, number]; scale?: number; hue?: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.position.y = position[1] + Math.sin(t * 0.9 + position[0]) * 0.28;
    mesh.current.rotation.y = t * 0.3;
  });
  return (
    <Float speed={3} floatIntensity={1.4} rotationIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <MeshTransmissionMaterial
          color={hue}
          transmission={1}
          thickness={1.2}
          roughness={0.08}
          ior={1.45}
          chromaticAberration={0.6}
          anisotropicBlur={0.4}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.15}
        />
      </mesh>
    </Float>
  );
}

function ReactiveBloom() {
  const bloom = useRef<{ intensity: number }>(null);
  useFrame((state) => {
    if (!bloom.current) return;
    const e = energy();
    const t = state.clock.elapsedTime;
    bloom.current.intensity = 0.85 + Math.sin(t * 2) * 0.1 + e * 1.1;
  });
  return <Bloom ref={bloom as never} mipmapBlur intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.2} />;
}

function Rig() {
  useFrame((state) => {
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.4, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.9 + 0.4, 0.05);
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-6, -2, 4]} intensity={24} color="#ff2fb3" />
      <pointLight position={[6, 3, -2]} intensity={20} color="#22d3ee" />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <ChromeKnot />
      <GlassOrb position={[-3.1, 1.1, -0.6]} scale={0.9} hue="#22d3ee" />
      <GlassOrb position={[3.2, -0.7, -0.4]} scale={1.15} hue="#ff2fb3" />
      <GlassOrb position={[2.4, 1.7, -1.4]} scale={0.6} hue="#b6ff2e" />
      <Sparkles count={90} scale={[12, 7, 6]} size={3.2} speed={0.35} color="#f5f7ff" opacity={0.7} />
      <Sparkles count={40} scale={[10, 6, 5]} size={6} speed={0.2} color="#ff2fb3" opacity={0.55} />
      <Rig />
      <EffectComposer multisampling={0}>
        <ReactiveBloom />
        <ChromaticAberration offset={[0.0016, 0.0016]} />
        <Vignette darkness={0.55} offset={0.25} />
      </EffectComposer>
    </>
  );
}

export function ChromeStage() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // Keep the GPU budget sane on weaker devices.
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

// Feature-check so Hero can degrade gracefully when WebGL is unavailable.
export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}
