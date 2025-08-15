import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Table, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import AdminPagination from '../components/AdminPagination';
import SkeletonOrderList from '../components/skeletons/SkeletonOrderList';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload.orders, // array
        page: action.payload.page ?? 1,
        pages: action.payload.pages ?? 1,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function OrderList() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      orders = [],
      loadingDelete,
      successDelete,
      page = 1,
      pages = 1,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
    page: 1,
    pages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      // optional demo delay
      await new Promise((r) => setTimeout(r, 1500));
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        // If your backend supports pagination, pass ?page=...
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        // Ensure we always pass an array + page meta
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            orders: Array.isArray(data) ? data : data.orders ?? [],
            page: data.page ?? 1,
            pages: data.pages ?? 1,
          },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    }
    fetchData();
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/orders/${order._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('Order deleted successfully', { autoClose: 1000 });
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELETE_FAIL' });
    }
  };

  // MM-DD-YYYY safe formatter
  const formatDate = (d) => {
    if (!d) return '';
    const dateObject = new Date(d);
    if (Number.isNaN(dateObject.getTime())) return '';
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Orders List</title>
      </Helmet>
      <br />
      <h4 className='box'>Orders List</h4>

      <div className='box'>
        {loadingDelete && <SkeletonOrderList />}

        {loading ? (
          <div>
            {[...Array(8).keys()].map((i) => (
              <Col key={i} className='mb-1'>
                <SkeletonOrderList />
              </Col>
            ))}
          </div>
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
              {orders.map((order) => {
                // user may be null if deleted
                const user = order.user ?? null;

                return (
                  <tr key={order._id}>
                    <td>
                      {order._id}{' '}
                      {(order.orderItems || []).map((item, idx) => (
                        <div key={item?._id || idx}>
                          <img
                            src={item?.image}
                            alt={item?.name}
                            className='img-fluid rounded img-thumbnail'
                          />
                          {item?.slug ? (
                            <Link to={`/product/${item.slug}`}>
                              {item?.name}
                            </Link>
                          ) : (
                            <span>{item?.name}</span>
                          )}
                        </div>
                      ))}
                    </td>

                    <td>
                      <div>
                        <strong>Name:</strong>{' '}
                        {user ? user.name : 'DELETED USER'}
                      </div>
                      {user && (
                        <>
                          <div>
                            <strong>Email:</strong> {user.email}
                          </div>
                          <div>
                            <strong>Address:</strong> <br />
                            {order.shippingAddress?.address} <br />
                            {order.shippingAddress?.city},{' '}
                            {order.shippingAddress?.states},{' '}
                            {order.shippingAddress?.postalCode} <br />
                            {order.shippingAddress?.country}
                          </div>
                        </>
                      )}
                    </td>

                    <td>{formatDate(order.createdAt)}</td>
                    <td>{Number(order.totalPrice || 0).toFixed(2)}</td>
                    <td>
                      {(order.orderItems || []).reduce(
                        (total, item) => total + (item?.quantity || 0),
                        0
                      )}
                    </td>
                    <td>
                      {order.isPaid ? formatDate(order.paidAt) : 'No'}
                      <br />
                      {order.paymentMethod}
                    </td>
                    <td>
                      {order.isShipped ? formatDate(order.shippedAt) : ''}
                    </td>
                    <td>{order.deliveryDays ?? ''}</td>
                    <td>{order.carrierName ?? ''}</td>
                    <td>{order.trackingNumber ?? ''}</td>

                    <td>
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        Details
                      </Button>{' '}
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() => deleteHandler(order)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        isAdmin={true}
        keyword='OrderList'
      />
      <br />
    </div>
  );
}
