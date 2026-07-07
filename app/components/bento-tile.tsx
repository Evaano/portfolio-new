'use client';

import { motion } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import ElectricBorder from './electric-border';

type BentoTileProps = {
  children: ReactNode;
  className?: string;
  /** disable the hover lift (e.g. for the tall 3D tile) */
  noLift?: boolean;
};

export default function BentoTile({ children, className = '', noLift = false }: BentoTileProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <ElectricBorder color="#ff5da2" borderRadius={20} chaos={0.06} speed={0.6}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        whileHover={noLift ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`bento-tile ${className}`}
      >
        <div className="bento-tile__spot" aria-hidden />
        <div className="bento-tile__inner">{children}</div>
      </motion.div>
    </ElectricBorder>
  );
}
