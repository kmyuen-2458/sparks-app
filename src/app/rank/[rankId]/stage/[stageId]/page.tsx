import StageListClient from './client';
import { fetchAudioData } from '@/lib/google-sheets';

export async function generateStaticParams() {
    const data = await fetchAudioData();
    const params = [];
    for (const rank of data.ranks) {
        if (!rank.stages) continue;
        for (const stage of rank.stages) {
            params.push({ rankId: rank.id, stageId: stage.id });
        }
    }
    return params;
}

export default async function Page({ params }: { params: Promise<{ rankId: string; stageId: string }> }) {
    const { rankId, stageId } = await params;
    return <StageListClient rankId={rankId} stageId={stageId} />;
}
