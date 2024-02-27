const APP_ROUTER = {
  HOME: '/',
  CONTACT: '/contact',
  ABOUT: '/about',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
};

export const NAVBAR = [
  { name: 'Home', path: APP_ROUTER.HOME },
  { name: 'About', path: APP_ROUTER.ABOUT },
  { name: 'Contact', path: APP_ROUTER.CONTACT },
];

export const FOOTER_CONTENT = {
  SERVICES: [
    { title: 'Carpooling', path: '/carpooling' },
    { title: 'Shipping', path: '/shipping' },
  ],
  ABOUT: [
    { title: 'About us', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ],
  LEGAL: [
    { title: 'Privacy policy', path: '/privacy-policy' },
    { title: 'Terms and conditions', path: '/terms-and-conditions' },
  ],
};
export default APP_ROUTER;
