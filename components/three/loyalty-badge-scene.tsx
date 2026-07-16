"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Badge({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[0.9, 0.14, 32, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.18}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#f6efe3"
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

export function LoyaltyBadgeScene({ color = "#8a5a12" }: { color?: string }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.6], fov: 40 }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <pointLight position={[3, 2, 3]} intensity={2} color={color} />
          <pointLight position={[-3, -2, -2]} intensity={1} color="#8a5a12" />
          <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
            <Badge color={color} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
