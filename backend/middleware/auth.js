const jwt = require('jsonwebtoken');

// middleware to verify JWT tokens
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required - token not provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is expired or invalid'
    });
  }
};

module.exports = auth;
