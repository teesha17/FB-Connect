import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const AuthMiddleware = async (req, res, next) => {
  const token = req.header('token');

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
