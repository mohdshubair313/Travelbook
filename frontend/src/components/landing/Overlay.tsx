"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import Link from "next/link";

export default function Overlay() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (titleRef.current && subtitleRef.current && buttonRef.current) {
            tl.fromTo(
                titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.5 }
            )
                .fromTo(
                    subtitleRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.6"
                )
                .fromTo(
                    buttonRef.current,
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5 },
                    "-=0.4"
                );
        }
    }, []);

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center max-w-4xl px-6">
                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
                >
                    Your Journey, Your Budget, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Your Home.
                    </span>
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light"
                >
                    Experience the seamless blend of travel and comfort.
                    From flights to student PGs, we've got your entire journey covered.
                </p>
                <Link href="/dashboard">
                    <InteractiveHoverButton>Explore Now</InteractiveHoverButton>
                </Link>
            </div>
        </div>
    );
}
