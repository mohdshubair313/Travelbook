"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Environment, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function FloatingElement({ text, position, rotationSpeed }: { text: string, position: [number, number, number], rotationSpeed: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.cos(t * rotationSpeed) * 0.2;
        meshRef.current.rotation.y = Math.sin(t * rotationSpeed) * 0.2;
        meshRef.current.position.y += Math.sin(t * 2) * 0.002;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                ref={meshRef}
                position={position}
                fontSize={1.5}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
        </Float>
    );
}

function SceneContent() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Floating Travel Icons (Emojis as 3D Text) */}
            <FloatingElement text="✈️" position={[-3, 2, -5]} rotationSpeed={0.5} />
            <FloatingElement text="🚆" position={[3, -1, -4]} rotationSpeed={0.4} />
            <FloatingElement text="🛏️" position={[-2, -3, -6]} rotationSpeed={0.6} />
            <FloatingElement text="🏨" position={[4, 3, -8]} rotationSpeed={0.3} />
            <FloatingElement text="🗺️" position={[0, 4, -10]} rotationSpeed={0.2} />

            {/* Central 404 Text */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <Text
                    fontSize={6}
                    color="#4338ca"
                    position={[0, 0, -15]}
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    404
                    <meshStandardMaterial emissive="#4338ca" emissiveIntensity={2} toneMapped={false} />
                </Text>
            </Float>

            <Environment preset="city" />
        </>
    );
}

export default function NotFoundScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>
        </div>
    );
}
