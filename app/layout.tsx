import './globals.css';
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Background } from '@/app/components/background';
import { theme } from '@/app/theme';

export const metadata = {
  title: 'Evan Rasheed – Full-Stack Developer Portfolio',
  description: `Dedicated Full-Stack Developer with a track record of delivering
    innovative and reliable software solutions. Skilled in system integration,
    CI/CD, React, Node, and more. Committed to leveraging expertise in full-stack
    technologies to develop efficient, scalable applications.`,
  openGraph: {
    title: 'Evan Rasheed – Full-Stack Developer Portfolio',
    description: `Dedicated Full-Stack Developer with a track record of delivering
      innovative and reliable software solutions. Skilled in system integration,
      CI/CD, React, Node, and more.`,
    url: 'https://portfolio-new-one-taupe.vercel.app/',
    images: [
      {
        url: 'https://i.imgur.com/jetbxPR.jpeg',
        width: 1200,
        height: 630,
        alt: 'Evan Rasheed Portfolio Preview',
      },
    ],
    type: 'website',
    siteName: 'Evan Rasheed Portfolio',
  },
  keywords: ['Full-Stack Developer', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Portfolio'],
  authors: [{ name: 'Evan Rasheed', url: 'https://portfolio-new-one-taupe.vercel.app/' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme="dark">
          <Background />
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
