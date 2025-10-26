const express = require('express');
const router = express.Router();
const {
    updateUserProfile,
    getUserProfile,
    getUserById,
    getAllUsers,
    deleteUserById // <-- Import new function
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // <-- Import protect and admin

// Public routes (consider protecting these later)
router.get('/profile/:email', getUserProfile); // Route from old dashboard
router.put('/update', updateUserProfile);    // Route from old dashboard

// Protected Routes
router.get('/me', protect, getUserById); // Get logged-in user profile
router.get('/', protect, getAllUsers);   // Get all users (used by AdminPage)

// Admin Only Route
router.delete('/:id', protect, admin, deleteUserById); // <-- Add delete route

module.exports = router;

