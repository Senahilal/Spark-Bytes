import type { Metadata } from 'next';

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
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'sans-serif', 
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}