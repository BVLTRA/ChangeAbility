const jwt = require('jsonwebtoken');

// Intercepts the request and verifies the cryptographic signature
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // If the token was tampered with, throw an error
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload (id, role) to the request object for the next function to use
    req.user = verified; 
    next(); // Pass control to the actual route handler
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// A secondary check that runs AFTER verifyToken to ensure the user is an Admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };