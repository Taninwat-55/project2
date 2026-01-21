import { getWeightHistory, getCurrentWeight } from "@/app/actions/progress";
import ProgressContent from "@/app/(main)/progress/ProgressContent";

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
    const [weightHistory, currentWeight] = await Promise.all([
        getWeightHistory(),
        getCurrentWeight()
    ]);

    return (
        <ProgressContent
            initialWeightHistory={weightHistory}
            currentWeight={currentWeight}
        />
    );
}
