const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.js');
const cors = require('cors');

// Route imports
const seedRouter = require('./routes/seedRoutes.js');
const stripeRouter = require('./routes/stripeRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const uploadRouter = require('./routes/uploadRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');

mongoose.set('strictQuery', true); // add this line
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID || 'sb');
});

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials to be sent with requests
  })
);

// routes
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/messages', messageRouter);

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
