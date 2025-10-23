import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
} from '@tabler/icons-react';
import type { StaticImageData } from 'next/image';
import store from '@/public/store.png';
import hotel from '@/public/hotel-booking.png';
import three from '@/public/3d.jpg';
import game from '@/public/game.jpg';
import uber from '@/public/uber.jpg';
import pos from '@/public/pos.png';
import pet from '@/public/lost-pet.jpg';
import hr from '@/public/hr.png';

export const languages = [
  { name: 'JavaScript/Typescript', level: 'w-[95%]' },
  { name: 'Python', level: 'w-[90%]' },
  { name: 'PHP', level: 'w-[45%]' },
  { name: 'SQL', level: 'w-[75%]' },
  { name: 'C', level: 'w-[80%]' },
];

export const frameworks = [
  { name: 'Remix/React Router v7', level: 'w-[90%]' },
  { name: 'Next', level: 'w-[80%]' },
  { name: 'React', level: 'w-[85%]' },
  { name: 'Laravel', level: 'w-[50%]' },
  { name: '.Net Core', level: 'w-[40%]' },
  { name: 'Three.js', level: 'w-[60%]' },
];

export const orms = [
  { name: 'Drizzle', level: 'w-[65%]' },
  { name: 'Prisma', level: 'w-[90%]' },
  { name: 'Entity Framework', level: 'w-[40%]' },
  { name: 'Eloquent', level: 'w-[50%]' },
];

export const socialMedia = [
  { Icon: IconBrandGithub, href: 'https://github.com/evaano' },
  {
    Icon: IconBrandLinkedin,
    href: 'https://www.linkedin.com/in/evan-rashyd-603a20292/',
  },
  { Icon: IconBrandTwitter, href: 'https://twitter.com/EvanRashyd' },
  { Icon: IconBrandInstagram, href: 'https://www.instagram.com/evanwhenmewhen' },
  { Icon: IconBrandFacebook, href: 'https://facebook.com/evan.rasheed' },
];

export type Project = {
  name: string;
  tech: string;
  src: StaticImageData;
  alt?: string;
};

export const projects: Project[] = [
  {
    name: 'POS',
    tech: 'React Router v7, Mantine',
    src: pos,
    alt: 'POS banner',
  },
  {
    name: 'HR App',
    tech: 'Laravel, React',
    src: hr,
    alt: 'HR App banner',
  },
  {
    name: 'Hotel Booking System - College',
    tech: 'Laravel, Blade',
    src: hotel,
    alt: 'Hotel booking banner',
  },
  {
    name: 'Store App',
    tech: 'Remix, Mantine',
    src: store,
    alt: 'Store app banner',
  },
  {
    name: '3D Website',
    tech: 'Three Js',
    src: three,
    alt: '3D website banner',
  },
  {
    name: 'Game',
    tech: 'Pixi Js',
    src: game,
    alt: 'Game banner',
  },
  {
    name: 'Uber lite',
    tech: 'React Native',
    src: uber,
    alt: 'Uber lite banner',
  },
  {
    name: 'Lost Pet Finder',
    tech: 'React Native',
    src: pet,
    alt: 'Lost pet finder banner',
  },
];
