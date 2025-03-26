'use client';

import { Image } from '@mantine/core';
import bannerImage from '@/public/bannerImg.webp';

export default function ImageBanner() {
  return (
    <>
      <Image radius="md" src={bannerImage} />
    </>
  );
}
