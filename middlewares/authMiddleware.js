const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user = decoded; // Attach decoded token info to request
    next();
  } catch (err) {
    return res.status(400).send('Invalid token.');
  }
};

module.exports = { authenticateToken };
