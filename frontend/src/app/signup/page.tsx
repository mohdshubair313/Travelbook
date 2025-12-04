"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { motion } from "framer-motion"
import { AnimatedBeastDropdown } from "@/components/AnimatedBeastDropDown";
import { useState } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [LocationSelect, SetLocationSelect] = useState("")
    const [UserRoomCategorySelect, setUserRoomCategorySelect] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const signupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement)
        const name = String(formData.get('name'))
        if (!name) return toast.error("Name is required")
        const email = String(formData.get('email'))
        if (!email) return toast.error("Email is required")
        const password = String(formData.get('password'))
        console.log('password:', password)
        if (!password) return toast.error("Password is required")
        const location = LocationSelect
        const userRoomCategory = UserRoomCategorySelect

        const result = await signUp.email({
            name,
            email,
            password,
            location: LocationSelect,
            userRoomCategory: UserRoomCategorySelect,
        }, {
            // Callbacks for better UX
            onRequest: () => {
                setLoading(true)
                toast.loading("Creating account...");
            },
            onSuccess: () => {
                setLoading(false)
                toast.dismiss();
                toast.success("Account created! Redirecting...");
                router.push('/dashboard')
            },
            onError: (ctx) => {
                setLoading(false)
                toast.dismiss();
                toast.error(ctx.error.message || "Signup failed");
            }
        });

        console.log(result)
    }

    const LocationItems = ['delhi', 'Mumbai', 'Banglore', 'Pune', 'Hyderabad', 'Chennai', 'Goa', 'Gujrat', 'Rajasthan']
    const UserRoomCategory = ["pg", "hotel", "flats", "rent-house", "cheap flights tickets", "train tickets", "veg food restrurants", "Non-veg restrurants", "resorts", "Other"]

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <MagicCard className="mt-5 flex flex-col p-8 shadow-2xl bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
                    <div className="mb-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Join the Journey by Signing Up
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Create your account to start exploring the ecosystem.
                        </p>
                    </div>

                    <form onSubmit={signupSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Mohd Shubair"
                                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="shubair313@gmail.com"
                                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                            />
                        </div>

                        <AnimatedBeastDropdown buttonText="Select your location" items={LocationItems} value={LocationSelect} onSelect={SetLocationSelect} />
                        <label htmlFor="optional"
                            className="text-sm text-red-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                        >
                            <AnimatedBeastDropdown buttonText="What's ur Main motive?" items={UserRoomCategory} value={UserRoomCategorySelect} onSelect={setUserRoomCategorySelect} />
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 shadow-indigo-500/20"
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Log in
                        </Link>
                    </div>
                </MagicCard>
            </motion.div>
        </AuthLayout>
    );
}
