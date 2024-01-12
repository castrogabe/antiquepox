import React from 'react';

import { useParams } from 'react-router-dom';

export default function Product() {
  const params = useParams();
  const { slug } = params;

  return (
    <div className='content'>
      <br />
      <h1 className='box'>Products</h1>
      <div className='box'>
        <h1>{slug}</h1>
      </div>
    </div>
  );
}
