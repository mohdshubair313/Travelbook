import Hero from "@/components/landing/Hero";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black">
            <Hero />
            {/* Future sections can be added here */}
            <div className="h-screen bg-zinc-900 flex items-center justify-center text-white">
                <h2 className="text-4xl font-bold opacity-50">More Content Coming Soon</h2>
            </div>
        </main>
    );
}
