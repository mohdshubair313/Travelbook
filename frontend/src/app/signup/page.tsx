"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { motion } from "framer-motion"
import { AnimatedBeastDropdown } from "@/components/AnimatedBeastDropDown";
import { useState } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
    const [LocationSelect, SetLocationSelect] = useState("")
    const [UserRoomCategorySelect, setUserRoomCategorySelect] = useState("")

    const signupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement)
        const name = String(formData.get('name'))
        if (!name) return toast.error("Name is required")
        const email = String(formData.get('email'))
        if (!email) return toast.error("Email is required")
        const password = String(formData.get('password'))
        if (!password) return toast.error("Password is required")
        const location = LocationSelect
        if (!location) return toast.error("Location is required")
        const userRoomCategory = UserRoomCategorySelect

        const { data, error } = await signUp.email({
            email,
            password,
            name,
            location: LocationSelect,
            userRoomCategory: UserRoomCategorySelect
        }, {
            // Callbacks for better UX
            onRequest: () => {
                toast.loading("Creating account...");
            },
            onSuccess: () => {
                toast.dismiss();
                toast.success("Account created! Redirecting...");
                // Yahan router.push('/dashboard') kar sakta hai
            },
            onError: (ctx) => {
                toast.dismiss();
                toast.error(ctx.error.message || "Signup failed");
            }
        });
    }
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
            <MagicCard className="mt-5 flex flex-col p-8 shadow-2xl">
                <div className="mb-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Join the Journey by Signing Up
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        Create your account to start exploring the ecosystem.
                    </p>
                </div>

                <form onSubmit={signupSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <AnimatedBeastDropdown buttonText="Select your location" items={LocationItems} value={LocationSelect} onSelect={SetLocationSelect} />
                    <label htmlFor="optional"
                        className="text-sm text-red-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300"
                    >
                        <AnimatedBeastDropdown buttonText="What's ur Main motive?" items={UserRoomCategory} value={UserRoomCategorySelect} onSelect={setUserRoomCategorySelect} />
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-400">
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
