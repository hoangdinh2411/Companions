import { Poppins, PT_Serif } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin-ext'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600'],
  variable: '--font-poppins',
  preload: true,
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
  variable: '--font-pt-serif',
  preload: true,
});

export { poppins, ptSerif };
