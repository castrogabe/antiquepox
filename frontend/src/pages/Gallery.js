import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

export default function Gallery() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/products');
        setProducts(result.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='content'>
        <Helmet>
          <title>Gallery</title>
        </Helmet>
        <br />
        <h1 className='box'>Gallery</h1>
        <Row>
          <Col>
            <div className='products'>
              {products.map((product) => (
                <div className='product' key={product.slug}>
                  <Link to={`/product/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className='product-info'>
                    {/* Link to the individual product page */}
                    <Link to={`/product/${product.slug}`}>
                      <p>{product.name}</p>
                    </Link>
                    {/* <p>
                    <strong>${product.price}</strong>
                  </p>
                  <button>Add to cart</button> */}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
