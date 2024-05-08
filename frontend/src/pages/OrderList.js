import axios from 'axios'; // Importing Axios for making HTTP requests
import React, { useContext, useEffect, useReducer } from 'react'; // Importing necessary React hooks and components
import { toast } from 'react-toastify'; // Importing toast notification library
import { Button, Table } from 'react-bootstrap'; // Importing Bootstrap components
import { Helmet } from 'react-helmet-async'; // Importing Helmet for managing document head
import { useNavigate, Link } from 'react-router-dom'; // Importing navigation hooks from React Router
import LoadingBox from '../components/LoadingBox'; // Importing LoadingBox component
import MessageBox from '../components/MessageBox'; // Importing MessageBox component
import { Store } from '../Store'; // Importing Store context
import { getError } from '../utils'; // Importing utility function for handling errors
import Pagination from '../components/Pagination'; // Importing Pagination component

// Reducer function for managing state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }; // Start loading data
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        pages: action.payload.pages,
        loading: false,
      }; // Successfully fetched data
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; // Failed to fetch data
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false }; // Start deleting order
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      }; // Successfully deleted order
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }; // Failed to delete order
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }; // Reset delete status
    default:
      return state;
  }
};

// OrderList component
export default function OrderList() {
  const navigate = useNavigate(); // Navigation hook
  const { state } = useContext(Store); // Accessing global state from context
  const { userInfo } = state; // Destructuring user info from state
  const [
    { loading, error, orders, loadingDelete, successDelete, page, pages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  }); // Using reducer for managing component state

  // Fetching orders data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  // Deleting an order
  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  // Function to format date (MM-DD-YYYY)
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  }

  // Function to generate URL for pagination
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `/?&page=${filterPage}`;
  };

  // Rendering UI components
  return (
    <div className='content'>
      <Helmet>
        <title>Order List</title>
      </Helmet>
      <br />
      <h4 className='box'>Order List</h4>
      <div className='box'>
        {loadingDelete && <LoadingBox />}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <Table responsive striped bordered className='noWrap'>
            <thead className='thead'>
              <tr>
                <th>ID / PRODUCT</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>QTY</th>
                <th>PAID</th>
                <th>SHIPPED DATE</th>
                <th>DELIVERY DAYS</th>
                <th>CARRIER NAME</th>
                <th>TRACKING NUMBER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  {/* Displaying order details */}
                  <td>
                    {order._id}{' '}
                    {order.orderItems.map((item) => (
                      <div key={item._id}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                    ))}
                  </td>
                  <td>
                    <div>
                      <strong>Name:</strong>{' '}
                      {order.user ? order.user.name : 'DELETED USER'}
                    </div>
                    {order.user && (
                      <>
                        <div>
                          <strong>Email:</strong> {order.user.email}
                          {/* {console.log(order.user)} */}
                        </div>
                        <div>
                          <strong>Address:</strong> <br />
                          {order.shippingAddress.address} <br />
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.states},{' '}
                          {order.shippingAddress.postalCode} <br />
                          {order.shippingAddress.country}
                        </div>
                      </>
                    )}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.orderItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td>
                    {order.isPaid ? formatDate(order.paidAt) : 'No'}
                    <br />
                    {order.paymentMethod}
                  </td>
                  <td>
                    <div>{formatDate(order.shippedAt)}</div>
                  </td>
                  <td>{order.deliveryDays}</td>
                  <td>{order.carrierName}</td>
                  <td>{order.trackingNumber}</td>
                  <td>
                    {/* Buttons for viewing details and deleting order */}
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                    &nbsp;
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={pages}
        getFilterUrl={getFilterUrl}
      />
      <br />
    </div>
  );
}
