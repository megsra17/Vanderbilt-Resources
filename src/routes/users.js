// src/routes/users.js
import express from 'express'
import User from '../models/Users.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Registration endpoint
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body
  try {
    // Check if the user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create a new user
    user = new User({ email, password, name, role })
    await user.save()

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.json({ user, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log('Login attempt for:', email) // Debug log
  try {
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found for email:', email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      console.log('Password mismatch for email:', email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ user, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
