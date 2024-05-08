// Importing necessary dependencies
import Axios from 'axios'; // Axios for making HTTP requests
import { useContext, useEffect, useState } from 'react'; // React hooks for state and context management
import { Form, Row, Col, Button } from 'react-bootstrap'; // React Bootstrap components for UI
import { Helmet } from 'react-helmet-async'; // Helmet for managing document head
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import { toast } from 'react-toastify'; // React Toastify for displaying notifications
import { Store } from '../Store'; // Context Store for global state management
import { getError } from '../utils'; // Utility function for getting error messages

// Functional component for forget password page
export default function ForgetPassword() {
  const navigate = useNavigate(); // React Router hook for navigation
  const [email, setEmail] = useState(''); // State variable for email input
  const { state, dispatch } = useContext(Store); // Accessing global state and dispatch function
  const { userInfo } = state; // Destructuring user info from global state

  // Effect hook for redirecting if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  // Function to handle form submission
  // e refers to the new value entered by the user in the input field
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Sending POST request to forget password endpoint
      const { data } = await Axios.post('/api/users/forget-password', {
        email,
      });
      toast.success(data.message, {
        autoClose: 1000, // Display success message for 1 second
      });

      // Dispatching an action to update the password in global state
      dispatch({ type: 'UPDATE_PASSWORD', payload: data.updatedPassword });
    } catch (err) {
      toast.error(getError(err)); // Displaying error message using utility function
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <br />
      <Row>
        <Col md={6}>
          <h4 className='box'>Forget Password</h4>

          <div className='box'>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />
              </Form.Group>

              <div className='mb-3'>
                <Button type='submit'>Submit</Button>
              </div>
            </Form>
          </div>
        </Col>
        <Col md={6} className='mt-3'>
          <img src='/images/forget.jpg' alt='signin' />
        </Col>
      </Row>
    </div>
  );
}
