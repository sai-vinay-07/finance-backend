const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUserByAdmin = async (req, res) => {
    try {

        const { username, email, password, role } = req.body;   

        const userRole = role || 'analyst';

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: userRole,
            isActive: true,
            createdAt: Date.now()
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });  

    } catch (error) {

        console.error('Error creating user:', error);

        return res.status(500).json({ message: 'Internal server error' });
        
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const total = await User.countDocuments();
        const users = await User.find({}, 'username email role isActive createdAt')
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            data: users,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user._id.toString() === id) {
        return res.status(403).json({ message: 'You cannot modify your own account' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Role updated successfully', user });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (req.user._id.toString() === id) {
        return res.status(403).json({ message: 'You cannot modify your own account' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', user });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createUserByAdmin, getAllUsers, updateUserRole, updateUserStatus }; 