"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Search,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    LayoutDashboard,
    Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Search", icon: Search, path: "/dashboard/search" },
    { name: "Notifications", icon: Bell, path: "/dashboard/notifications" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-md text-white cursor-pointer"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <motion.div
                className={`fixed top-0 left-0 h-full bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800 z-40 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-20"
                    } hidden lg:flex`}
                initial={false}
                animate={{ width: isOpen ? 256 : 80 }}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
                    <AnimatePresence mode="wait">
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
                            >
                                Shelly
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        {isOpen ? <Menu size={20} /> : <Menu size={20} className="mx-auto" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div
                                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                                        }`}
                                >
                                    <item.icon size={22} className={`${isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-white"}`} />

                                    <AnimatePresence mode="wait">
                                        {isOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="ml-3 font-medium whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {isActive && isOpen && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-zinc-800">
                    <div className={`flex items-center ${isOpen ? "justify-start" : "justify-center"}`}>
                        <Avatar className="h-10 w-10 border border-zinc-700">
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                {user?.name?.charAt(0) || <User size={18} />}
                            </AvatarFallback>
                        </Avatar>

                        <AnimatePresence mode="wait">
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="ml-3 overflow-hidden"
                                >
                                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => logout()}
                        className={`mt-4 flex items-center w-full cursor-pointer px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${isOpen ? "justify-start" : "justify-center"
                            }`}
                    >
                        <LogOut size={20} />
                        {isOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </motion.div>
        </>
    );
}
