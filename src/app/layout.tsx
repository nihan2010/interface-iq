import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://interfaceiq.vercel.app'; // Update this when you deploy!

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // ── Core ────────────────────────────────────────────
  title: {
    default: 'Interface IQ — AI-Powered UI Design Analyzer',
    template: '%s | Interface IQ',
  },
  description:
    'Upload any UI screenshot and get instant AI feedback on hierarchy, spacing, contrast, accessibility, and more. Rate and critique designs in the community Arena. Built by Nihan Najeeb from Kerala.',
  keywords: [
    'UI design analyzer',
    'AI design feedback',
    'UI rating tool',
    'interface critique',
    'design accessibility checker',
    'UX analysis AI',
    'UI Arena',
    'web design feedback',
    'Nihan Najeeb',
    'Interface IQ',
  ],
  authors: [{ name: 'Nihan Najeeb', url: 'https://nihannajeeb.in' }],
  creator: 'Nihan Najeeb',
  publisher: 'Interface IQ',

  // ── Robots & Indexing ───────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp) ───────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Interface IQ',
    title: 'Interface IQ — AI-Powered UI Design Analyzer',
    description:
      'Get instant AI analysis on any UI design. Rate, critique, and improve interfaces in the Arena. Free tool by Nihan Najeeb.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Interface IQ — AI-Powered UI Design Analyzer',
      },
    ],
  },

  // ── Twitter / X Cards ───────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Interface IQ — AI-Powered UI Design Analyzer',
    description:
      'Upload a UI screenshot → get instant AI scores on spacing, contrast, hierarchy & more. Join the Arena to rate other designs.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@nihannajeeb',
  },

  // ── Icons & PWA ─────────────────────────────────────
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  manifest: '/manifest.json',

  // ── Canonical ────────────────────────────────────────
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body
          className="min-h-full flex flex-col bg-background text-foreground relative z-0"
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="bg-noise" />
            <Header />
            <main className="flex-1 relative z-10">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
