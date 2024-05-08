import express from 'express';
// import data from './data.js'; // Importing data from a local file
import mongoose from 'mongoose'; // Importing Mongoose for MongoDB interactions
import dotenv from 'dotenv'; // Importing dotenv for environment variable management
import seedRouter from './routes/seedRoutes.js'; // Importing the seed router
import productRouter from './routes/productRoutes.js'; // Importing the product router
import userRouter from './routes/userRoutes.js'; // Importing the user router

dotenv.config(); // Loading environment variables from the .env file

mongoose
  .connect(process.env.MONGODB_URI) // Connecting to MongoDB using the provided URI from environment variables
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express(); // Creating an instance of the Express application

app.use(express.json()); // Parsing JSON requests
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded requests

// Setting up routes
app.use('/api/seed', seedRouter); // Using the seed router for '/api/seed' endpoint
app.use('/api/products', productRouter); // Using the product router for '/api/products' endpoint
app.use('/api/users', userRouter); // Using the user router for '/api/users' endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
