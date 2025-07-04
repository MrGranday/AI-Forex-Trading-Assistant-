import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // For demo purposes, create a test user if it doesn't exist
    let user = await User.findOne({ email })
    
    if (!user && email === 'test@example.com') {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash('password123', saltRounds)
      
      user = new User({
        email: 'test@example.com',
        passwordHash: hashedPassword
      })
      await user.save()
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET ,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        settings: user.settings // Include settings on login
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// @route   PUT api/auth/me/settings
// @desc    Update user settings
// @access  Private
router.put('/me/settings', auth, async (req, res) => {
  try {
    const { riskPercentage } = req.body
    
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (riskPercentage) {
      user.settings.riskPercentage = riskPercentage
    }

    await user.save()
    res.json(user.settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router