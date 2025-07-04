import mongoose from 'mongoose'

const newsAnalysisSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  relevance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sentiment: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('NewsAnalysis', newsAnalysisSchema)