import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken'; // lesson 10
import User from '../models/userModel.js';
import {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl, // lesson 10
  transporter, // lesson 10
} from '../utils.js';

const userRouter = express.Router();

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

// lesson 10
// Update user profile
userRouter.put(
  '/profile',
  isAuth, // Custom middleware to check if user is authenticated
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Find user by ID in the token
    if (user) {
      // Update user details if provided in the request.body
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8); // Hash and update password
      }

      const updatedUser = await user.save(); // Save the updated user details
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser), // Generate a new token for the updated user
      });
    } else {
      res.status(404).send({ message: 'User not found' }); // Send 404 if user is not found
    }
  })
);

// Forget password endpoint
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }); // Find user by email

    if (user) {
      // Generate and save reset token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m', // Set expiration time for the token
      });
      user.resetToken = token;
      await user.save();

      console.log(`${baseUrl()}/reset-password/${token}`); // Log the reset password link

      const emailContent = {
        from: 'gabudemy.com', // Sender email
        to: `${user.name} <${user.email}>`, // Receiver email
        subject: `Reset Password`, // Email subject
        html: ` 
        <p>Please Click the following link to reset your password, link expires in 10 minutes</p> 
        <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
        `, // Email HTML content with the reset password link
      };

      try {
        // Send the email using the nodemailer transporter
        const info = await transporter.sendMail(emailContent);
        res.send({ message: 'We sent reset password link to your email.' }); // Send success message
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email.' }); // Send error status if email sending fails
      }
    } else {
      res.status(404).send({ message: 'Email Not Found' }); // Send 404 if email is not found
    }
  })
);

// Reset password endpoint
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body; // Get password and token from request body

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
        .send({ message: 'Password does not meet complexity requirements.' }); // Send 400 if password complexity requirements are not met
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' }); // Send 401 for invalid token
      } else {
        const user = await User.findOne({ resetToken: token }); // Find user by reset token
        if (user) {
          user.password = bcrypt.hashSync(password, 8); // Hash and update password
          user.resetToken = undefined; // Reset token after password change
          await user.save();
          res.send({ message: 'Password reset successfully' }); // Send success message
        } else {
          res.status(404).send({ message: 'User not found' }); // Send 404 if user is not found
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

export default userRouter;
