// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body.email);
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: Email already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id, user.email, user.role);
    console.log('User registered successfully:', user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.email, user.role);
    console.log('User logged in successfully:', user.email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    console.log('Token verification for user:', req.user.email);
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
};