"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-slate-950">
      {/* Background Crown Logo (Fixed) */}
      <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[80vw] h-[80vw] border-[1px] border-rolex-gold rounded-full" />
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Navigation / Progress */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-50">
          {watches.map((watch, i) => {
            return (
              <div key={watch.id} className="group flex items-center gap-4">
                <div className="h-[1px] w-4 bg-rolex-gold/30 group-hover:w-8 transition-all" />
                <span className="text-xs font-mono text-rolex-gold/50 group-hover:text-rolex-gold transition-colors">
                  {watch.year}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Slider */}
        <div className="relative w-full max-w-7xl px-4 md:px-24">
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
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <h1 className="text-2xl font-serif tracking-[0.2em] text-rolex-gold uppercase">The Crown Archive</h1>
        <div className="text-xs tracking-widest uppercase text-rolex-gold/80">Est. 1905 — Geneva</div>
      </header>

      {/* Footer / Scroll Hint */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-rolex-gold/50">Scroll to explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-rolex-gold to-transparent" />
        </motion.div>
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
  
  const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [100, 0, 0, -100]);
  const imageRotate = useTransform(scrollYProgress, [start, end], [0, 15]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className={cn(
        "absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12"
      )}
    >
      {/* Watch Image */}
      <div className="relative w-full max-w-md aspect-square">
        <motion.div 
          style={{ rotate: imageRotate }}
          className="relative w-full h-full drop-shadow-[0_35px_35px_rgba(163,126,44,0.2)]"
        >
          <Image
            src={watch.image}
            alt={watch.name}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </motion.div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-rolex-gold/10 blur-[120px] rounded-full -z-10" />
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <div className="space-y-2">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-rolex-gold font-mono text-sm tracking-widest uppercase"
          >
            Since {watch.year}
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-white leading-tight">
            {watch.name}
          </h2>
        </div>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-light italic">
          "{watch.description}"
        </p>

        <div className="pt-8 flex flex-wrap gap-4 justify-center md:justify-start">
          <button className="px-8 py-3 border border-rolex-gold text-rolex-gold hover:bg-rolex-gold hover:text-slate-950 transition-all duration-500 uppercase tracking-widest text-xs">
            Discover Heritage
          </button>
          <div className="px-8 py-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 text-slate-500 text-xs uppercase tracking-widest flex items-center">
            Ref. {watch.id.split('-')[1]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
