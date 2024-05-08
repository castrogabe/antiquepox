import React, { useEffect, useReducer } from 'react';
import Jumbotron from '../components/Jumbotron';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Home() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/search?page=${page}`); // lesson 8
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [page]);

  // Pagination
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `/?&page=${filterPage}`;
  };

  return (
    <>
      <div className='jumbotron1' alt='tools'>
        <Jumbotron
          text={[
            'Antiques',
            'Art',
            'Collectibles',
            'Vintage Items',
            '@',
            'antiquepox.com',
          ]}
        />
      </div>

      <div className='content'>
        <Helmet>
          <title>Antiquepox</title>
        </Helmet>
        <br />
        <div className='box'>
          <p>
            ~ Explore our virtual antique haven! We take joy in curating an
            exclusive collection of unique and timeless pieces that capture the
            essence of history. Fueled by our passion for antiques, we
            tirelessly search for treasures with stories to tell. Each item is
            handpicked for its exceptional quality and enduring value. Welcome
            to a digital journey through the beauty of the past! ~
          </p>
        </div>
        <br />
        <Row>
          <Col>
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
              <>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <Row>
                  {products.map((product) => (
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      lg={2}
                      xl={2}
                      className='mb-3'
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination Component */}
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  getFilterUrl={getFilterUrl}
                />
                <br />
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}
