import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    // In a real app, you would fetch the user from the database
    // For now, we'll just return the decoded token data
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    // In a real app, you would update the user in the database
    // For now, we'll just return a success message
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 