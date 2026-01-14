'use client';

import { useState, useTransition } from 'react';
import { TrendingUp, TrendingDown, Scale, Dumbbell, Plus, Check, Loader2 } from 'lucide-react';
import ProgressChart from '@/app/components/ProgressChart';
import { logWeight, getWeightHistory, getStrengthProgress, WeightLogEntry, StrengthProgressEntry } from '@/app/actions/progress';

interface ProgressContentProps {
    initialWeightHistory: WeightLogEntry[];
    initialStrengthProgress: StrengthProgressEntry[];
    currentWeight: number | null;
}

type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';

const timeRanges: { label: string; value: TimeRange; months?: number }[] = [
    { label: '1M', value: '1m', months: 1 },
    { label: '3M', value: '3m', months: 3 },
    { label: '6M', value: '6m', months: 6 },
    { label: '1Y', value: '1y', months: 12 },
    { label: 'All', value: 'all' },
];

export default function ProgressContent({
    initialWeightHistory,
    initialStrengthProgress,
    currentWeight
}: ProgressContentProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('3m');
    const [weightHistory, setWeightHistory] = useState(initialWeightHistory);
    const [strengthProgress, setStrengthProgress] = useState(initialStrengthProgress);
    const [isPending, startTransition] = useTransition();

    // Weight logging state
    const [weightInput, setWeightInput] = useState(currentWeight?.toString() || '');
    const [isLogging, setIsLogging] = useState(false);
    const [logSuccess, setLogSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleTimeRangeChange = (range: TimeRange) => {
        setTimeRange(range);
        const months = timeRanges.find(r => r.value === range)?.months;

        startTransition(async () => {
            try {
                const [newWeightHistory, newStrengthProgress] = await Promise.all([
                    getWeightHistory(months),
                    getStrengthProgress(months)
                ]);
                setWeightHistory(newWeightHistory);
                setStrengthProgress(newStrengthProgress);
            } catch (error) {
                console.error('Failed to load progress data:', error);
                // Keep existing data on error
            }
        });
    };

    const handleLogWeight = async () => {
        const weight = parseFloat(weightInput);
        if (isNaN(weight) || weight <= 0) {
            setErrorMessage('Please enter a valid weight greater than 0');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsLogging(true);
        setErrorMessage('');
        const result = await logWeight(weight);
        setIsLogging(false);

        if (result.success) {
            setLogSuccess(true);
            // Refresh chart data
            const months = timeRanges.find(r => r.value === timeRange)?.months;
            const newHistory = await getWeightHistory(months);
            setWeightHistory(newHistory);

            setTimeout(() => setLogSuccess(false), 2000);
        } else {
            setErrorMessage(result.error || 'Failed to log weight');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    // Calculate weight change
    const weightChange = weightHistory.length >= 2
        ? weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight
        : 0;
    const weightChangePercent = weightHistory.length >= 2 && weightHistory[0].weight > 0
        ? ((weightChange / weightHistory[0].weight) * 100).toFixed(1)
        : '0';

    // Get unique exercises for strength chart
    const exercises = [...new Set(strengthProgress.map(s => s.exercise))];
    const primaryExercise = exercises[0] || 'No exercises';
    const primaryExerciseData = strengthProgress.filter(s => s.exercise === primaryExercise);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Your <span className="text-[var(--color-accent)]">Progress</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-sm">Track your fitness journey over time.</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {timeRanges.map(range => (
                        <button
                            key={range.value}
                            onClick={() => handleTimeRangeChange(range.value)}
                            disabled={isPending}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timeRange === range.value
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
                                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {range.label}
                        </button>
                    ))}
                    {isPending && (
                        <div className="flex items-center text-[var(--muted-foreground)] ml-2">
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Weight Progress Chart - Takes 2 columns */}
                    <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <Scale className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Weight Progress</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {weightHistory.length} entries
                                    </p>
                                </div>
                            </div>
                            {weightHistory.length >= 2 && (
                                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${weightChange < 0
                                    ? 'bg-green-500/20 text-green-500'
                                    : weightChange > 0
                                        ? 'bg-red-500/20 text-red-500'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                                    }`}>
                                    {weightChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                    {Math.abs(weightChange).toFixed(1)} kg ({weightChangePercent}%)
                                </div>
                            )}
                        </div>

                        <ProgressChart
                            labels={weightHistory.map(w => w.date)}
                            data={weightHistory.map(w => w.weight)}
                            label="Weight"
                            color="#3b82f6"
                            unit="kg"
                        />
                    </div>

                    {/* Quick Weight Log Card */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Log Today&apos;s Weight</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[var(--muted-foreground)] mb-2 block">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={weightInput}
                                    onChange={(e) => setWeightInput(e.target.value)}
                                    placeholder="Enter weight"
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleLogWeight}
                                disabled={isLogging || !weightInput}
                                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${logSuccess
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[var(--color-accent)] text-white hover:opacity-90'
                                    } ${(isLogging || !weightInput) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLogging ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : logSuccess ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Logged!
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Log Weight
                                    </>
                                )}
                            </button>

                            {errorMessage && (
                                <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/30 py-2 px-3 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            {currentWeight && (
                                <p className="text-sm text-[var(--muted-foreground)] text-center">
                                    Current: <span className="text-[var(--foreground)] font-medium">{currentWeight} kg</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Strength Progress Chart */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-[var(--color-accent)]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Strength Progress</h2>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {exercises.length > 0
                                        ? `Showing: ${primaryExercise}`
                                        : 'Log workouts with weights to track progress'
                                    }
                                </p>
                            </div>
                        </div>
                        {exercises.length > 1 && (
                            <div className="flex gap-2 flex-wrap">
                                {exercises.slice(0, 3).map(ex => (
                                    <span
                                        key={ex}
                                        className="px-3 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--muted-foreground)]"
                                    >
                                        {ex}
                                    </span>
                                ))}
                                {exercises.length > 3 && (
                                    <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--muted-foreground)]">
                                        +{exercises.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <ProgressChart
                        labels={primaryExerciseData.map(s => s.date)}
                        data={primaryExerciseData.map(s => s.maxWeight)}
                        label={primaryExercise}
                        color="#f97316"
                        unit="kg"
                    />
                </div>
            </main>
        </div>
    );
}
