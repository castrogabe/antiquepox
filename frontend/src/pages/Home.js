import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <div className='content'>
        <br />
        <h1 className='box'>Featured Products</h1>
        <div className='box'>
          <p className='mt-3'>
            ~ All Antiques, Art, and Collectibles are in good condition and sold
            as is. ~
          </p>
        </div>
        <br />
      </div>
      <Row>
        <Col></Col>
      </Row>
    </>
  );
}
