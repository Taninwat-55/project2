import { getWeightHistory, getStrengthProgress, getCurrentWeight } from "@/app/actions/progress";
import ProgressContent from "@/app/(main)/progress/ProgressContent";

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
    const [weightHistory, strengthProgress, currentWeight] = await Promise.all([
        getWeightHistory(),
        getStrengthProgress(),
        getCurrentWeight()
    ]);

    return (
        <ProgressContent
            initialWeightHistory={weightHistory}
            initialStrengthProgress={strengthProgress}
            currentWeight={currentWeight}
        />
    );
}
