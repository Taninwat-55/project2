"use client";

import { useRouter } from "next/navigation";
import GoalsCard from "@/app/components/GoalsCard";
import { UserGoal } from "@/app/actions/goals";

interface DashboardGoalsCardProps {
    goals: UserGoal[];
}

export default function DashboardGoalsCard({ goals }: DashboardGoalsCardProps) {
    const router = useRouter();

    const handleGoalChange = () => {
        // Refresh the page to fetch updated goals
        router.refresh();
    };

    return <GoalsCard goals={goals} onGoalChange={handleGoalChange} />;
}
