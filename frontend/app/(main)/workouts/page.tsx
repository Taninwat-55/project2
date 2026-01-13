import { getUserWorkouts, getWorkoutStats } from "@/app/actions/workouts";
import WorkoutsContent from "@/app/components/WorkoutsContent";

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage() {
    const [workouts, stats] = await Promise.all([
        getUserWorkouts(),
        getWorkoutStats()
    ]);

    return <WorkoutsContent initialWorkouts={workouts} stats={stats} />;
}