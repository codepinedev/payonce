import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PayOnce - Buy Mac Apps Once, Own Them Forever",
  description:
    "A curated directory of one-time purchase macOS apps for Mac users done with subscriptions.",
  keywords: [
    "macOS apps",
    "mac software",
    "mac apps",
    "one-time purchase",
    "no subscription",
    "buy once",
    "lifetime license",
    "mac tools",
  ],
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="e51f41cc-037e-4319-aa19-62ddf7e64a44"></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
