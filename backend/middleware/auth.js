const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../data/mockDbStore');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'hostelsync_super_secret_jwt_key_2026_x89!';


// ================= PROTECT =================

const protect = async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;


    // MongoDB user
    if (
      decoded.id &&
      mongoose.Types.ObjectId.isValid(decoded.id)
    ) {

      user = await User.findById(decoded.id)
        .select('+passwordHash');

      if (user) {

        req.user = user;

        // Compatibility with existing routes
        req.user.id = user._id.toString();

        return next();
      }
    }


    // Demo / mock user
    user = mockStore.users.find(
      u =>
        u.id === decoded.id ||
        u.email === decoded.email
    );


    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in session'
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error('Auth error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};


// ================= ROLE AUTHORIZATION =================

const authorize = (...roles) => {

  return (req, res, next) => {

    if (
      !req.user ||
      !roles.includes(req.user.role)
    ) {

      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized to access this resource`
      });

    }

    next();
  };
};


module.exports = {
  protect,
  authorize,
  JWT_SECRET
};