// src/pages/Backtesting.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/index';

// A new component to display results
function BacktestResults({ results }) {
  if (!results) return null;

  const { 
    finalBalance, netProfit, profitFactor, totalTrades, 
    winRate, maxDrawdown, winningTrades, losingTrades 
  } = results;

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  const formatPercent = (value) => `${value.toFixed(2)}%`;
  const formatNumber = (value) => value.toFixed(2);

  const metrics = [
    { label: 'Final Balance', value: formatCurrency(finalBalance), color: 'text-gold-400' },
    { label: 'Net Profit/Loss', value: formatCurrency(netProfit), color: netProfit > 0 ? 'text-green-400' : 'text-red-400' },
    { label: 'Win Rate', value: formatPercent(winRate), color: 'text-blue-400' },
    { label: 'Total Trades', value: totalTrades, color: 'text-white' },
    { label: 'Profit Factor', value: formatNumber(profitFactor), color: 'text-purple-400' },
    { label: 'Max Drawdown', value: formatPercent(maxDrawdown), color: 'text-red-500' },
    { label: 'Winning Trades', value: winningTrades, color: 'text-green-500' },
    { label: 'Losing Trades', value: losingTrades, color: 'text-red-500' },
  ];

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl mt-8">
      <div className="bg-dark-700 px-6 py-4 border-b border-dark-600 rounded-t-xl">
        <h3 className="text-lg font-bold text-white">Backtest Results</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <div key={metric.label} className="bg-dark-700 p-4 rounded-lg border border-dark-600">
              <p className="text-sm text-gray-400 font-medium">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function Backtesting() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    initialBalance: 10000,
    riskAmount: 100,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleRunBacktest = async () => {
    setLoading(true);
    setResults(null);
    try {
      const response = await api.post('/backtest/run', options);
      setResults(response.data);
    } catch (error) {
      console.error('Error running backtest:', error);
      // You could add a state to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Strategy Backtester</h2>
          <p className="text-gray-400 mb-6">
            Test the current AI trading strategy against historical data to evaluate its performance. 
            This simulation uses a simplified, rule-based version of the AI logic for rapid testing.
          </p>
          
          {/* Backtest Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-300 mb-1">Initial Balance ($)</label>
              <input
                type="number"
                name="initialBalance"
                id="initialBalance"
                value={options.initialBalance}
                onChange={handleInputChange}
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:ring-gold-500 focus:border-gold-500"
              />
            </div>
            <div>
              <label htmlFor="riskAmount" className="block text-sm font-medium text-gray-300 mb-1">Risk per Trade ($)</label>
              <input
                type="number"
                name="riskAmount"
                id="riskAmount"
                value={options.riskAmount}
                onChange={handleInputChange}
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:ring-gold-500 focus:border-gold-500"
              />
            </div>
            <div className="md:pt-7">
              <button
                onClick={handleRunBacktest}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-2.5 px-8 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                {loading ? 'Running Test...' : 'Run 1-Year Backtest'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white mt-4">Calculating results, this may take a moment...</p>
          </div>
        )}

        <BacktestResults results={results} />
      </div>
    </div>
  );
}

export default Backtesting;
