const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// admin creates user account
const createUserByAdmin = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const userRole = role || 'analyst';

        // check email not taken
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email taken' });

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, email, password: hashedPass,
            role: userRole, isActive: true
        });

        await newUser.save();

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.log('Create user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// get users list with pagination
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNum - 1) * pageSize;

        const total = await User.countDocuments();
        const users = await User.find({}, 'username email role isActive createdAt')
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            data: users, total, page: pageNum,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.log('Users list error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// update role (cannot self-modify)
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // prevent self role change
    if (req.user._id.toString() === id) {
        return res.status(403).json({ message: 'Cannot change own role' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Role updated', user });
    } catch (error) {
        console.log('Role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// toggle user active status
const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    // prevent self status change
    if (req.user._id.toString() === id) {
        return res.status(403).json({ message: 'Cannot change own status' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Status updated', user });
    } catch (error) {
        console.log('Status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createUserByAdmin, getAllUsers, updateUserRole, updateUserStatus };

