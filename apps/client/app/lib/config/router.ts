const APP_ROUTER = {
  HOME: '/',
  CONTACT: '/contact',
  ABOUT: '/about',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  PROFILE: '/profile',
  JOURNEYS: '/journeys',
  ADD_NEW_JOURNEY: '/new-journey',
  EDIT_JOURNEY: '/edit-journey',
  DELIVERY_ORDERS: '/delivery-orders',
  EDIT_DELIVERY_ORDER: '/edit-delivery-order',
  ADD_NEW_DELIVERY_ORDER: '/new-order',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms-and-conditions',
  IDENTIFY: '/identify',
};

export const NAVBAR = [
  { name: 'Home', path: APP_ROUTER.HOME },
  { name: 'Journeys ', path: APP_ROUTER.JOURNEYS },
  { name: 'Delivery Orders ', path: APP_ROUTER.DELIVERY_ORDERS },
];

export const FOOTER_CONTENT = {
  SERVICES: [
    { title: 'Carpooling', path: APP_ROUTER.JOURNEYS },
    { title: 'Shipping', path: APP_ROUTER.DELIVERY_ORDERS },
  ],
  ABOUT: [
    { title: 'About us', path: APP_ROUTER.ABOUT },
    { title: 'Contact', path: APP_ROUTER.CONTACT },
  ],
  LEGAL: [
    { title: 'Privacy policy', path: APP_ROUTER.PRIVACY_POLICY },
    { title: 'Terms and conditions', path: APP_ROUTER.TERMS },
  ],
};
export default APP_ROUTER;
