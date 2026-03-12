import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'TikTok Growth Engine — AI Marketing Platform',
  description: 'AI-powered viral scripts, hooks, and trend analysis for TikTok and Instagram growth.',
};

import { LanguageProvider } from '@/components/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
