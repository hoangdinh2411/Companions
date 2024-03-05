import { getUser } from './actions/userApi';
import Footer from './components/shared/Footer/Footer';
import Navbar from './components/shared/Navbar/Navbar';
import { poppins } from './lib/config/font';
import ToastProvider from './lib/provider/ToastProvider';
import './styles/global.scss';
import type { Metadata } from 'next';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/logo_16_16.png' sizes='any' />
      </head>
      <body className={`${poppins.className}`} suppressHydrationWarning={true}>
        <header>
          <Navbar />
        </header>
        <main>
          {children}
          <ToastProvider />
        </main>
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
  icons: [],
};
