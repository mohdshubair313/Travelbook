"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFoundContent() {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl"
            >
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter drop-shadow-2xl">
                    Lost in Transit?
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
                    Don't be late! The best rooms and seats are filling up fast.
                    <br />
                    Let's get you back on track to your dream destination.
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto inline-block"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Return to Base
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
