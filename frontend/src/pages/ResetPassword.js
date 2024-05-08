// Importing necessary dependencies
import Axios from 'axios'; // Axios for making HTTP requests
import { useContext, useEffect, useState } from 'react'; // React hooks for state and context management
import { Container, Button, Form } from 'react-bootstrap'; // React Bootstrap components for UI
import { Helmet } from 'react-helmet-async'; // Helmet for managing document head
import { useNavigate, useParams } from 'react-router-dom'; // React Router hooks for navigation
import { toast } from 'react-toastify'; // React Toastify for displaying notifications
import { Store } from '../Store'; // Context Store for global state management
import { getError } from '../utils'; // Utility function for getting error messages

// Functional component for resetting password
export default function ResetPassword() {
  const navigate = useNavigate(); // React Router hook for navigation
  const { token } = useParams(); // React Router hook for accessing URL parameters

  // State variables for password and visibility toggles
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Accessing global state using useContext hook
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Effect hook for redirecting if user is already logged in or token is missing
  useEffect(() => {
    if (userInfo || !token) {
      navigate('/');
    }
  }, [navigate, userInfo, token]);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Function to handle form submission
  // e refers to the new value entered by the user in the input field
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      // Sending POST request to reset password
      await Axios.post('/api/users/reset-password', {
        password,
        token,
      });
      navigate('/signin'); // Redirecting to signin page on success
      toast.success('Password updated successfully', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (err) {
      toast.error(getError(err)); // Displaying error message using utility function
    }
  };

  // JSX structure for reset password form
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <br />
      <h4 className='box'>Reset Password</h4>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>New Password</Form.Label>
          <div className='input-group'>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder='Minimum length 8, 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant='outline-secondary'
              onClick={togglePasswordVisibility}
            >
              <i
                className={`fa ${showPassword ? 'fas fa-eye-slash' : 'fa-eye'}`}
              ></i>
            </Button>
          </div>
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm New Password</Form.Label>
          <div className='input-group'>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant='outline-secondary'
              onClick={toggleConfirmPasswordVisibility}
            >
              <i
                className={`fa ${
                  showConfirmPassword ? 'fas fa-eye-slash' : 'fa-eye'
                }`}
              ></i>
            </Button>
          </div>
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Reset Password</Button>
        </div>
      </Form>
    </Container>
  );
}
