import { languages, frameworks, orms } from '@/app/data/data';

const all = [...languages, ...frameworks, ...orms].map(s => s.name);
const mid = Math.ceil(all.length / 2);
const rowA = all.slice(0, mid);
const rowB = all.slice(mid);

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`flex w-max gap-2 ${reverse ? 'marquee-rev' : 'marquee'}`}>
      {loop.map((name, i) => (
        <span
          key={i}
          className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div
      className="mt-1 flex flex-1 flex-col justify-center gap-2 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </div>
  );
}
