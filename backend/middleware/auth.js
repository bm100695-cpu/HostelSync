const jwt = require('jsonwebtoken');
const mockStore = require('../data/mockDbStore');

const JWT_SECRET = process.env.JWT_SECRET || 'hostelsync_super_secret_jwt_key_2026_x89!';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = mockStore.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in session' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
