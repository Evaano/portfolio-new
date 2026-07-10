'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Container, Text } from '@mantine/core';
import { motion } from 'motion/react';
import BentoTile from '@/app/components/bento-tile';
import IdentityTile from '@/app/components/identity-tile';
import TechMarquee from '@/app/components/tech-marquee';
import SkillBars from '@/app/components/skill-bars';
import ProjectsStack from '@/app/components/projects-stack';
import Introduction from '@/app/components/introduction';
import { languages, frameworks, orms } from '@/app/data/data';

// three.js is ~150kB of the initial bundle for a decorative tile — keep it out
// of the critical path so the deck paints without waiting on it.
const KrixiModel = dynamic(() => import('@/app/components/krixi-model'), { ssr: false });

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
};

function TileLabel({ children }: { children: string }) {
  return (
    <Text size="xs" tt="uppercase" c="pink" fw={600} mb="xs" style={{ letterSpacing: '0.14em' }}>
      {children}
    </Text>
  );
}

function DeckSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="snap-panel flex min-h-[100dvh] w-full items-center justify-center px-3 py-16 md:px-6"
    >
      <Container size="lg" className="w-full">
        <motion.div
          variants={grid}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-3 md:grid-cols-6"
        >
          {children}
        </motion.div>
      </Container>
    </section>
  );
}

const NAV = [
  { id: 'intro', label: 'Intro' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Projects' },
];

function SectionNav() {
  const [active, setActive] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-4 md:right-7"
    >
      {NAV.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          aria-label={label}
          aria-current={active === id}
          className="group flex items-center gap-2"
        >
          <span
            className={`text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
              active === id
                ? 'text-pink-400 opacity-100'
                : 'text-white/50 opacity-0 group-hover:opacity-100'
            }`}
          >
            {label}
          </span>
          <span
            className={`block h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
              active === id
                ? 'border-pink-400 bg-pink-400'
                : 'border-white/40 bg-transparent group-hover:border-pink-300'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <div className="snap-scroller">
        <DeckSection id="intro">
          <motion.div variants={item} className="md:col-span-4">
            <BentoTile>
              <IdentityTile />
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-2 md:row-span-3">
            <BentoTile noLift className="!p-0">
              <div className="-m-[1px] h-full">
                <KrixiModel height="100%" />
              </div>
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-4">
            <BentoTile>
              <TileLabel>About Me</TileLabel>
              <Introduction hideHeading />
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-4">
            <BentoTile>
              <TileLabel>Tech I work with</TileLabel>
              <TechMarquee />
            </BentoTile>
          </motion.div>
        </DeckSection>

        <DeckSection id="skills">
          <motion.div variants={item} className="md:col-span-3">
            <BentoTile>
              <TileLabel>Languages</TileLabel>
              <SkillBars skills={languages} />
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-3">
            <BentoTile>
              <TileLabel>Frameworks &amp; Libraries</TileLabel>
              <SkillBars skills={frameworks} />
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-3">
            <BentoTile>
              <TileLabel>ORMs</TileLabel>
              <SkillBars skills={orms} />
            </BentoTile>
          </motion.div>
          <motion.div variants={item} className="md:col-span-3">
            <BentoTile>
              <TileLabel>Development Practices</TileLabel>
              <div className="mt-1 space-y-2 text-sm">
                <Text size="sm">• Agile methodologies</Text>
                <Text size="sm">• Code reviews</Text>
                <Text size="sm">• REST API System Integration</Text>
                <Text size="sm">• CI/CD pipelines</Text>
              </div>
            </BentoTile>
          </motion.div>
        </DeckSection>

        <ProjectsStack />
      </div>

      <SectionNav />
    </>
  );
}
