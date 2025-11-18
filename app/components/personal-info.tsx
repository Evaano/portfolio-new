import { Button, Stack, Text, Title } from '@mantine/core';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { socialMedia } from '@/app/data/data';
import KrixiModel from './krixi-model';

export default function PersonalInfo() {
  const [text] = useTypewriter({
    words: ['Front End Developer', 'Backend Developer', 'Full Stack Developer'],
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 20,
    delaySpeed: 2000,
  });

  return (
    <>
      <KrixiModel />
      <Stack align="center" my="lg">
        <Title order={2}>Evan Rasheed</Title>
        <Text className="tracking-wide" c="pink">
          {text} <Cursor cursorBlinking={true} cursorStyle="|" cursorColor="white" />
        </Text>

        <div className="flex justify-center gap-1 mt-10 pl-3">
          {socialMedia.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              className="hover:text-designColor duration-300 cursor-pointer text-sm"
            >
              <item.Icon />
            </a>
          ))}
        </div>

        <div className="flex h-14 justify-center">
          <Button
            component="a"
            variant="outline"
            href="https://drive.google.com/file/d/1_FhN4P1mtj9KCTKV4Jfi7_UvZafAq4fL/view?usp=drive_link"
            target="_blank"
            c="pink"
          >
            Download CV
          </Button>
        </div>
      </Stack>
    </>
  );
}
