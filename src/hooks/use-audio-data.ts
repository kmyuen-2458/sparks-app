import { useState, useEffect } from 'react';
import { fetchAudioData } from '@/lib/google-sheets';
import { AudioData } from '@/types';

export function useAudioData() {
    const [data, setData] = useState<AudioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAudioData()
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load data');
                setLoading(false);
            });
    }, []);

    return { data, loading, error };
}
