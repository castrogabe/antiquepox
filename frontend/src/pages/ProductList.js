import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // React Router hooks for navigation
import { Row, Col, Button, Table } from 'react-bootstrap'; // Bootstrap components
import { LinkContainer } from 'react-router-bootstrap'; // Container component for React Router links
import { toast } from 'react-toastify'; // Toast notification library
import { Store } from '../Store'; // Context store
import LoadingBox from '../components/LoadingBox'; // Loading indicator component
import MessageBox from '../components/MessageBox'; // Message box component
import { getError } from '../utils'; // Utility function to handle errors

// Reducer function to manage state of products from backend
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
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

// ProductListScreen component
export default function ProductList() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch, // using dispatch to call the actions
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate(); // Navigation hook
  const { search } = useLocation(); // Location hook to access query parameters
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1; // Get page number from query parameter

  const { state } = useContext(Store); // Accessing global state from context
  const { userInfo } = state; // Destructure userInfo from global state

  useEffect(() => {
    const fetchData = async () => {
      // Adding a ajax request to the backend to get the products for the admin user
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Add authorization token to request headers
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // Dispatch success action with fetched data
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err), // Dispatch fail action with error message
        });
      }
    };

    // Reset delete state when product deletion is successful
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData(); // Fetch data when component mounts or page changes
    }
  }, [page, userInfo, successDelete]); // Dependencies for useEffect

  // Handler for creating new product
  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' }); // Dispatch create request action
        const { data } = await axios.post(
          '/api/products',
          {}, // Empty body for POST request
          {
            headers: { Authorization: `Bearer ${userInfo.token}` }, // Add authorization token to request headers
          }
        );
        toast.success('Product created successfully', {
          autoClose: 1000, // Display success message for 1 second
        });
        dispatch({ type: 'CREATE_SUCCESS' }); // Dispatch create success action
        navigate(`/admin/product/${data.product._id}`); // Redirect to newly created product
      } catch (err) {
        toast.error(getError(err)); // Display error message
        dispatch({
          type: 'CREATE_FAIL', // Dispatch create fail action
        });
      }
    }
  };

  // Handler for deleting a product
  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Add authorization token to request headers
        });
        toast.success('Product deleted successfully'); // Display success message
        dispatch({ type: 'DELETE_SUCCESS' }); // Dispatch delete success action
      } catch (err) {
        toast.error(getError(err)); // Display error message
        dispatch({
          type: 'DELETE_FAIL', // Dispatch delete fail action
        });
      }
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Product List</title>
      </Helmet>
      <br />
      <Row className='box'>
        <Col md={6}>
          <h2>Product List</h2>
        </Col>
        <Col md={6} className='col text-end'>
          <Button type='button' onClick={createHandler}>
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <LoadingBox delay={1000} />}
      {loadingDelete && <LoadingBox delay={1000} />}
      {loading ? (
        <LoadingBox delay={1000} />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox> // Show error message if fetch fails
      ) : (
        <>
          {/* Render product list if data is loaded successfully */}
          <div className='box'>
            <Table responsive striped bordered className='noWrap'>
              <thead className='thead'>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>FROM</th>
                  <th>FINISH</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product._id}
                      <div key={product._id}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='img-fluid rounded img-thumbnail'
                        />
                        <Link to={`/product/${product.slug}`}></Link>
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.countInStock}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.from}</td>
                    <td>{product.finish}</td>
                    <td>
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div>
            {[...Array(pages).keys()].map((x) => (
              <LinkContainer
                key={x + 1}
                className='mx-1'
                to={`/admin/products?page=${x + 1}`}
              >
                <Button
                  className={Number(page) === x + 1 ? 'text-bold' : ''}
                  variant='light'
                >
                  {x + 1}
                </Button>
              </LinkContainer>
            ))}
          </div>

          <br />
        </>
      )}
    </div>
  );
}
