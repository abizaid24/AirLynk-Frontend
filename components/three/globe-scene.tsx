"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";
import { AIRPORTS } from "@/lib/airports";
import { latLngToVector3 } from "@/lib/three-utils";
import { useSearchStore } from "@/store/search-store";

const RADIUS = 2.1;

/**
 * Realistic, NASA-style Earth: real day-map photography, night-lights
 * emissive map, a slowly-drifting cloud shell, and a soft atmosphere rim —
 * replacing the earlier abstract wireframe/dot-sphere globe per the brief.
 * Textures are the classic three.js example Earth set (NASA Blue Marble /
 * Visible Earth derived), stored locally in /public/textures/earth.
 */
function RealisticEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [dayMap, nightMap, cloudsMap, normalMap, specularMap] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/earth/earth-day.jpg",
      "/textures/earth/earth-night.png",
      "/textures/earth/earth-clouds.png",
      "/textures/earth/earth-normal.jpg",
      "/textures/earth/earth-specular.jpg",
    ]
  );

  useMemo(() => {
    [dayMap, nightMap, cloudsMap, normalMap, specularMap].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [dayMap, nightMap, cloudsMap, normalMap, specularMap]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.045;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.062;
  });

  return (
    <group>
      {/* Earth surface — real day photography + night-lights emissive glow */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.75}
          metalness={0.1}
          emissiveMap={nightMap}
          emissive={new THREE.Color("#ffe9b8")}
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* Cloud layer — semi-transparent shell, rotates independently */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[RADIUS + 0.018, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere rim glow — soft sky-blue halo via backside shell */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.09, 48, 48]} />
        <meshBasicMaterial
          color="#8a5a12"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function AirportMarker({
  lat,
  lng,
  active,
}: {
  lat: number;
  lng: number;
  active: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLngToVector3(lat, lng, RADIUS + 0.03), [lat, lng]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const s = active ? 1 + Math.sin(t * 4) * 0.25 : 1;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[active ? 0.045 : 0.026, 12, 12]} />
      <meshBasicMaterial
        color={active ? "#8a5a12" : "#f6f7fa"}
        toneMapped={false}
      />
    </mesh>
  );
}

function RouteArc({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const mid = useMemo(() => {
    const m = from.clone().add(to).multiplyScalar(0.5);
    return m.normalize().multiplyScalar(RADIUS + 0.9);
  }, [from, to]);

  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!planeRef.current) return;
    const t = (Math.sin(state.clock.getElapsedTime() * 0.6) + 1) / 2;
    const p = new THREE.QuadraticBezierCurve3(from, mid, to).getPoint(t);
    planeRef.current.position.copy(p);
  });

  return (
    <group>
      <QuadraticBezierLine
        start={from}
        end={to}
        mid={mid}
        color="#8a5a12"
        lineWidth={1.5}
        transparent
        opacity={0.85}
        dashed={false}
      />
      <mesh ref={planeRef}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshBasicMaterial color="#f6f7fa" toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  const { origin, destination } = useSearchStore();

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 2, 5]} intensity={1.6} color="#fff6e8" />
      <pointLight position={[-4, -2, -3]} intensity={0.5} color="#8a5a12" />

      <Suspense fallback={null}>
        <RealisticEarth />
      </Suspense>

      {AIRPORTS.map((a) => (
        <AirportMarker
          key={a.iata}
          lat={a.lat}
          lng={a.lng}
          active={a.iata === origin?.iata || a.iata === destination?.iata}
        />
      ))}

      {origin && destination && (
        <RouteArc
          from={latLngToVector3(origin.lat, origin.lng, RADIUS + 0.03)}
          to={latLngToVector3(destination.lat, destination.lng, RADIUS + 0.03)}
        />
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={origin || destination ? 0.3 : 0.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  );
}

export function GlobeCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.45, 7.8], fov: 40, near: 0.1, far: 100 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
