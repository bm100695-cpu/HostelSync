const jwt = require('jsonwebtoken');
const mockStore = require('../data/mockDbStore');
const { findUserById } = require('../services/userService');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'hostelsync_super_secret_jwt_key_2026_x89!';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    // Supabase user IDs are numeric
    if (decoded.id && /^\d+$/.test(String(decoded.id))) {
      user = await findUserById(String(decoded.id));
    }

    // Demo/mock user fallback
    if (!user) {
      user = mockStore.users.find(
        u => u.id === decoded.id || u.email === decoded.email
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in session'
      });
    }

    req.user = user;
    req.user.id = String(user.id || user._id);

    return next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized`
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };