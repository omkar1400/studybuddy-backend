const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Protects private routes by verifying the Bearer token sent in the
 * Authorization header.  On success it attaches the decoded userId to
 * `req.userId` so downstream route handlers know who the caller is.
 *
 * Usage: add `auth` as a route-level or router-level middleware, e.g.
 *   router.get('/profile', auth, getProfile);
 */
const auth = async (req, res, next) => {
  try {
    // Extract the token — expects:  Authorization: Bearer <token>
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Reject requests that carry no token at all
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify signature and expiry against JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object for use in controllers
    req.userId = decoded.id;

    // Pass control to the next handler
    next();
  } catch (error) {
    // jwt.verify throws when the token is expired, tampered, or malformed
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

module.exports = auth;
