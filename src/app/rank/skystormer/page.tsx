import React from 'react';
import { fetchAudioData } from '@/lib/google-sheets';
import SkyStormerGrid from './client';

export default async function SkyStormerPage() {
    const data = await fetchAudioData();
    const skystormer = data.ranks.find(r => r.id === 'skystormer');

    if (!skystormer) return <div>Rank not found</div>;

    return <SkyStormerGrid stages={skystormer.stages} />;
}
