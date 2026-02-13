import WatchTimeline from "@/components/WatchTimeline";
import watches from "@/data/watches.json";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <WatchTimeline watches={watches} />
    </main>
  );
}
