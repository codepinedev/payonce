import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PayOnce - Buy Software Once, Own It Forever",
  description:
    "A curated directory of one-time purchase software tools for developers who are done with subscriptions.",
  keywords: [
    "one-time purchase",
    "software",
    "no subscription",
    "buy once",
    "lifetime license",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
