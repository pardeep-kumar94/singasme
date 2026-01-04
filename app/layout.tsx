import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-libre-baskerville',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SingAs me - AI Voice Cloning | Transform Any Song Into Your Voice",
  description: "Clone your voice with AI technology in minutes. Upload any MP3 and hear yourself singing your favorite songs with studio-quality results. Join the waitlist for early access to the future of AI voice cloning.",
  keywords: [
    "AI voice cloning",
    "voice clone",
    "AI voice generator",
    "voice transformation",
    "text to speech",
    "voice synthesis",
    "AI voice technology",
    "clone my voice",
    "AI singing voice",
    "voice changer AI",
    "deep learning voice",
    "voice AI",
    "synthetic voice",
    "voice replication",
    "AI audio cloning",
    "sing as me",
    "AI singing"
  ],
  authors: [{ name: "SingAs me" }],
  creator: "SingAs me",
  publisher: "SingAs me",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://singasme.ai",
    title: "SingAs me - AI Voice Cloning | Transform Any Song Into Your Voice",
    description: "Clone your voice with AI technology in minutes. Upload any MP3 and hear yourself singing your favorite songs with studio-quality results.",
    siteName: "SingAs me",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SingAs me - AI Voice Cloning Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SingAs me - AI Voice Cloning | Transform Any Song Into Your Voice",
    description: "Clone your voice with AI technology in minutes. Upload any MP3 and hear yourself singing your favorite songs with studio-quality results.",
    images: ["/og-image.jpg"],
    creator: "@singasme",
  },
  metadataBase: new URL("https://singasme.ai"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${geistSans.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
