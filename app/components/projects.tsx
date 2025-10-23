'use client';

import { Grid, Title } from '@mantine/core';
import ProjectCard from '@/app/components/project-card';
import { projects } from '@/app/data/data';

export default function Projects() {
  return (
    <>
      <Title order={2} c="pink" mt="md">
        Projects
      </Title>
      <Grid grow gutter="sm">
        {projects.map(project => (
          <Grid.Col key={project.name} span={{ base: 12, md: 6 }}>
            <ProjectCard project={project} />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
