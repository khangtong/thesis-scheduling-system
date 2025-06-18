import '@/app/globals.css';
import { lexend } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { Toaster } from './components/ui/sonner';

export const metadata: Metadata = {
  title: {
    template: '%s | Thesis Scheduling System',
    default: 'Thesis Scheduling System',
  },
  description:
    'A thesis scheduling system website with integrated automatic scheduling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexend.className} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
