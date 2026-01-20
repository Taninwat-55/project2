"use client";

import { useState } from "react";
import { Target, Plus, CheckCircle, X, Calendar, Clock, Flag, Rocket } from "lucide-react";
import { UserGoal, GoalType, createGoal, completeGoal, deleteGoal } from "@/app/actions/goals";

interface GoalsCardProps {
    goals: UserGoal[];
    onGoalChange?: () => void;
}

const goalTypeConfig: Record<GoalType, { label: string; icon: typeof Target; color: string; bgColor: string }> = {
    short_term: {
        label: "Short-term",
        icon: Clock,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    medium_term: {
        label: "Medium-term",
        icon: Flag,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    long_term: {
        label: "Long-term",
        icon: Rocket,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
};

export default function GoalsCard({ goals, onGoalChange }: GoalsCardProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const activeGoals = goals.filter((g) => g.status === "active");
    const shortTermGoals = activeGoals.filter((g) => g.goal_type === "short_term");
    const mediumTermGoals = activeGoals.filter((g) => g.goal_type === "medium_term");
    const longTermGoals = activeGoals.filter((g) => g.goal_type === "long_term");

    const handleComplete = async (goalId: string) => {
        setLoading(true);
        await completeGoal(goalId);
        onGoalChange?.();
        setLoading(false);
    };

    const handleDelete = async (goalId: string) => {
        if (!confirm("Are you sure you want to delete this goal?")) return;
        setLoading(true);
        await deleteGoal(goalId);
        onGoalChange?.();
        setLoading(false);
    };

    return (
        <>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-[var(--color-accent)]" />
                        <h3 className="text-lg font-bold">My Goals</h3>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={14} />
                        Set Goal
                    </button>
                </div>

                {activeGoals.length === 0 ? (
                    <div className="text-center py-6">
                        <Target size={32} className="mx-auto text-[var(--muted-foreground)]/50 mb-2" />
                        <p className="text-sm text-[var(--muted-foreground)]">No goals set yet</p>
                        <p className="text-xs text-[var(--muted-foreground)]/70 mt-1">
                            Set short, medium, and long-term goals to stay motivated
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Goal Categories */}
                        {[
                            { type: "short_term" as GoalType, goals: shortTermGoals },
                            { type: "medium_term" as GoalType, goals: mediumTermGoals },
                            { type: "long_term" as GoalType, goals: longTermGoals },
                        ].map(
                            ({ type, goals: typeGoals }) =>
                                typeGoals.length > 0 && (
                                    <div key={type}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {(() => {
                                                const config = goalTypeConfig[type];
                                                const Icon = config.icon;
                                                return (
                                                    <>
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center ${config.bgColor}`}>
                                                            <Icon size={12} className={config.color} />
                                                        </div>
                                                        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <div className="space-y-2">
                                            {typeGoals.slice(0, 2).map((goal) => (
                                                <div
                                                    key={goal.id}
                                                    className="flex items-center gap-3 p-3 bg-[var(--muted)]/50 rounded-xl group"
                                                >
                                                    <button
                                                        onClick={() => handleComplete(goal.id)}
                                                        disabled={loading}
                                                        className="w-5 h-5 rounded-full border-2 border-[var(--muted-foreground)]/30 flex items-center justify-center hover:border-green-500 hover:bg-green-500/10 transition-colors"
                                                    >
                                                        <CheckCircle size={12} className="text-transparent group-hover:text-green-500" />
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">{goal.title}</div>
                                                        {goal.target_date && (
                                                            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                                                <Calendar size={10} />
                                                                {goal.target_date}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(goal.id)}
                                                        disabled={loading}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                                                    >
                                                        <X size={14} className="text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <GoalsModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        onGoalChange?.();
                    }}
                />
            )}
        </>
    );
}

interface GoalsModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function GoalsModal({ onClose, onSuccess }: GoalsModalProps) {
    const [goalType, setGoalType] = useState<GoalType>("short_term");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Please enter a goal title");
            return;
        }

        setLoading(true);
        setError("");

        const result = await createGoal({
            goal_type: goalType,
            title: title.trim(),
            description: description.trim() || undefined,
            target_date: targetDate || undefined,
        });

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error || "Failed to create goal");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Set a New Goal</h2>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Goal Type Selection */}
                    <div>
                        <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Goal Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(goalTypeConfig) as GoalType[]).map((type) => {
                                const config = goalTypeConfig[type];
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setGoalType(type)}
                                        className={`p-3 rounded-xl text-center transition-all ${goalType === type
                                            ? `${config.bgColor} border-2 border-current ${config.color}`
                                            : "bg-[var(--muted)] border-2 border-transparent hover:border-[var(--muted-foreground)]/30"
                                            }`}
                                    >
                                        <Icon size={16} className={`mx-auto mb-1 ${goalType === type ? config.color : ""}`} />
                                        <span className="text-xs font-medium">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Goal Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Run a 5K, Lose 5kg, Build muscle"
                            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details about your goal..."
                            rows={2}
                            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                        />
                    </div>

                    {/* Target Date */}
                    <div>
                        <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Target Date (optional)</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-accent)] transition-colors [color-scheme:dark]"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[var(--color-accent)] text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
