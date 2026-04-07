import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://interfaceiq.vercel.app';

export const metadata: Metadata = {
  title: 'UI Arena Feed | Interface IQ',
  description: 'View the latest UI comparisons and hot takes from the community.',
  openGraph: {
    title: 'UI Arena Feed | Interface IQ',
    description: 'View the latest UI comparisons and hot takes from the community.',
    type: 'website',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'UI Arena Feed' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI Arena Feed | Interface IQ',
    description: 'View the latest UI comparisons and hot takes from the community.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
