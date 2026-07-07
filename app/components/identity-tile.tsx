'use client';

import { Button, Text, Title } from '@mantine/core';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { IconDownload } from '@tabler/icons-react';
import { socialMedia } from '@/app/data/data';

export default function IdentityTile() {
  const [text] = useTypewriter({
    words: ['Front End Developer', 'Backend Developer', 'Full Stack Developer'],
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 20,
    delaySpeed: 2000,
  });

  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Text size="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: '0.2em' }}>
        Portfolio
      </Text>
      <Title order={1} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.05 }}>
        Evan Rasheed
      </Title>
      <Text c="pink" fw={500} className="tracking-wide">
        {text}
        <Cursor cursorBlinking cursorStyle="|" cursorColor="white" />
      </Text>

      <div className="mt-2 flex items-center gap-4">
        <div className="flex gap-3">
          {socialMedia.map(item => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition-colors duration-300 hover:text-pink-400"
            >
              <item.Icon size={22} />
            </a>
          ))}
        </div>
        <Button
          component="a"
          href="/CV.pdf"
          target="_blank"
          variant="outline"
          color="pink"
          size="xs"
          leftSection={<IconDownload size={15} />}
        >
          Download CV
        </Button>
      </div>
    </div>
  );
}
