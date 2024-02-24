import { Poppins, PT_Serif } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
});

export { poppins, ptSerif };
