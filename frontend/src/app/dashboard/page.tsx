"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import OLXScraper from "@/components/OlxScrapper";
import { motion } from "framer-motion";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8 overflow-y-auto h-screen">
                <header className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 mt-2"
                    >
                        Manage your scrapers and view insights.
                    </motion.p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <OLXScraper />
                </motion.div>
            </main>
        </div>
    );
}