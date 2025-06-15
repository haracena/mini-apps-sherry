import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Social Triggers",
  description:
    "Social Trigger is a platform for creating and managing Telegram group invitations using smart contracts.",
  openGraph: {
    title: "Social Triggers",
    description:
      "Create and manage private Telegram group invitations with blockchain security.",
    url: "https://mini-apps-sherry.vercel.app/",
    siteName: "Social Triggers",
    images: [
      {
        url: "https://mini-apps-sherry.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Social Triggers - Telegram Group Invitations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Triggers",
    description:
      "Create and manage private Telegram group invitations with blockchain security.",
    images: ["https://mini-apps-sherry.vercel.app/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        <Navbar />
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}
