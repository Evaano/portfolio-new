'use client';

import { Image, Text, Anchor, Stack } from '@mantine/core';
import NextImage from 'next/image';
import { IconExternalLink } from '@tabler/icons-react';
import type { Project } from '@/app/data/data';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <>
      <Image
        component={NextImage}
        radius="sm"
        src={project.src}
        alt={project.alt ?? 'banner'}
        mt="sm"
      />
      <Stack gap={4} mt="md">
        <Text span c="pink">
          {project.name}
        </Text>
        <Text span size="sm">
          {' '}
          - {project.tech}
        </Text>
        {project.liveUrl && (
          <Anchor
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            c="pink"
            size="sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IconExternalLink size={14} />
            Live Site
          </Anchor>
        )}
        {project.loginInfo && (
          <Text span size="xs" c="dimmed" mt={4}>
            {project.loginInfo}
          </Text>
        )}
      </Stack>
    </>
  );
}
