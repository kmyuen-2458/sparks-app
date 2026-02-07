'use client';

import { useAudioData } from '@/hooks/use-audio-data';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data, loading, error } = useAudioData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 space-y-4">
        <div className="animate-bounce">
          <Image src="/logo.png" alt="Sparks Logo" width={150} height={80} className="object-contain" />
        </div>
        <div className="text-2xl font-bold text-blue-600 animate-pulse">Loading Sparks Audio...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-red-50 text-red-800">
        <h1 className="text-3xl font-bold mb-4">Oh no!</h1>
        <p className="text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg active:scale-95 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-sky-100 font-sans pb-20 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full space-y-8">
        <header className="flex flex-col items-center justify-center pt-8 pb-4">
          <div className="relative w-64 h-24 mb-4 filter drop-shadow-md hover:scale-105 transition-transform duration-300">
            <Image src="/logo.png" alt="Sparks Logo" fill className="object-contain" priority />
          </div>
          <p className="text-blue-700 font-bold text-lg bg-white/50 px-8 py-2 rounded-full shadow-sm backdrop-blur-sm border border-white/50">
            Choose Your Rank!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-0">
          {data.ranks.length === 0 && (
            <div className="col-span-full p-6 bg-yellow-100 rounded-2xl border-2 border-yellow-300 text-yellow-800 text-center shadow-lg">
              <p className="font-bold text-xl mb-2">No Ranks Found</p>
              <p>Check the Google Sheet!</p>
            </div>
          )}

          {data.ranks.map((rank) => {
            const imagePath = getRankImage(rank.title);

            return (
              <Link
                key={rank.id}
                href={`/rank/${rank.id}`}
                className="group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95 duration-300"
              >
                {/* Image Container - Reduced width (75%) */}
                <div className="relative w-[75%] aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-blue-400/50 transition-all">
                  <Image
                    src={imagePath}
                    alt={rank.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 75vw, 25vw"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Stage Count Pill */}
                <div className="mt-4 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md font-bold text-sm text-slate-600 group-hover:text-blue-600 transition-colors border border-white/50">
                  {rank.stages?.length || 0} Stages
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-xs">
          <p className="opacity-50">Spark Your Adventure!</p>
        </div>
      </div>
    </main>
  );
}

function getRankImage(title: string) {
  const t = title.toLowerCase();
  if (t.includes('hangglider') || t.includes('hang')) {
    return '/ranks/hangglider.png';
  }
  if (t.includes('wingrunner') || t.includes('wing')) {
    return '/ranks/wingrunner.png';
  }
  if (t.includes('skystormer') || t.includes('sky')) {
    return '/ranks/skystormer.png';
  }
  // Fallback placeholder if needed, or specific default
  return '/logo.png';
}
