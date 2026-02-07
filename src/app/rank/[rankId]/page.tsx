import UnitListClient from './client';
import { fetchAudioData } from '@/lib/google-sheets';

export async function generateStaticParams() {
    const data = await fetchAudioData();
    // Ensure all placeholders (and any dynamic ones) are covered
    return data.ranks.map((rank) => ({
        rankId: rank.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ rankId: string }> }) {
    const { rankId } = await params;
    return <UnitListClient rankId={rankId} />;
}
