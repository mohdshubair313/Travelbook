"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn.email({
                email,
                password,
            }, {
                onRequest: () => {
                    toast.loading("Signing in...");
                },
                onSuccess: () => {
                    toast.dismiss();
                    toast.success("Welcome back!");
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    toast.dismiss();
                    toast.error(ctx.error.message || "Login failed");
                    setLoading(false);
                }
            });
        } catch (error) {
            toast.dismiss();
            toast.error("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <MagicCard className="flex flex-col p-8 shadow-2xl bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Log in to continue your journey.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-indigo-500/20 cursor-pointer"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-400 cursor-pointer">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                            Sign up
                        </Link>
                    </div>
                </MagicCard>
            </motion.div>
        </AuthLayout>
    );
}
