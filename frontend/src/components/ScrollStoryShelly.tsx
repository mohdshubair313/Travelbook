"use client"

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Hotel, Ticket, Utensils, Plane, Train, Bus, CheckCircle2, LayoutDashboard, Search, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionData {
    id: number;
    eyebrow: string;
    title: string;
    description: string;
    visualType: "hook" | "chaos" | "challenge" | "reveal" | "final";
}

const sections: SectionData[] = [
    {
        id: 1,
        eyebrow: "Let me ask you a question",
        title: "What do you do when you want to travel outside your city?",
        description: "In India, planning a trip often feels like a second job. The excitement of the journey is buried under mountains of logistics.",
        visualType: "hook",
    },
    {
        id: 2,
        eyebrow: "The typical routine",
        title: "Real-life chaos",
        description: "Book a hotel. Compare prices. Book train or flight tickets. Check food preferences. Swap between 10 different apps just to get one weekend right.",
        visualType: "chaos",
    },
    {
        id: 3,
        eyebrow: "The bitter truth",
        title: "But are you sure this isn't wasting your time?",
        description: "Hours spent on tabs, days spent on comparisons. Your vacation shouldn't start with a headache.",
        visualType: "challenge",
    },
    {
        id: 4,
        eyebrow: "The new way",
        title: "Presenting Shelly",
        description: "Plan your trip in minutes. One place to book everything: Hotels, PGs, Rent + Train, Flight, Bus. Smart filters for budget and food.",
        visualType: "reveal",
    },
    {
        id: 5,
        eyebrow: "Simplify your life",
        title: "No more jumping between apps",
        description: "No more endless comparisons. Shelly handles the mess so you can handle the memories.",
        visualType: "final",
    },
];

const VisualChaos = () => {
    const elements = [
        { icon: <Hotel className="w-6 h-6" />, label: "Hotel", color: "bg-blue-500" },
        { icon: <Ticket className="w-6 h-6" />, label: "Ticket", color: "bg-purple-500" },
        { icon: <Plane className="w-6 h-6" />, label: "Flight", color: "bg-indigo-500" },
        { icon: <Utensils className="w-6 h-6" />, label: "Veg/Non-Veg", color: "bg-emerald-500" },
        { icon: <Bus className="w-6 h-6" />, label: "Bus", color: "bg-amber-500" },
        { icon: <Train className="w-6 h-6" />, label: "Train", color: "bg-rose-500" },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {elements.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: Math.sin(i * 1.2) * 120,
                        y: Math.cos(i * 1.2) * 120,
                        rotate: i * 15
                    }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.5
                    }}
                    className={`absolute p-4 rounded-2xl ${item.color} shadow-lg flex flex-col items-center gap-2 border border-white/20 backdrop-blur-sm`}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </motion.div>
            ))}
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-3xl -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </div>
    );
};

const ShellyMockup = () => {
    return (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-xs text-zinc-500 font-medium">shelly.travel</div>
                <div className="w-4" />
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-2xl">
                    <Search className="w-5 h-5 text-indigo-400" />
                    <div className="h-4 w-32 bg-zinc-700 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 flex flex-col items-center justify-center gap-2">
                        <Hotel className="w-6 h-6 text-indigo-400" />
                        <span className="text-[10px] text-indigo-300 font-bold">STAYS</span>
                    </div>
                    <div className="h-24 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center gap-2">
                        <Plane className="w-6 h-6 text-emerald-400" />
                        <span className="text-[10px] text-emerald-300 font-bold">FLIGHTS</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-3 w-full bg-zinc-800 rounded-full" />
                    <div className="h-3 w-2/3 bg-zinc-800 rounded-full" />
                </div>
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-center font-bold text-sm">
                    Complete Trip Insight
                </div>
            </div>
        </div>
    );
};

const VisualSection = ({ type }: { type: SectionData["visualType"] }) => {
    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center"
            >
                {type === "hook" && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-2 border-zinc-800 bg-black text-6xl">
                            ❔
                        </div>
                    </div>
                )}
                {type === "chaos" && <VisualChaos />}
                {type === "challenge" && (
                    <div className="flex flex-col items-center gap-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="p-8 rounded-full bg-zinc-900 border-2 border-dashed border-red-500/30"
                        >
                            <Clock className="w-24 h-24 text-red-400" />
                        </motion.div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                )}
                {type === "reveal" && <ShellyMockup />}
                {type === "final" && (
                    <div className="relative flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            className="p-10 rounded-3xl bg-emerald-500 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]"
                        >
                            <CheckCircle2 className="w-20 h-20 text-white" />
                        </motion.div>
                        <div className="flex flex-col gap-3 items-center">
                            <div className="h-2 w-48 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                            <span className="text-zinc-500 text-sm font-medium">Optimization Complete</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const ScrollStoryShelly = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Calculate which section is active based on scroll progress
    // We have 5 sections, so 1/5 = 0.2 per section
    const activeSectionIndex = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 1, 2, 3, 4, 4]);

    // Use spring for smoother index transitions
    const smoothIndex = useSpring(activeSectionIndex, { stiffness: 100, damping: 30 });

    const [activeIndex, setActiveIndex] = React.useState(0);

    // Sync active index to state for UI updates that need it
    React.useEffect(() => {
        const unsubscribe = smoothIndex.on("change", (latest) => {
            const idx = Math.round(latest);
            if (idx !== activeIndex) {
                setActiveIndex(idx);
            }
        });
        return () => unsubscribe();
    }, [smoothIndex, activeIndex]);

    return (
        <section ref={containerRef} className="relative bg-black min-h-[500vh]">
            {/* Sticky Background & Visual Area */}
            <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center overflow-hidden">

                {/* Visual Side (Acts as background on mobile) */}
                <div className="absolute inset-0 lg:relative lg:w-1/2 h-full z-0 lg:z-auto opacity-40 lg:opacity-100">
                    <VisualSection type={sections[activeIndex].visualType} />
                </div>

                {/* Narrative Side */}
                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 lg:px-24 z-10">
                    <div className="relative h-[400px] flex items-center">
                        {sections.map((section, index) => {
                            const opacity = index === activeIndex ? 1 : 0;
                            const translateY = index === activeIndex ? 0 : index < activeIndex ? -40 : 40;
                            const pointerEvents = index === activeIndex ? "auto" : "none";

                            return (
                                <motion.div
                                    key={section.id}
                                    initial={false}
                                    animate={{
                                        opacity,
                                        y: translateY,
                                        filter: index === activeIndex ? "blur(0px)" : "blur(10px)"
                                    }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 flex flex-col justify-center space-y-6"
                                    style={{ pointerEvents }}
                                >
                                    <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
                                        {section.eyebrow}
                                    </span>
                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                        {section.title}
                                    </h2>
                                    <p className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed">
                                        {section.description}
                                    </p>

                                    {index === 4 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex flex-wrap gap-4 pt-4"
                                        >
                                            <Link href="/dashboard">
                                                <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition flex items-center gap-2 group">
                                                    Plan a trip
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                            <button className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 transition">
                                                Explore stays
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-12 left-8 lg:left-24 flex items-center gap-3">
                        {sections.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 transition-all duration-500 rounded-full ${idx === activeIndex ? 'w-12 bg-white' : 'w-4 bg-zinc-800'}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScrollStoryShelly;
