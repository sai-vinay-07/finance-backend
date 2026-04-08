const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body

        // basic validation
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" })
        }

        // check existing user
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username, email, password: hashedPassword,
            role: "viewer", isActive: true
        })

        await newUser.save()

        res.status(201).json({ message: "User registered", id: newUser._id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email/password required" })
        }

        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // check active before token
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account deactivated' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({ message: "Login successful", token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { registerUser, loginUser }

