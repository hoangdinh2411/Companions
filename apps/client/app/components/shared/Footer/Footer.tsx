import React from 'react';
import Logo from '../Logo/Logo';
import './Footer.scss';
import { FOOTER_CONTENT } from '../../../lib/config/router';

export default function Footer() {
  return (
    <footer className='footer'>
      <article className='content'>
        <div className='content__logo'>
          <Logo />
          <h3>Companions</h3>
        </div>
        <div className='content__list-items'>
          <h4 className='title'>Services</h4>
          {FOOTER_CONTENT.SERVICES.map((item) => (
            <a href={item.path} key={item.title}>
              {item.title}
            </a>
          ))}
        </div>
        <div className='content__list-items'>
          <h4 className='title'>About</h4>
          {FOOTER_CONTENT.ABOUT.map((item) => (
            <a href={item.path} key={item.title}>
              {item.title}
            </a>
          ))}
        </div>

        <div className='content__list-items'>
          <h4 className='title'>Legal</h4>
          {FOOTER_CONTENT.LEGAL.map((item) => (
            <a href={item.path} key={item.title}>
              {item.title}
            </a>
          ))}
        </div>
      </article>
      {/* <article className='footer__social-media'></article> */}
      <article className='footer__copyright'>
        <h6>© 2024 copyright by William Dinh </h6>
      </article>
    </footer>
  );
}
