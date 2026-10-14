import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import GlowCursor from "@/components/ui/GlowCursor";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050711",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anuecell.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ANU E-Cell NEC | Empowering Innovators & Student Startups",
    template: "%s | ANU E-Cell NEC",
  },
  description:
    "Official Entrepreneurship Cell of Acharya Nagarjuna University (NEC). Fostering innovation, student-led startups, hackathons, incubations, and entrepreneurial leadership.",
  keywords: [
    "ANU E-Cell",
    "NEC E-Cell",
    "Entrepreneurship Cell",
    "Acharya Nagarjuna University",
    "Student Startups",
    "Incubation Center",
    "Innovation Club",
    "Hackathons NEC",
    "E-Summit ANU",
    "Startup Ecosystem Andhra Pradesh",
    "College Entrepreneurship",
  ],
  authors: [{ name: "ANU E-Cell NEC Team", url: baseUrl }],
  creator: "ANU E-Cell NEC",
  publisher: "Acharya Nagarjuna University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "ANU E-Cell NEC",
    title: "ANU E-Cell NEC | Empowering Innovators & Student Startups",
    description:
      "Join the official Entrepreneurship Cell of NEC. We empower students with startup resources, mentorship, workshops, hackathons, and venture incubation.",
    images: [
      {
        url: `${baseUrl}/E-CELL.png`,
        width: 1200,
        height: 630,
        alt: "ANU E-Cell NEC - Entrepreneurship Cell",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ANU E-Cell NEC | Empowering Innovators & Student Startups",
    description:
      "Fostering entrepreneurship, innovation, and startup culture at Acharya Nagarjuna University (NEC).",
    images: [`${baseUrl}/E-CELL.png`],
    creator: "@anuecell",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/E-CELL.png" },
      { url: "/icon.png" }
    ],
    apple: "/E-CELL.png",
    shortcut: "/E-CELL.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-main-bg text-primary-text" suppressHydrationWarning>
        <GlowCursor
          color="#67E8F9"
          secondaryColor="#A78BFA"
          trailLength={40}
          trailWidth={8}
          trailTaper={0.8}
          followSpeed={0.16}
          glowIntensity={1.9}
        />
        {children}
      </body>
    </html>
  );
}
