'use client';

import { Divider, Grid, Text } from '@mantine/core';
import { frameworks, languages, orms } from '@/app/data/data';
import { renderSkillsWithProgressBar } from '@/app/utils';

export default function Skills() {
  return (
    <>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mt="md" c="pink">
            Languages
          </Text>
          <Divider color="white" />
          {renderSkillsWithProgressBar(languages)}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mt="md" c="pink">
            Frameworks & Libraries
          </Text>
          <Divider color="white" />
          {renderSkillsWithProgressBar(frameworks)}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mt="md" c="pink">
            ORMs
          </Text>
          <Divider color="white" />
          {renderSkillsWithProgressBar(orms)}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mt="md" c="pink">
            Development Practices
          </Text>
          <Divider color="white" />
          <div className="space-y-2 mt-2">
            <Text size="sm">• Agile methodologies</Text>
            <Text size="sm">• Code reviews</Text>
            <Text size="sm">• REST API System Integration</Text>
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
}
