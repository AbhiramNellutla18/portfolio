import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import './globals.css';
import './glass.css';
import './lab-details.css';
import './notebook.css';
const shareImage = {
  url: '/og.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'Abhiram Nellutla, Artificial Intelligence and Machine Learning student at GRIET, with a two-class decision boundary illustration.',
};

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: 'Abhiram Nellutla — The Creative Engineer',
    template: '%s · Abhiram Nellutla',
  },
  description: 'Abhiram Nellutla studies Artificial Intelligence and Machine Learning at GRIET in Hyderabad. Explore his project notes, interactive ML experiments and work on GitHub.',
  authors: [{ name: profile.name }],
  alternates: { canonical: './' },
  icons: { icon: { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' } },
  // Next fills social titles and descriptions from the current page, including case studies.
  openGraph: {
    type: 'website',
    siteName: 'Abhiram Nellutla',
    locale: 'en_IN',
    url: './',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [shareImage],
  },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip" href="#main">Skip to content</a>{children}</body></html>}
