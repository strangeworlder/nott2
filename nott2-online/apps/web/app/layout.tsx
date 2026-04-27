import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Night of the Thirteenth 2 — Online Play',
  description:
    'Online multiplayer companion for Night of the Thirteenth 2, the premium horror TTRPG.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ margin: 0, backgroundColor: '#0a0a0a', color: '#e8e8e8' }}>
        {children}
      </body>
    </html>
  );
}
