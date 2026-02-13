"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rolex-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-slate-950 selection:bg-rolex-gold/30">
      <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border-[1px] border-rolex-gold rounded-full" />
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50">
          {watches.map((watch) => (
            <div key={watch.id} className="group flex items-center gap-4">
              <div className="h-[1px] w-4 bg-rolex-gold/30 group-hover:w-8 transition-all duration-500" />
              <span className="text-[10px] font-mono tracking-tighter text-rolex-gold/40 group-hover:text-rolex-gold transition-colors">
                {watch.year}
              </span>
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-7xl px-4 md:px-24 h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {watches.map((watch, index) => (
              <WatchSlide 
                key={watch.id} 
                watch={watch} 
                index={index} 
                total={watches.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-[100] mix-blend-difference pointer-events-none">
        <h1 className="text-xl md:text-2xl font-serif tracking-[0.3em] text-rolex-gold uppercase pointer-events-auto">The Crown Archive</h1>
        <div className="text-[10px] tracking-[0.4em] uppercase text-rolex-gold/70 hidden sm:block">Est. 1905 — Geneva</div>
      </header>

      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] tracking-[0.5em] uppercase text-rolex-gold/40">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-rolex-gold/60 to-transparent" />
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
  
  // High-performance transforms with safe thresholds
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, start + 0.08, end - 0.08, end], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [start, start + 0.08, end - 0.08, end], [40, 0, 0, -40]);

  // Use a state to handle pointer events safely to avoid hydration/render conflicts
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v: number) => {
      setIsVisible(v >= start && v <= end);
    });
    return () => unsubscribe();
  }, [scrollYProgress, start, end]);

  return (
    <motion.div
      style={{ 
        opacity, 
        scale, 
        y,
        pointerEvents: isVisible ? "auto" : "none",
        zIndex: isVisible ? 20 : 10
      }}
      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 py-20"
    >
      <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex-shrink-0">
        <div className="relative w-full h-full drop-shadow-[0_25px_50px_rgba(163,126,44,0.15)]">
          <Image
            src={watch.image}
            alt={watch.name}
            fill
            className="object-contain"
            priority={index === 0}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-rolex-gold/5 blur-[100px] rounded-full -z-10" />
      </div>

      <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-center lg:justify-start gap-3">
             <div className="h-[1px] w-8 bg-rolex-gold/50" />
             <span className="text-rolex-gold font-mono text-[11px] tracking-[0.3em] uppercase">
               Since {watch.year}
             </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tight text-white leading-[1.1]">
            {watch.name}
          </h2>
        </div>
        
        <p className="text-slate-400 text-base md:text-lg leading-relaxed font-light italic opacity-80 border-l border-rolex-gold/20 pl-6 mx-auto lg:mx-0">
          "{watch.description}"
        </p>

        <div className="pt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
          <button className="px-10 py-3.5 bg-rolex-gold text-slate-950 font-bold hover:bg-white transition-colors duration-500 uppercase tracking-widest text-[10px]">
            Heritage
          </button>
          <div className="px-8 py-3.5 border border-slate-800 text-slate-500 text-[10px] uppercase tracking-[0.2em] bg-slate-900/20 backdrop-blur-sm">
            Ref. {watch.id.split('-')[1] || watch.id.toUpperCase()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
