import express from 'express';
import data from './data.js';

const app = express();
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// Define a route for handling GET requests to '/api/products/slug/:slug'
app.get('/api/products/slug/:slug', (req, res) => {
  // Find a product in the 'data' array whose slug matches the value in the request parameters
  const product = data.products.find((x) => x.slug === req.params.slug);

  // Check if a matching product was found
  if (product) {
    // If found, send the product as the response
    res.send(product);
  } else {
    // If no matching product was found, set a 404 status and send a message indicating that the product was not found
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
