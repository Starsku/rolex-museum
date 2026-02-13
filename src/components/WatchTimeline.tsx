"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Watch {
  id: string;
  year: number;
  name: string;
  description: string;
  image: string;
  type: string;
}

export default function WatchTimeline({ watches }: { watches: Watch[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-black">
      <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
        <div className="w-[80vw] h-[80vw] max-w-[800px] border border-yellow-600 rounded-full" />
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        <div className="relative w-full max-w-7xl px-4 md:px-24 h-full flex items-center justify-center">
          {watches.map((watch, index) => (
            <WatchSlide 
              key={watch.id} 
              watch={watch} 
              index={index} 
              total={watches.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
      
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference pointer-events-none">
        <h1 className="text-xl md:text-2xl font-serif tracking-[0.3em] text-yellow-600 uppercase pointer-events-auto">The Crown Archive</h1>
      </header>

      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] tracking-[0.5em] uppercase text-yellow-600/40">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-600/60 to-transparent" />
        </div>
      </footer>
    </div>
  );
}

function WatchSlide({ 
  watch, 
  index, 
  total, 
  scrollYProgress 
}: { 
  watch: Watch; 
  index: number; 
  total: number;
  scrollYProgress: any;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  
  // Use generic useTransform and avoid any side effects during render
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [20, 0, 0, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6"
    >
      <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-square">
        <Image
          src={watch.image}
          alt={watch.name}
          fill
          className="object-contain"
          priority={index === 0}
          unoptimized
        />
      </div>

      <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
        <span className="text-yellow-600 font-mono text-[11px] tracking-[0.3em] uppercase block">
          Since {watch.year}
        </span>
        <h2 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tight">
          {watch.name}
        </h2>
        <p className="text-gray-400 text-base leading-relaxed italic font-light">
          "{watch.description}"
        </p>
      </div>
    </motion.div>
  );
}
