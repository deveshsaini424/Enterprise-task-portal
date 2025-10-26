const UserModel = require('../models/userModel');

// @desc    Get user profile by email (used in old dashboard)
// @route   GET /api/users/profile/:email
// @access  Public (should probably be private)
const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.params.email });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile (used in old dashboard)
// @route   PUT /api/users/update
// @access  Public (should probably be private)
const updateUserProfile = async (req, res) => {
    const { email, phoneNumber, age, fatherNumber } = req.body;
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: email },
            { phoneNumber, age, fatherNumber },
            { new: true } // Return the updated document
        );
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's profile
// @route   GET /api/users/me
// @access  Private
const getUserById = async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        const user = await UserModel.findById(req.user._id).select('-password'); // Exclude password
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).select('-password'); // Exclude password from list
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user by ID (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserById = async (req, res) => {
    try {
        const userToDelete = await UserModel.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (userToDelete._id.equals(req.user._id)) {
            return res.status(400).json({ message: 'Admin cannot delete themselves' });
        }

        // Optional: Prevent admin from deleting other admins
        if (userToDelete.role === 'admin') {
             return res.status(403).json({ message: 'Cannot delete other admin users' });
        }

        // TODO: Add logic here to remove the user from any project teams they are on,
        // or reassign their tasks before deleting. This is complex.
        // For now, we just delete the user document.

        await UserModel.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserById,
    getAllUsers,
    deleteUserById // <-- Export the new function
};

