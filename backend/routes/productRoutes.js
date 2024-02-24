import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// lesson 8
productRouter.post(
  '/',
  isAuth, // Middleware to check if user is authenticated
  isAdmin, // Middleware to check if user is an admin
  expressAsyncHandler(async (req, res) => {
    // Create a new product object with default values
    const newProduct = new Product({
      name: 'name' + Date.now(),
      slug: 'name' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'category',
      from: 'from',
      finish: 'finish',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'description',
    });
    // Save the new product to the database
    const product = await newProduct.save();
    // Send a success message along with the created product as response
    res.send({ message: 'Product Created', product });
  })
);

// Route for updating an existing product
productRouter.put(
  '/:id',
  isAuth, // Middleware to check if user is authenticated
  isAdmin, // Middleware to check if user is an admin
  expressAsyncHandler(async (req, res) => {
    // Retrieve the product ID from request parameters
    const productId = req.params.id;
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (product) {
      // Update product details with values from request body
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.from = req.body.from;
      product.finish = req.body.finish;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      // Save the updated product
      await product.save();
      // Send success message
      res.send({ message: 'Product Updated' });
    } else {
      // If product not found, send 404 error
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

// Route for deleting a product
productRouter.delete(
  '/:id',
  isAuth, // Middleware to check if user is authenticated
  isAdmin, // Middleware to check if user is an admin
  expressAsyncHandler(async (req, res) => {
    // Find the product by its ID and remove it
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      // Send success message
      res.send({ message: 'Product Deleted' });
    } else {
      // If product not found, send 404 error
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

// Pagination: number of 12 products per page
const PAGE_SIZE = 12; // Default page size 12

// Route for admin to view products with pagination support
productRouter.get(
  '/admin',
  isAuth, // Middleware to check if user is authenticated
  isAdmin, // Middleware to check if user is an admin
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1; // Default page is 1
    const pageSize = query.pageSize || PAGE_SIZE; // Default page size is 12

    // Retrieve products with pagination and send as response
    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// Route for searching products with various filters
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    // Define filters based on query parameters
    // Construct MongoDB query based on filters
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    // Fetch products based on filters, sort order, and pagination
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    // Get count of filtered products
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    // Send filtered products with pagination details as response
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize), // 12 products per page
    });
  })
);

// Route to get all unique product categories
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    // Fetch all unique categories from products
    const categories = await Product.find().distinct('category');
    // Send categories as response
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
