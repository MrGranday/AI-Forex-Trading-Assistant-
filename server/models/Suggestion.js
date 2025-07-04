import mongoose from 'mongoose'

const suggestionSchema = new mongoose.Schema({
  entryPrice: {
    type: Number,
    required: true
  },
  targetPrice: {
    type: Number,
    required: true
  },
  stopLoss: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number
  },
  reason: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskReward: {
    type: Number,
    default: 2.5
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  analysis: {
    indicator: { type: String },
    signal: { type: String },
    reasoning: { type: String },
    sentiment: { type: String },
    news: [
      {
        headline: { type: String },
        sentiment: { type: String }
      }
    ]
  }
})

export default mongoose.model('Suggestion', suggestionSchema)