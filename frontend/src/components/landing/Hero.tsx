"use client";

import dynamic from "next/dynamic";
import Overlay from "./Overlay";

// Lazy load the 3D scene for better initial page load performance
const Scene = dynamic(() => import("./Scene"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
            <div className="animate-pulse">Loading 3D Experience...</div>
        </div>
    ),
});

export default function Hero() {
    return (
        <section className="relative w-full h-screen bg-black overflow-hidden">
            <Scene />
            <Overlay />
        </section>
    );
}
