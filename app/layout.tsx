import './globals.css';
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Background } from '@/app/components/background';
import { theme } from '@/app/theme';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
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
