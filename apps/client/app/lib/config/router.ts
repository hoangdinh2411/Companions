const APP_ROUTER = {
  HOME: '/',
  CONTACT: '/contact',
  ABOUT: '/about',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  PROFILE: '/profile',
  JOURNEYS: '/journeys',
  DELIVERY_ORDERS: '/delivery-orders',
  ADD_NEW_JOURNEY: '/new-journey',
};

export const NAVBAR = [
  { name: 'Home', path: APP_ROUTER.HOME },
  { name: 'Journeys ', path: APP_ROUTER.JOURNEYS },
  { name: 'Delivery Orders ', path: APP_ROUTER.DELIVERY_ORDERS },
  // { name: 'About', path: APP_ROUTER.ABOUT },
  // { name: 'Contact', path: APP_ROUTER.CONTACT },
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
