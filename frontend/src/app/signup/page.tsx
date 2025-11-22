"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { motion } from 'framer-motion'
export default function SignupPage() {
    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <MagicCard className="flex flex-col p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Join the Journey
                        </h1>
                        <p className="mt-2 text-sm text-neutral-400">
                            Create your account to start exploring the ecosystem.
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
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
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

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
