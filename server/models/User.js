import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  settings: {
    riskPercentage: {
      type: Number,
      default: 1.0, // Default to 1% risk per trade
      min: 0.1,
      max: 10
    },
    // Future settings can be added here
  }
})

export default mongoose.model('User', userSchema)