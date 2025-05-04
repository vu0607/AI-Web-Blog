
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from '@/components/layout/MainLayout'; // Import the new layout component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Blog Central', // Updated title
  description: 'A blog exploring the latest in AI and technology, powered by Firebase and Genkit.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for potential theme issues */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MainLayout> {/* Wrap children with MainLayout */}
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
