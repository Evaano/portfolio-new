'use client';

import { Grid, Image, Text, Title } from '@mantine/core';
import NextImage from 'next/image';
import store from '@/public/store.png';
import intranet from '@/public/intranet.png';
import three from '@/public/3d.jpg';
import game from '@/public/game.jpg';
import uber from '@/public/uber.jpg';
import pos from '@/public/pos.png';

export default function Projects() {
  return (
    <>
      <Title order={2} c="pink" mt="md">
        Projects
      </Title>
      <Grid grow gutter="sm">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={three} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            3D Website
          </Text>
          <Text span mt="md">
            {' '}
            - Three Js
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={game} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            Game
          </Text>
          <Text span mt="md">
            {' '}
            - Pixi Js
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={intranet} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            Intranet
          </Text>
          <Text span mt="md">
            {' '}
            - React Router v7, Mantine (frontend)
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={store} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            Store App
          </Text>
          <Text span mt="md">
            {' '}
            - Remix, Mantine (Full-Stack)
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={uber} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            Uber lite
          </Text>
          <Text span mt="md">
            {' '}
            - React Native
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image component={NextImage} radius="sm" src={pos} alt={'banner'} mt="sm" />
          <Text span mt="md" c="pink">
            POS
          </Text>
          <Text span mt="md">
            {' '}
            - React Router v7, Mantine (Full-Stack)
          </Text>
        </Grid.Col>
      </Grid>
    </>
  );
}
