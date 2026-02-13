"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface Watch {
  id: string;
  year: number;
  name: string;
  description: string;
  image: string;
  type: string;
}

export default function WatchTimeline({ watches }: { watches: Watch[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 z-50 bg-black/50 backdrop-blur-md border-b border-yellow-900/20">
        <h1 className="text-xl md:text-2xl font-serif tracking-[0.3em] text-yellow-600 uppercase text-center">
          The Crown Archive
        </h1>
      </header>

      {/* Pure CSS Scrolling Gallery */}
      <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto space-y-32">
        {watches.map((watch) => (
          <section 
            key={watch.id} 
            className="flex flex-col md:flex-row items-center gap-12 min-h-[60vh] border-b border-yellow-900/10 pb-24 last:border-0"
          >
            <div className="relative w-full max-w-sm aspect-square bg-gradient-to-b from-yellow-900/5 to-transparent rounded-3xl p-8">
              <Image
                src={watch.image}
                alt={watch.name}
                fill
                className="object-contain drop-shadow-2xl"
                priority
                unoptimized
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <span className="text-yellow-600 font-mono text-sm tracking-widest uppercase block mb-2">
                  Since {watch.year}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tight">
                  {watch.name}
                </h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed italic font-light max-w-xl">
                "{watch.description}"
              </p>
              <div className="pt-4">
                 <span className="inline-block px-4 py-2 border border-yellow-900/30 text-yellow-700 text-xs uppercase tracking-widest rounded-full">
                   Collection {watch.type}
                 </span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="p-12 text-center border-t border-yellow-900/10">
        <p className="text-yellow-900/40 text-[10px] uppercase tracking-[0.5em]">Rolex Museum — 2026</p>
      </footer>
    </div>
  );
}
