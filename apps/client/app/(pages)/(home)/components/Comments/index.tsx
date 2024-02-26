import Image from 'next/image';
import React from 'react';

type Props = {};

const data = [
  [
    {
      id: 1,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'John Doe',
    },
    {
      id: 2,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'David Doe',
    },
    {
      id: 3,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'William Dinh',
    },
  ],
  [
    {
      id: 4,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Julia Dinh',
    },
    {
      id: 5,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Linh Vu',
    },
    {
      id: 6,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Bao Dinh',
    },
  ],
  [
    {
      id: 7,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Zombie',
    },
    {
      id: 8,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Vampire',
    },
    {
      id: 9,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Gao Gao ',
    },
  ],
  [
    {
      id: 10,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Dumpling',
    },
    {
      id: 11,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Bun Bo Hue',
    },
    {
      id: 12,
      text: 'I love this product, it is very useful I love this product, it is very useful',
      user: 'Pho Bo',
    },
  ],
];
export default function Comments({}: Props) {
  return (
    <article className='comments'>
      <div className='comments__container'>
        <div id='captioned-gallery'>
          <figure className='slider'>
            {data.map((item, index) => {
              return (
                <figure className='slider__box' key={index}>
                  {item.map((comment) => {
                    return (
                      <blockquote className='comment' key={comment.id}>
                        <p>{comment.text}</p>
                        <small>--{comment.user}</small>
                      </blockquote>
                    );
                  })}
                </figure>
              );
            })}
          </figure>
        </div>
      </div>
    </article>
  );
}
