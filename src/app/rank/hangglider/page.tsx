import React from 'react';
import { fetchAudioData } from '@/lib/google-sheets';
import HangGliderGrid from './client';

export default async function HangGliderPage() {
    const data = await fetchAudioData();
    const hangglider = data.ranks.find(r => r.id === 'hangglider');

    if (!hangglider) return <div>Rank not found</div>;

    return <HangGliderGrid stages={hangglider.stages} />;
}
