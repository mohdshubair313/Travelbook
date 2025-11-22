"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export default function Model() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Gentle base rotation
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;

    // Interactive rotation based on pointer
    const { x, y } = state.pointer;
    mesh.rotation.y += x * 0.01;
    mesh.rotation.x += y * 0.01;
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#4338ca"
        wireframe
        emissive="#4338ca"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
