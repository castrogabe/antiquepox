import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts'; // Importing chart component
import axios from 'axios'; // Axios for making HTTP requests
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store'; // Importing Store context
import { getError } from '../utils'; // Util function for handling errors
import LoadingBox from '../components/LoadingBox'; // Loading component
import MessageBox from '../components/MessageBox'; // Message box component
import { Row, Col, Card } from 'react-bootstrap'; // Bootstrap components

// Reducer function for managing state transitions from backend
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }; // Set loading to true when fetching data
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload, // Set summary data on successful fetch
        loading: false, // Set loading to false
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; // Set error message on fetch failure
    default:
      return state;
  }
};

// Dashboard component
export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true, // Initial loading state
    error: '', // Initial error state
  });
  const { state } = useContext(Store); // Accessing state from context
  const { userInfo } = state; // Destructuring user info from state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Sending authorization token with request
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // Dispatching success action with fetched data
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err), // Dispatching failure action with error message
        });
      }
    };
    fetchData(); // Fetch data on component mount
  }, [userInfo]); // Trigger useEffect when userInfo changes

  return (
    <div className='content'>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <br />
      <h2 className='box'>Admin Dashboard</h2>
      {loading ? (
        <LoadingBox /> // Display loading box while data is being fetched
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox> // Display error message if fetch fails
      ) : (
        <>
          {/* Render dashboard content when data is loaded successfully */}
          <Row className='mt-3'>
            {/* Displaying user, order, and total sales count */}
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* If summary user exists and show summary users otherwise show 0 */}
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* If summary order exists and show summary orders otherwise show 0 */}
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text>New Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* If summary sales exists and show summary sales otherwise show $0, .toFixed(2) adds 2 digits to end of dollar amount $1.00 */}
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Order Value</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* future lesson */}
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.messages ? summary.messages.length : 0}
                  </Card.Title>
                  <Card.Text>Messages</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Displaying sales chart */}
          <div className='my-3'>
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox> // Show message if no sales data available
            ) : (
              <Chart
                width='100%'
                height='400px'
                chartType='AreaChart'
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'], // passing an array of data within an the group array
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart> // Display sales chart
            )}
          </div>

          {/* Displaying categories chart */}
          <div className='my-3'>
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox> // Show message if no category data available
            ) : (
              <Chart
                width='100%'
                height='400px'
                chartType='PieChart'
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]), // shows the category _id and the count %
                ]}
              ></Chart> // Display categories chart
            )}
          </div>
          <br />
        </>
      )}
    </div>
  );
}
