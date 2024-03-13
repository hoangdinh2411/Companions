import Image from 'next/image';
import React from 'react';

export default function Goals() {
  return (
    <article className='goals'>
      <div className='goals__container'>
        <figure className='goals__image'>
          <Image
            src='/goals.png'
            alt='Goals'
            fill
            sizes='(max-width:992px) 500px 350px'
          />
        </figure>
        <section className='goals__content'>
          <h3>Shared Goals</h3>
          <p>
            <br />
            By having more people using one vehicle, carpooling reduces each
            person's travel costs such as: fuel costs, tolls, and the stress of
            driving.
            <br />
            <br />
            Carpooling is also a more environmentally friendly and sustainable
            way to travel as sharing journeys reduces air pollution, carbon
            emissions, traffic congestion on the roads, and the need for parking
            spaces.
            <br />
            <br />
            Car sharing is a good way to use up the full seating capacity of a
            car, which would otherwise remain unused if it were just the driver
            using the car.
          </p>
        </section>
      </div>
    </article>
  );
}
