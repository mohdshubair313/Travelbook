import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

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
                <button className="relative group w-full outline-none">
                    <div className={`
                        relative z-10 w-full px-4 py-2.5 flex items-center justify-between
                        bg-zinc-900/50 border border-zinc-800 rounded-xl
                        text-sm text-zinc-300 transition-all duration-300
                        group-hover:border-indigo-500/50 group-hover:bg-zinc-800/50
                        focus:ring-2 focus:ring-indigo-500/50
                        ${open ? 'border-indigo-500/50 ring-2 ring-indigo-500/50' : ''}
                    `}>
                        <span className={select ? "text-white" : "text-zinc-500"}>
                            {select || buttonText}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${open ? 'rotate-180 text-indigo-400' : 'text-zinc-500'}`}
                        />
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </button>
            </DropdownMenuTrigger>

            <AnimatePresence>
                {open && (
                    <DropdownMenuContent
                        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] p-1.5 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
                        asChild
                        sideOffset={8}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <DropdownMenuItem
                                            onSelect={() => handleSelect(item)}
                                            className={`
                                                flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5
                                                transition-colors duration-200
                                                ${item === select
                                                    ? 'bg-indigo-500/10 text-indigo-400'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                                }
                                            `}
                                        >
                                            <span>{item}</span>
                                            {item === select && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <Check size={14} className="text-indigo-400" />
                                                </motion.div>
                                            )}
                                        </DropdownMenuItem>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </DropdownMenuContent>
                )}
            </AnimatePresence>
        </DropdownMenu>
    )
}
