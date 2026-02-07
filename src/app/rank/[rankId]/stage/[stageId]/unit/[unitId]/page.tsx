import UnitPlayerClient from './client';
import { fetchAudioData } from '@/lib/google-sheets';

export async function generateStaticParams() {
    const data = await fetchAudioData();
    const params = [];
    for (const rank of data.ranks) {
        if (!rank.stages) continue;
        for (const stage of rank.stages) {
            for (const unit of stage.units) {
                params.push({ rankId: rank.id, stageId: stage.id, unitId: unit.id });
            }
        }
    }
    return params;
}

export default async function Page({ params }: { params: Promise<{ rankId: string; stageId: string; unitId: string }> }) {
    const { rankId, stageId, unitId } = await params;
    return <UnitPlayerClient rankId={rankId} stageId={stageId} unitId={unitId} />;
}
