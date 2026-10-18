import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION = `Interactive educational platform for industrial valves, pumps, mechanical engineering and control system automation, created by ${AUTHOR}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} by ${AUTHOR} - Industrial Valve & Fluid Dynamics Academy`,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR, url: SITE_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,
  keywords: [AUTHOR, SITE_NAME, "industrial valves", "pumps", "3D models", "pumping station", "fluid mechanics"],
  openGraph: {
    type: "website",
    siteName: `${SITE_NAME} by ${AUTHOR}`,
    title: `${SITE_NAME} by ${AUTHOR}`,
    description: DESCRIPTION,
  },
};

// Tells search engines who made the site (schema.org structured data).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: `${SITE_NAME} by ${AUTHOR}`,
  url: SITE_URL,
  description: DESCRIPTION,
  author: { "@type": "Person", name: AUTHOR },
  creator: { "@type": "Person", name: AUTHOR },
  copyrightHolder: { "@type": "Person", name: AUTHOR },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
