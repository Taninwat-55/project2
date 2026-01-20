"use client";

import { useState, useTransition } from "react";
import { Plus, Scale, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { logWeight, type WeightLog } from "@/app/actions/weight";

export default function WeightTrackerCard({ history }: { history: WeightLog[] }) {
    const [weight, setWeight] = useState("");
    const [isPending, startTransition] = useTransition();

    const currentWeight = history[0]?.weight_kg;
    const previousWeight = history[1]?.weight_kg;

    // Calculate trend
    let trend = 0;
    let TrendIcon = Minus;
    let trendColor = "text-[var(--muted-foreground)]";

    if (currentWeight && previousWeight) {
        trend = currentWeight - previousWeight;
        if (trend < 0) {
            TrendIcon = TrendingDown;
            trendColor = "text-green-500"; // Weight loss is usually green in fitness apps?? Or maybe neutral. Let's assume green for loss.
        } else if (trend > 0) {
            TrendIcon = TrendingUp;
            trendColor = "text-red-500";
        }
    }

    async function handleLog() {
        if (!weight) return;
        const w = parseFloat(weight);
        if (isNaN(w)) return;

        startTransition(async () => {
            await logWeight(w, new Date());
            setWeight("");
        });
    }

    // Generate Sparkline Points
    // Normalize data to fit in 100x40 box
    const data = [...history].reverse(); // Oldest to newest
    const maxW = Math.max(...data.map(d => d.weight_kg), 0);
    const minW = Math.min(...data.map(d => d.weight_kg), maxW);
    const range = maxW - minW || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = 40 - ((d.weight_kg - minW) / range) * 40;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-500">
                            <Scale size={16} />
                        </div>
                        <h3 className="text-lg font-bold">Weight Tracker</h3>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">Track your progress over time</p>
                </div>
            </div>

            <div className="flex items-end gap-3 mb-6">
                <div>
                    <span className="text-3xl font-bold">{currentWeight ? currentWeight.toFixed(1) : "—"}</span>
                    <span className="text-sm text-[var(--muted-foreground)] ml-1">kg</span>
                </div>

                {currentWeight && (
                    <div className={`flex items-center gap-1 text-xs font-medium mb-1.5 ${trendColor}`}>
                        <TrendIcon size={14} />
                        {Math.abs(trend).toFixed(1)} kg
                    </div>
                )}
            </div>

            {/* Sparkline */}
            {data.length > 1 && (
                <div className="h-12 w-full mb-6 relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <polyline
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-indigo-500"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="number"
                        step="0.1"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        disabled={isPending}
                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                        onKeyDown={(e) => e.key === "Enter" && handleLog()}
                    />
                </div>
                <button
                    onClick={handleLog}
                    disabled={isPending || !weight}
                    className="bg-[var(--foreground)] text-[var(--background)] p-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}
