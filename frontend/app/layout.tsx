import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/lib/store';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taap Alert — heat-stress early warning for outdoor workers',
  description:
    'Anomaly-relative heat-stress warnings for construction and MGNREGA workers across all 33 districts of Rajasthan. Graded advisories, work-rest cycles, hydration and cooling stations in Hindi and Marwari.',
  applicationName: 'Taap Alert',
  authors: [{ name: 'GBX-AI' }],
  keywords: ['heat stress', 'Rajasthan', 'early warning', 'MGNREGA', 'BOCW', 'occupational health'],
  openGraph: {
    title: 'Taap Alert',
    description: 'Heat-stress early warning for outdoor workers in Rajasthan.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1eee9' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0c0b' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** Applies the stored theme before first paint so the page never flashes the wrong one. */
const THEME_BOOTSTRAP = `(function(){try{
  var t=localStorage.getItem('taap.theme');
  if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'taap-dark':'taap';}
  document.documentElement.setAttribute('data-theme',t);
  var l=localStorage.getItem('taap.locale'); if(l){document.documentElement.lang=l;}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="taap" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Anek+Devanagari:wght@400;500;600;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="bg-base-200 text-base-content">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
