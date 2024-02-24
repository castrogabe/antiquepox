import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils'; // Utility function to handle errors
import { Helmet } from 'react-helmet-async'; // Asynchronous Helmet component for managing document head metadata
import { Row, Col, Button } from 'react-bootstrap'; // Bootstrap components
import Rating from '../components/Rating'; // Custom Rating component
import LoadingBox from '../components/LoadingBox'; // Loading indicator component
import MessageBox from '../components/MessageBox'; // Message box component
import ProductCard from '../components/ProductCard'; // Custom ProductCard component
import Pagination from '../components/Pagination'; // Pagination component

// Reducer function to manage state
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

// Array of price ranges
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

// Array of rating filters
export const ratings = [
  {
    name: '4 stars & up',
    rating: 4,
  },
  {
    name: '3 stars & up',
    rating: 3,
  },
  {
    name: '2 stars & up',
    rating: 2,
  },
  {
    name: '1 star & up',
    rating: 1,
  },
];

// Search component
export default function Search() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // Parse search parameters
  const category = sp.get('category') || 'all'; // Get category from search params or default to 'all'
  const query = sp.get('query') || 'all'; // Get query from search params or default to 'all'
  const price = sp.get('price') || 'all'; // Get price from search params or default to 'all'
  const rating = sp.get('rating') || 'all'; // Get rating from search params or default to 'all'
  const order = sp.get('order') || 'newest'; // Get order from search params or default to 'newest'
  const page = sp.get('page') || 1; // Get page from search params or default to 1

  // Reducer hook to manage state
  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  // Fetch products based on search parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  // State hook to manage categories
  const [categories, setCategories] = useState([]);
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  // Function to generate filter URL
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row className='mt-3'>
        {/* Sidebar */}
        <Col md={3} className='search'>
          <div>
            <h3>Categories</h3>
            <ul>
              <li>
                {/* Link to show all categories */}
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>

              {/* Display categories */}
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Price filter */}
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {/* Display price ranges */}
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rating filter */}
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {/* Display rating options */}
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              {/* Link to reset rating filter */}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          {/* Loading or error message */}
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <>
              {/* Result count and filter display */}
              <Row className='justify-content-between mb-3'>
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant='light'
                        onClick={() => navigate('/search')}
                      >
                        <i className='fas fa-times-circle'></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>

                {/* Sorting options */}
                <Col className='text-end'>
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value='newest'>Newest Arrivals</option>
                    <option value='lowest'>Price: Low to High</option>
                    <option value='highest'>Price: High to Low</option>
                    <option value='toprated'>Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>

              {/* Product listing */}
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className='mb-3' key={product._id}>
                    <ProductCard product={product}></ProductCard>
                  </Col>
                ))}
              </Row>

              {/* Pagination Component */}
              <Pagination
                currentPage={page}
                totalPages={pages}
                getFilterUrl={getFilterUrl}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
