import Footer from './components/shared/Footer/Footer';
import Navbar from './components/shared/Navbar/Navbar';
import { poppins } from './lib/config/font';
import './styles/global.scss';
import type { Metadata } from 'next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en'>
      <body className={`${poppins.className}`} suppressHydrationWarning={true}>
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Companions App',
    default: 'Companions',
  },
  description: 'Companions App',
};
