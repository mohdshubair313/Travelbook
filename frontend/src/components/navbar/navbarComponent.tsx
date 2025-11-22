"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // optional — replace or remove if not available
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { SearchIcon } from "lucide-react";
import searchIcon from "@/app/assets/searcIcon.png";

type NavItem = { path: string; name: string };

const navItems: NavItem[] = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/projects", name: "Projects" },
  { path: "/contact", name: "Contact" },
];

export default function EnhancedNavbarComponent({
  logoSrc, // optional: string path or imported image
  logoAlt = "Logo",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const pathname = usePathname() || "/";
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-6 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-6 p-3 rounded-2xl bg-gradient-to-r from-white/6 via-white/4 to-black/8 backdrop-blur-md border border-white/10 shadow-xl">

          {/* left: logo + brand */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Home" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black/4 flex-shrink-0 ring-1 ring-white/6 flex items-center justify-center">
                {logoSrc ? (
                  // Use plain img to avoid next/image width/height requirement here
                  <Image src={logoSrc} alt={logoAlt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-black/80">SB</div>
                )}
              </div>
            </Link>
          </div>

          {/* center: desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = item.path === pathname;

              return (
                <div key={item.path} className="relative">
                  <Link
                    href={item.path}
                    className={
                      `relative px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 inline-flex items-center` +
                      (isActive ? " text-gray-700" : " text-gray-700 hover:text-gray-500")
                    }
                    onMouseEnter={() => setHovered(item.path)}
                    onMouseLeave={() => setHovered(null)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="relative z-10">{item.name}</span>

                    {/* animated pill */}
                    <AnimatePresence>
                      {(hovered === item.path || isActive) && (
                        <motion.span
                          layoutId="nav-pill"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className={`absolute inset-0 rounded-full -z-0`}
                          style={{
                            background: "linear-gradient(90deg, rgba(79,70,229,0.12), rgba(139,92,246,0.08))",
                            boxShadow: "0 6px 18px rgba(12,11,16,0.35)",
                          }}
                          aria-hidden
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* right: actions & mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <div className="relative group">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-400/90 to-indigo-400/90 
                  hover:from-amber-300/90 hover:to-yellow-300/90
                  transition-all duration-300 ease-out cursor-pointer shadow-md hover:shadow-lg
                  transform hover:scale-110 hover:rotate-6 active:scale-95 focus:ring-2 focus:ring-indigo-400"
                >
                  <Image
                    src={searchIcon}
                    alt="Search"
                    width={22}
                    height={22}
                    className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  />
                </div>

                {/* pulse glow effect */}
                <span className="absolute inset-0 rounded-full bg-violet-400/30 blur-lg opacity-0 group-hover:opacity-60 transition duration-500"></span>
              </div>

              <div className="hidden md:flex items-center ml-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 rounded-full bg-black/6 ring-1 ring-black/8 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>

            {/* Avatar on right */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center">
                <Avatar className="w-9 h-9 ring-1 ring-white/10 cursor-pointer hover:ring-red-500-400 via-yellow-400 transition">
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* mobile hamburger */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg bg-white/6 ring-1 ring-white/8 hover:bg-white/8 transition"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile menu panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mt-3 md:hidden bg-white/6 backdrop-blur rounded-xl border border-white/8 p-3 shadow-lg"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = item.path === pathname;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ` +
                        (isActive ? "bg-indigo-600/20 text-white" : "text-gray-200 hover:bg-white/6 hover:text-white")}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
