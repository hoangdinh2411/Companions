'use client';
import './Slide.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use, useEffect } from 'react';
import ShippingForm from './SearchForm/ShippingForm';
import CarpoolingForm from './SearchForm/CarPoolingForm';

const slides = [
  {
    id: 'carpooling',
    label: 'Carpooling',
    content: 'This is tab 1!',
    image_url: '/slide_carpooling.jpg',
    params: 'carpooling',
    form: <CarpoolingForm />,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    content: 'Whoah! Tab 2 here!',
    image_url: '/shipping.jpg',
    params: 'shipping',
    form: <ShippingForm />,
  },
];
export default function Slide() {
  const searchParams = useSearchParams();
  const isActiveSlide = () => {
    const service = searchParams.get('service');
    if (!service) return slides[0].params;
    return service;
  };

  useEffect(() => {
    const isTop = window.scrollY < 100;
    if (isTop) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, [searchParams]);
  return (
    <div id='slideshow'>
      <figure className='slide__images'>
        {slides.map((item) => (
          <div
            key={item.id}
            className='slide__item'
            style={{
              display: isActiveSlide() === item.params ? 'block' : 'none',
              backgroundImage: `url(${item.image_url})`,
            }}
          >
            <section className='slide__content'>
              <div className='slide__tabs'>
                {slides.map((item) => (
                  <Link
                    key={item.id}
                    scroll={false}
                    prefetch={false}
                    className={`slide__tab ${isActiveSlide() === item.params ? 'active' : ''}`}
                    href={{
                      pathname: '/',
                      query: { service: item.params },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {item.form}
            </section>
          </div>
        ))}
      </figure>
    </div>
  );
}
