import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Property Listings',
  description: 'Map-based real estate listings across Kosovo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
