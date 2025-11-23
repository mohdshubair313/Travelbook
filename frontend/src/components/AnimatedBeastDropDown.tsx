import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

type DropDownProp = {
    value?: string
    onSelect?: (value: string) => void
    items: string[]
    buttonText: string
}

export function AnimatedBeastDropdown({ items, value, onSelect, buttonText }: DropDownProp) {
    const [open, setOpen] = useState(false);
    const [select, setselect] = useState(value)


    const handleSelect = (item: string) => {
        setselect(item)
        onSelect?.(item)
        setOpen(false)
    }

    return (
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative group inline-block my-4 mx-4 cursor-pointer">
                    {/* THE FLIGHT PATH (Dashed Ring) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[140%] border border-dashed border-sky-300/50 rounded-full"></div>

                    {/* THE AIRPLANE (Orbiting Element) */}
                    {/* We spin a transparent container, the plane sits on the edge of it */}
                    <div className="absolute top-1/2 left-1/2 w-[120%] h-[150%] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite] pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1.5">
                            {/* Tiny Plane Icon */}
                            <svg className="w-5 h-5 text-sky-500 rotate-90 drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
                        </div>
                    </div>

                    {/* THE MAIN BUTTON (The Island/Destination) */}
                    <div className="relative z-10 px-8 py-3 bg-white text-sky-900 font-bold rounded-full shadow-xl border-2 border-white transition-all duration-300 group-hover:scale-105 group-hover:border-sky-200 active:scale-95 overflow-hidden">

                        {/* Background Cloud Texture (Subtle) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-100"></div>

                        {/* Content */}
                        <span className="relative z-10 flex items-center gap-2">
                            {select || buttonText}
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                    </div>

                    {/* Glow effect under button */}
                    <div className="absolute -inset-1 bg-sky-400/20 rounded-full blur-lg -z-10 group-hover:bg-sky-400/40 transition-colors"></div>
                </button>
            </DropdownMenuTrigger>

            <AnimatePresence>
                {open && (
                    <DropdownMenuContent className='w-64 rounded-2xl bg-white/90 shadow-2xl p-2 border-0 overflow-hidden' asChild>
                        <motion.ul
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 16 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                        >
                            {items.map((item, idx) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                                >
                                    <DropdownMenuItem onSelect={() => handleSelect(item)} className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-fuchsia-100 hover:scale-105 transition-all font-semibold text-indigo-700 cursor-pointer">
                                        <span className={`inline-block h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 mr-2 ${item === select ? 'animate-pulse font-semibold' : ''}`} />
                                        {item}
                                    </DropdownMenuItem>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </DropdownMenuContent>
                )}
            </AnimatePresence>
        </DropdownMenu>
    )
}
