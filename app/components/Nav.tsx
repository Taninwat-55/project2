import Link from "next/link";

export default function Nav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    <span className="text-primary italic">Neon</span>Fit
                </Link>
                <div className="flex gap-6 text-sm font-medium text-zinc-400">
                    <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Workouts</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Activity</Link>
                </div>
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10" />
            </div>
        </nav>
    );
}
