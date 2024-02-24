import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// lesson 8
// Middleware function to check if user is an admin from orderRoutes
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // Checking if user is authenticated and isAdmin flag is true
    next(); // Proceeding to next middleware
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' }); // Sending error if user is not an admin
  }
};
