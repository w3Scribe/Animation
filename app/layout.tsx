import SkipToContent from '@/components/SkipToContent';
import { getBaseUrl, siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';
import { Fira_Code, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-primary',
  subsets: ['latin'],
  display: 'swap',
});

const firaCode = Fira_Code({
  variable: '--font-code',
  subsets: ['latin'],
  display: 'swap',
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteConfig.name} – GSAP & Framer Motion`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: baseUrl,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${firaCode.variable} bg-[#09090b] font-sans text-white antialiased`}
      >
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
