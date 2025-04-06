import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

<meta name="robots" content="noindex, nofollow" data-whatsapp-url="true" />

export const metadata: Metadata = {
  title: {
    default: 'Ritzi Sneakers | Calzado Premium en Colombia',
    template: '%s | Ritzi Sneakers'
  },
  description: 'Encuentra los sneakers más exclusivos y cómodos. Calzado premium para hombre y mujer con envíos a todo Colombia.',
  keywords: ['sneakers', 'zapatillas premium', 'calzado deportivo', 'moda urbana', 'Colombia'],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://ritzyshoes.vercel.app',
    siteName: 'Ritzi Sneakers',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Ritzi Sneakers - Calzado Premium'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ritzi_sneakers'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large'
    }
  }
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
