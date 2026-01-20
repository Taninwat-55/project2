"use client";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                {/* Title Section Skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-64 bg-[var(--muted)] rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-[var(--muted)] rounded-lg animate-pulse" />
                </div>

                {/* Filter Tabs Skeleton */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-9 w-24 bg-[var(--muted)] rounded-full animate-pulse" />
                    ))}
                </div>

                {/* Stats Cards Skeleton (6 items) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 h-28 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="h-4 w-24 bg-[var(--muted)] rounded animate-pulse" />
                                <div className="h-5 w-5 bg-[var(--muted)] rounded-full animate-pulse" />
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <div className="h-8 w-16 bg-[var(--muted)] rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid Skeleton */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Chart Section - Takes 2 columns */}
                    <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 w-48 bg-[var(--muted)] rounded animate-pulse" />
                            <div className="h-8 w-8 bg-[var(--muted)] rounded animate-pulse" />
                        </div>
                        <div className="h-64 w-full bg-[var(--muted)] rounded-xl animate-pulse mb-6" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 bg-[var(--muted)] rounded-xl animate-pulse" />
                            <div className="h-24 bg-[var(--muted)] rounded-xl animate-pulse" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Profile Summary Skeleton */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-64 animate-pulse relative overflow-hidden">
                            <div className="h-full w-full bg-[var(--muted)]/50" />
                        </div>

                        {/* Goals Skeleton */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-48 animate-pulse">
                            <div className="h-6 w-32 bg-[var(--muted)] mb-4 rounded" />
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-[var(--muted)] rounded" />
                                <div className="h-2 w-full bg-[var(--muted)] rounded" />
                                <div className="h-2 w-3/4 bg-[var(--muted)] rounded" />
                            </div>
                        </div>

                        {/* Weekly Goals Skeleton */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-64 animate-pulse">
                            <div className="h-6 w-32 bg-[var(--muted)] mb-4 rounded" />
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="h-4 w-20 bg-[var(--muted)] rounded" />
                                            <div className="h-4 w-10 bg-[var(--muted)] rounded" />
                                        </div>
                                        <div className="h-2 w-full bg-[var(--muted)] rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent History Skeleton */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-32 bg-[var(--muted)] rounded animate-pulse" />
                        <div className="h-4 w-16 bg-[var(--muted)] rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-[var(--border)]/50 last:border-0">
                                <div className="w-10 h-10 bg-[var(--muted)] rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-[var(--muted)] rounded animate-pulse" />
                                    <div className="h-3 w-20 bg-[var(--muted)] rounded animate-pulse" />
                                </div>
                                <div className="h-4 w-24 bg-[var(--muted)] rounded animate-pulse hidden md:block" />
                                <div className="h-4 w-16 bg-[var(--muted)] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
