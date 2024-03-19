import Stripe from 'stripe'; // Importing Stripe SDK
import express from 'express'; // Importing Express for creating API routes
import config from '../config.js'; // Importing configuration file
import Order from '../models/orderModel.js'; // Importing Order model

// Initializing Stripe with the secret key from the configuration
const stripe = Stripe(config.STRIPE_SECRET_KEY);

// Creating an instance of Express router for handling Stripe-related routes
const stripeRouter = express.Router();

// Route to retrieve the client secret for a payment intent
stripeRouter.get('/secret/:id', async (req, res) => {
  try {
    // Find the order by ID and populate user information
    const order = await Order.findById(req.params.id).populate(
      'user',
      '_id name email'
    );

    // If order is not found, return 404 status with an error message
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    // Create a payment intent with the order total price
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Amount in cents
      currency: 'usd', // Currency type (USD in this case)
      metadata: { integration_check: 'accept_a_payment' }, // Metadata for integration check
    });

    // Update order to mark it as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: paymentIntent.created,
      email_address: order.user.email,
    };
    await order.save(); // Save the updated order details

    // Send the order details and client secret to the client
    res.send({ order, client_secret: paymentIntent.client_secret });
  } catch (err) {
    // Handle errors and send 500 status with an error message
    res.status(500).send({ error: 'Failed to retrieve client secret' });
  }
});

// Route to retrieve the publishable key for Stripe
stripeRouter.get('/key', (req, res) => {
  res.send(config.STRIPE_PUBLISHABLE_KEY); // Send the publishable key to the client
});

export default stripeRouter; // Exporting the router for use in other modules
