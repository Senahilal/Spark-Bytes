import type { Metadata } from 'next';
import Navbar from './components/navbar';
import Footer from './components/footer';

export const metadata: Metadata = {
  title: 'Spark Bytes - Free Food, Zero Waste',
  description: 'Find, Share, and Enjoy Extra Food on Boston University Campus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}