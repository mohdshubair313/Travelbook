"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import Model from "./Model";

export default function Scene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                dpr={[1, 2]} // Optimization for high DPI screens
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <Model />
                    <Environment preset="city" />
                    {/* OrbitControls allowed but restricted for better UX */}
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
            </Canvas>
        </div>
    );
}
