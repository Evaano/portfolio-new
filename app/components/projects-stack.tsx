'use client';

import NextImage from 'next/image';
import { Anchor, Text, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { projects, type Project } from '@/app/data/data';

// Live auto-screenshot for deployed sites without a local thumbnail.
const shotUrl = (url: string) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=750`;

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const total = projects.length;
  return (
    <section
      id={index === 0 ? 'work' : undefined}
      className="snap-panel flex min-h-[100dvh] w-full items-center justify-center px-4 py-16 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.4, margin: '-10% 0px' }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
        style={{ height: 'min(72vh, 640px)' }}
      >
        {project.src ? (
          <NextImage
            src={project.src}
            alt={project.alt ?? project.name}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.liveUrl ? shotUrl(project.liveUrl) : ''}
            alt={project.alt ?? project.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full bg-white/5 object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 md:p-8">
          <Text size="xs" c="pink" tt="uppercase" fw={600} style={{ letterSpacing: '0.18em' }}>
            Projects
          </Text>
          <Text size="xs" c="dimmed" fw={600} style={{ letterSpacing: '0.1em' }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 md:p-8">
          <Text size="xs" c="pink" tt="uppercase" fw={600} style={{ letterSpacing: '0.14em' }}>
            {project.tech}
          </Text>
          <Title order={2} c="white" size="h1" style={{ letterSpacing: '-0.02em' }}>
            {project.name}
          </Title>
          {project.liveUrl && (
            <Anchor
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              c="pink"
              size="sm"
              className="inline-flex w-fit items-center gap-1"
            >
              <IconExternalLink size={16} />
              Visit live site
            </Anchor>
          )}
          {project.loginInfo && (
            <Text size="xs" c="dimmed">
              {project.loginInfo}
            </Text>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default function ProjectsStack() {
  return (
    <>
      {projects.map((project, i) => (
        <ProjectPanel key={project.name} project={project} index={i} />
      ))}
    </>
  );
}
