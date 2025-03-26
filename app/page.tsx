'use client';

import { Container, Grid, Paper, ScrollArea } from '@mantine/core';
import Introduction from '@/app/components/introduction';
import Skills from '@/app/components/skills';
import PersonalInfo from '@/app/components/personal-info';
import Projects from '@/app/components/projects';

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3 py-7 md:py-18">
      <Container size="lg" className="w-full">
        <Paper
          shadow="xl"
          radius="xl"
          p="xl"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <Grid gutter="xl" px="sm">
            <Grid.Col span="auto">
              <PersonalInfo />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Introduction />
              <ScrollArea h={560} offsetScrollbars scrollbarSize={4} scrollbars="y">
                <Skills />
                <Projects />
              </ScrollArea>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
