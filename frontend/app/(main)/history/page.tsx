import { getUserHistory } from '@/app/actions/history';
import HistoryContent from '@/app/components/HistoryContent';

export default async function HistoryPage() {
  const historyItems = await getUserHistory();

  return <HistoryContent initialItems={historyItems} />;
}