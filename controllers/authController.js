const express = require('express')
const dotenv = require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req,res)=>{
    try {

        const {username,email,password,confirmPassword} = req.body

        if(!username || !email || !password || !confirmPassword){
            return res.status(400).json({message : "All fields are required"})
        }   

        if(password !== confirmPassword){
            return res.status(400).json({message : "Password and confirm password do not match"})
        }

        const existingUser = await User.findOne({email})  

        if(existingUser){
            return res.status(400).json({message : "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            username,
            email,
            password : hashedPassword,
            role : "viewer",
            isActive : true,
            createdAt : Date.now()
        })  

        await newUser.save()

        return res.status(201).json({message : "User registered successfully"})
    }
        catch (error) {
        console.error(error)
        return res.status(500).json({message : "Internal server error"})
    }
}       

const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body 

        if(!email || !password){
            return res.status(400).json({message : "All fields are required"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({message : "Invalid credentials"})
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"})
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : "1h"})

        return res.status(200).json({message : "Login successful", token})          

    } catch (error) {
        console.error(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {registerUser,loginUser}