'use client';

import { Text, Title } from '@mantine/core';

export default function Introduction({ hideHeading = false }: { hideHeading?: boolean }) {
  return (
    <>
      {!hideHeading && (
        <Title order={2} c="pink">
          About Me
        </Title>
      )}
      <Text mt={hideHeading ? 0 : 'md'}>
        Dedicated Full-Stack Developer with a track record of delivering innovative and reliable
        software solutions. Skilled in system integration, API development, and creating seamless
        user experiences. Committed to leveraging expertise in full-stack technologies to develop
        efficient, scalable applications.
      </Text>
    </>
  );
}
