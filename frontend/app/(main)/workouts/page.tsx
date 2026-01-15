// @/app/workouts/page.tsx
import { getUserWorkouts, getWorkoutStats } from "@/app/actions/workouts";
import WorkoutsContent from "@/app/components/WorkoutsContent";

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage() {
    // Fetch data on the server
    const [workouts, stats] = await Promise.all([
        getUserWorkouts(),
        getWorkoutStats()
    ]);

    return (
        <WorkoutsContent 
            initialWorkouts={Array.isArray(workouts) ? workouts : []} 
            stats={stats} 
        />
    );
}