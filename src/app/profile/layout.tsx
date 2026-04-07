import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://interfaceiq.vercel.app';

export const metadata: Metadata = {
  title: 'My Profile & History | Interface IQ',
  description: 'View your UI analysis history and overall vibe scores.',
  openGraph: {
    title: 'My Profile & History | Interface IQ',
    description: 'View your UI analysis history and overall vibe scores.',
    type: 'website',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Interface IQ Profile' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Profile & History | Interface IQ',
    description: 'View your UI analysis history and overall vibe scores.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
