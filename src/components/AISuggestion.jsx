import { useState } from 'react'

function AISuggestion({ suggestion, onRefresh, loading }) {
  const [expanded, setExpanded] = useState(false)

  if (!suggestion) {
    return (
      <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl">
        <div className="bg-gradient-to-r from-gold-600 to-gold-500 px-6 py-4 rounded-t-xl">
          <h3 className="text-xl font-bold text-white">
            AI Recommendation (24H Analysis)
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            Get AI-powered trading insights based on real-time market analysis
          </p>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Market...</span>
              </div>
            ) : (
              'Generate AI Recommendation'
            )}
          </button>
        </div>
      </div>
    )
  }

  const getSignalColor = (signal) => {
    if (signal === 'BUY') return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (signal === 'SELL') return 'bg-red-500/20 text-red-400 border-red-500/30'
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 px-6 py-4 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            AI Recommendation
          </h3>
          {suggestion.analysis?.signal && (
            <div className={`px-4 py-1 rounded-md text-sm font-bold border ${getSignalColor(suggestion.analysis.signal)}`}>
              SIGNAL: {suggestion.analysis.signal}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Trading Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600">
            <p className="text-sm text-gray-400 font-medium">Entry Price</p>
            <p className="text-2xl font-bold text-green-400">${suggestion.entryPrice}</p>
          </div>
          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600">
            <p className="text-sm text-gray-400 font-medium">Target Profit</p>
            <p className="text-2xl font-bold text-gold-400">${suggestion.targetPrice}</p>
          </div>
          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600">
            <p className="text-sm text-gray-400 font-medium">Stop Loss</p>
            <p className="text-2xl font-bold text-red-400">${suggestion.stopLoss}</p>
          </div>
        </div>

        {/* Confidence & Risk */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600">
            <p className="text-sm text-gray-400 font-medium mb-2">Confidence Level</p>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-dark-600 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                  style={{ width: `${suggestion.confidence}%` }}
                ></div>
              </div>
              <span className="text-lg font-bold text-white">{suggestion.confidence}%</span>
            </div>
          </div>
          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600 text-center">
            <p className="text-sm text-gray-400 font-medium">Risk/Reward Ratio</p>
            <p className="text-xl font-bold text-blue-400">1:{suggestion.riskReward || 'N/A'}</p>
          </div>
        </div>

        {/* AI Analysis & Data Points */}
        <div className="bg-dark-700 p-4 rounded-lg border border-dark-600">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>AI Analysis & Data Points</span>
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gold-400 text-sm font-medium">{expanded ? 'Hide' : 'Show'} Details</span>
                <svg className={`w-4 h-4 text-gold-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </button>
          
          {expanded && (
            <div className="mt-4 pt-4 border-t border-dark-600 space-y-4">
              <div>
                <h4 className="font-bold text-white mb-2">Analyst's Reasoning:</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{suggestion.reason}</p>
              </div>
              {suggestion.analysis?.reasoning && (
                <div>
                  <h4 className="font-bold text-white mb-2">Key Data Points Used:</h4>
                  <p className="text-sm text-gray-400 font-mono bg-dark-800 p-3 rounded-md">{suggestion.analysis.reasoning}</p>
                </div>
              )}
              {suggestion.analysis?.news?.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-2">News Sentiment Analysis ({suggestion.analysis.sentiment}):</h4>
                  <ul className="space-y-2">
                    {suggestion.analysis.news.map((item, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start space-x-2">
                        <span className={`font-bold text-xs px-1.5 py-0.5 rounded-md ${
                          item.sentiment === 'POSITIVE' ? 'bg-green-500/20 text-green-400' :
                          item.sentiment === 'NEGATIVE' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.sentiment}
                        </span>
                        <span>{item.headline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Refreshing...</span>
              </div>
            ) : (
              'Refresh Recommendation'
            )}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(suggestion.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AISuggestion