import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import ReduxProvider from "@/components/providers/ReduxProvider";
import LucideProvider from "@/components/providers/LucideProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HungryGo - Fresh Meals Delivered",
  description: "Delicious, healthy meals delivered to your doorstep. Choose your meal plan and enjoy fresh food every day.",
};

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
        <ReduxProvider>
          <LucideProvider>
            <MainLayout>{children}</MainLayout>
          </LucideProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

