export const revalidate = 3600;
import dynamic from 'next/dynamic';
import Footer from '../components/shared/Footer/Footer';
import ToastProvider from '../lib/provider/ToastProvider';
import '../styles/global.scss';
import type { Metadata } from 'next';
import Navbar from '../components/shared/Navbar/Navbar';
import AppContextProvider from '../lib/provider/AppContextProvider';
import SocketContextProvider from '../lib/provider/SocketContextProvider';
import { getToken } from '../actions/tokens';
const MessagesBox = dynamic(() => import('../components/shared/MessagesBox'), {
  ssr: false,
});

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_16_16.png" sizes="any" />
      </head>
      <body suppressHydrationWarning={true}>
        <AppContextProvider>
          <SocketContextProvider>
            <Navbar />
            <main>
              {children}
              {modal}
            </main>
            <MessagesBox />
            <Footer />
            <ToastProvider />
          </SocketContextProvider>
          <div id="modal-root" />
        </AppContextProvider>
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
