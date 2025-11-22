import NotFoundScene from "@/components/not-found/NotFoundScene";
import NotFoundContent from "@/components/not-found/NotFoundContent";

export default function NotFound() {
    return (
        <main className="relative min-h-screen w-full bg-black overflow-hidden selection:bg-indigo-500/30">
            <NotFoundScene />
            <NotFoundContent />
        </main>
    );
}