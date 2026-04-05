const express = require('express')
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')    
const User = require('../models/userModel')

const authMiddleware = async (req,res,next)=>{
    try {

        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if(!user){
            return res.status(401).json({message : "Unauthorized"})
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        req.user = user
        next()

    } catch (error) {

        return res.status(401).json({message : "Unauthorized"})

    }
}

module.exports = authMiddleware