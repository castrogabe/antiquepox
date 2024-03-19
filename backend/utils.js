import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Importing Nodemailer for sending emails lesson 10

// Function to calculate the total quantity of items in the order
const calculateTotalQuantity = (order) => {
  return order.orderItems.reduce((total, item) => total + item.quantity, 0);
};

// Function to get base URL based on environment
export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://antiquepox.com'; // example.com <= your website address

// Function to generate JWT token for user authentication
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, // Secret key for token generation
    {
      expiresIn: '30d', // Token expiration time
    }
  );
};

// Middleware to check if user is authenticated
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Extracting token from Authorization header
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' }); // Invalid token error response
      } else {
        req.user = decode; // Set user details in request object
        next(); // Proceed to next middleware
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' }); // No token error response
  }
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Proceed to next middleware if user is an admin
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' }); // Invalid admin token error response
  }
};

// Create a transporter object using SMTP transport for sending emails
export const transporter = nodemailer.createTransport({
  service: 'Gmail', // SMTP service provider
  port: 587, // Port number
  secure: false, // Set to true if using SSL/TLS
  auth: {
    user: process.env.NODE_USER, // Sender email address
    pass: process.env.NODE_PASSWORD, // Sender email password
  },
});

// Email template for order payment receipt
export const payOrderEmailTemplate = (order) => {
  // Calculate total quantity of items
  const totalQuantity = calculateTotalQuantity(order);

  // Format date for display
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  return `
    <h1>Thanks for shopping with antiquepox.com, we will send a confirmation when your order ships</h1>
    <!-- Email content with order details -->
  `;
};

// Email template for shipping confirmation
export const shipOrderEmailTemplate = (order) => {
  // Calculate total quantity of items
  const totalQuantity = calculateTotalQuantity(order);

  // Format date for display
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  return `
    <h1>Your order is on the way!</h1>
    <!-- Email content with shipping details -->
  `;
};

// Send shipping confirmation email using Nodemailer
export const sendShippingConfirmationEmail = async (req, order) => {
  const customerEmail = order.user.email; // Customer's email address
  const shippingConfirmationDetails = shipOrderEmailTemplate(order); // Shipping confirmation details

  // Create email content for shipping confirmation
  const emailContent = {
    from: 'gabudemy@gmail.com', // Sender email address <= add your own email here
    to: customerEmail, // Customer's email address
    subject: 'Shipping Confirmation from antiquepox.com', // Email subject <= add your own website here
    html: shippingConfirmationDetails, // HTML content for email body
  };

  try {
    // Send the shipping confirmation email using the `transporter`
    const info = await transporter.sendMail(emailContent);

    // Log confirmation message when email is sent successfully
    console.log('Shipping confirmation email sent:', info.messageId);
  } catch (error) {
    // Log error message if email sending fails
    console.error('Error sending shipping confirmation email:', error);
  }
};
