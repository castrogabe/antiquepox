import React, { useState } from 'react'; // Importing React and useState hook
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js'; // Importing Stripe elements and hooks
import { Button } from 'react-bootstrap'; // Importing Button component from React Bootstrap
import { Link } from 'react-router-dom'; // Importing Link component from React Router
import Axios from 'axios'; // Importing Axios for making HTTP requests

// Functional component for the checkout form using Stripe
const CheckoutForm = (props) => {
  const [processing, setProcessing] = useState(false); // State variable for processing state
  const stripe = useStripe(); // Stripe hook for accessing the Stripe object
  const elements = useElements(); // Stripe hook for accessing Stripe Elements
  const [succeeded, setSucceeded] = useState(false); // State variable for payment success state
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false); // State variable for displaying success message

  // Function to handle Stripe success
  const handleStripeSuccess = async (paymentResult) => {
    try {
      // Perform the action when payment is successful
      props.handleStripeSuccess(paymentResult);
    } catch (err) {
      // Handle errors
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    // Call stripe.confirmCardPayment() with the client secret.
    const { data } = await Axios(`/api/stripe/secret/${props.orderId}`, {
      headers: {
        Authorization: `Bearer YOUR_STRIPE_SECRET_KEY`, // Replace YOUR_STRIPE_SECRET_KEY with your actual secret key
      },
    });
    const clientSecret = data.client_secret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: data.order.user.name,
          email: data.order.user.email,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        handleStripeSuccess(result.paymentIntent);
        setDisplaySuccessMessage(true); // Show success message after successful payment
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement /> {/* Stripe CardElement for credit card input */}
      <Button
        type='submit'
        className='btn-block'
        disabled={!stripe || processing || succeeded} // Disable button during processing or after successful payment
      >
        Pay With Credit Card
      </Button>
      <br />
      {/* Display success message if payment is successful */}
      {displaySuccessMessage && (
        <p className='result-message'>
          Payment Successful.{' '}
          <Link to='/orderhistory'>See it in your purchase history.</Link>
        </p>
      )}
    </form>
  );
};

// Wrapper component for Stripe Elements
const StripeCheckout = (props) => (
  <Elements stripe={props.stripe}>
    <CheckoutForm
      orderId={props.orderId}
      handleStripeSuccess={props.handleStripeSuccess}
    />
  </Elements>
);

export default StripeCheckout; // Exporting the StripeCheckout component as default
