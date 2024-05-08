// rfc
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div className='content'>
      <br />
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className='container small-container'>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <br />
        <h1 className='box'>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className='mb-3'>
            <div className='payment-option'>
              <Form.Check
                type='radio'
                id='PayPal'
                label='PayPal'
                value='PayPal'
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className='fab fa-cc-paypal'></i>
            </div>
          </div>

          <div className='mb-3'>
            <div className='payment-option'>
              <Form.Check
                type='radio'
                id='Stripe'
                label='Credit Card'
                value='Stripe'
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className='fab fa-cc-stripe'></i>
            </div>
          </div>

          <div className='mb-3'>
            <Button type='submit'>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PaymentMethod) select radial button for PayPal or Stripe <= CURRENT STEP
// step 4 (PlaceOrder)
// lands on OrderDetails for payment
