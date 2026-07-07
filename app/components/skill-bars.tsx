'use client';

import { Text } from '@mantine/core';
import { motion } from 'motion/react';

type Skill = { name: string; level: string };

// level looks like 'w-[95%]' — pull the number out for the animated width
const toPercent = (level: string) => Number(level.match(/(\d+)/)?.[1] ?? 0);

export default function SkillBars({ skills }: { skills: Skill[] }) {
  return (
    <div className="mt-1 space-y-2.5">
      {skills.map((skill, i) => (
        <div key={skill.name}>
          <div className="mb-1 flex items-center justify-between">
            <Text size="xs">{skill.name}</Text>
            <Text size="xs" c="dimmed">
              {toPercent(skill.level)}%
            </Text>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a90039, #f66e99)' }}
              initial={{ width: 0 }}
              whileInView={{ width: `${toPercent(skill.level)}%` }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
