const jwt = require('jsonwebtoken');
const logger = require('winston');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ msg: 'Token is not valids' });
  }
};
