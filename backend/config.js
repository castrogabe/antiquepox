import dotenv from 'dotenv'; // Importing dotenv library to load environment variables from .env file

dotenv.config(); // Loading environment variables from .env file

export default {
  PORT: process.env.PORT || 8000, // Port for the server, defaults to 8000 if not provided
  JWT_SECRET: process.env.JWT_SECRET || 'asianantiques', // Secret key for JWT token, defaults to 'asianantiques' if not provided
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://localhost/frontend', // MongoDB connection URL, defaults to 'mongodb://localhost/frontend' if not provided

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb', // PayPal client ID, defaults to 'sb' if not provided

  STRIPE_PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key', // Stripe publishable key, defaults to 'your_stripe_publishable_key' if not provided
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key', // Stripe secret key, defaults to 'your_stripe_secret_key' if not provided

  CLOUDINARY_CLOUD_NAME: process.env.name || 'name', // Cloudinary cloud name, defaults to 'name' if not provided
  CLOUDINARY_API_KEY: process.env.key || 'apiKey', // Cloudinary API key, defaults to 'apiKey' if not provided
  CLOUDINARY_API_SECRET: process.envCloudinary || 'secretAccessKey', // Cloudinary API secret, defaults to 'secretAccessKey' if not provided
  CLOUDINARY_URL: process.env.cloudinary || 'secretKey', // Cloudinary URL, defaults to 'secretKey' if not provided

  auth: process.env.NODE_USER, // Username for authentication
  auth: process.env.NODE_PASSWORD, // Password for authentication
};
