'use client';

import { Image, Text } from '@mantine/core';
import NextImage from 'next/image';
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
      <Text span mt="md" c="pink">
        {project.name}
      </Text>
      <Text span mt="md">
        {' '}
        - {project.tech}
      </Text>
    </>
  );
}
