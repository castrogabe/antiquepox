const express = require('express');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const dns = require('dns');
const User = require('../models/userModel.js');
const {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  transporter,
} = require('../utils.js');
const rateLimit = require('express-rate-limit');

const userRouter = express.Router();

const PAGE_SIZE = 12;

const resetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests
  message: 'Too many password reset attempts. Please try again later.',
});

const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 signin attempts
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 signup attempts per hour
  message: 'Too many sign up attempts. Please try again later.',
});

userRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const users = await User.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countUsers = await User.countDocuments();
    res.send({
      users,
      totalUsers: countUsers, // Include totalUsers in the response
      page,
      pages: Math.ceil(countUsers / PAGE_SIZE),
    });
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forget-password',
  resetLimiter, // 👈 middleware inserted here
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });
      user.resetToken = token;
      await user.save();

      const emailContent = {
        from: 'gabudemy@gmail.com',
        to: `${user.name} <${user.email}>`,
        subject: 'Reset Password',
        html: `<p>Please click the link below to reset your password (valid for 10 minutes):</p>
              <a href="${baseUrl()}/reset-password/${token}">Reset Password</a>`,
      };

      try {
        await transporter.sendMail(emailContent);
        res.send({ message: 'We sent a reset password link to your email.' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email.' });
      }
    } else {
      res.status(404).send({ message: 'Email Not Found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    // Regular expression for password complexity requirements
    // Password complexity requirements (example: minimum length, uppercase, lowercase, digit, and special character)
    // At least one digit ((?=.*\d))
    // At least one lowercase letter ((?=.*[a-z]))
    // At least one uppercase letter ((?=.*[A-Z]))
    // At least one special character ((?=.*[^a-zA-Z\d]))
    // A minimum length of 8 characters (.{8,})
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: token });
        if (user) {
          user.password = bcrypt.hashSync(password, 8);
          user.resetToken = undefined;
          await user.save();
          res.send({ message: 'Password reset successfully' });
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  signinLimiter, // 👈 Rate limiter added
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  signupLimiter, // 👈 Rate limiter added
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // lesson 10
    // Password complexity requirements (example: minimum length, uppercase, lowercase, digit, and special character)
    // At least one digit ((?=.*\d))
    // At least one lowercase letter ((?=.*[a-z]))
    // At least one uppercase letter ((?=.*[A-Z]))
    // At least one special character ((?=.*[^a-zA-Z\d]))
    // A minimum length of 8 characters (.{8,})
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

module.exports = userRouter;
