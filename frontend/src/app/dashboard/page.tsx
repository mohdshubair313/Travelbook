"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import OLXScraper from "@/components/OlxScrapper";
import TrainSearch from "@/components/trains/TrainSearch";
import FlightSearch from "@/components/flights/FlightSearch";
import { motion } from "framer-motion";
import { Home, Train, Plane } from "lucide-react";

type TabType = "accommodation" | "trains" | "flights";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("accommodation");

    const tabs = [
        { id: "accommodation" as TabType, label: "Accommodation", icon: Home },
        { id: "trains" as TabType, label: "Trains", icon: Train },
        { id: "flights" as TabType, label: "Flights", icon: Plane },
    ];

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
                        Travel Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 mt-2"
                    >
                        Find accommodation, trains, and flights - all in one place.
                    </motion.p>
                </header>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex gap-2 mb-6"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                            disabled={tab.disabled}
                            className={"flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all " + (
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : tab.disabled
                                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.disabled && (
                                <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded">
                                    Soon
                                </span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
                >
                    {activeTab === "accommodation" && <OLXScraper />}
                    {activeTab === "trains" && <TrainSearch />}
