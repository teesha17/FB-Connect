import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';

export const RegisterUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ status: false, message: 'JWT_SECRET not configured' });
    }

    const { name, email, password } = req.body;
    console.log(req.body)

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(newUser)

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};
