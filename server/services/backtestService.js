// server/services/backtestService.js
import { RSI, MACD, BollingerBands } from 'technicalindicators';
import { getHistoricalData } from './priceService.js';

// This is a simplified, non-API version of the suggestion generator for speed.
async function getSignalForDay(dataWindow) {
  const close = dataWindow.map(d => d.close);
  const currentPrice = close[close.length - 1];

  // Basic validation
  if (close.length < 30) {
    return 'HOLD'; // Not enough data to calculate indicators
  }

  try {
    const rsi = RSI.calculate({ values: close, period: 14 }).slice(-1)[0];
    const macdInput = { values: close, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false };
    const macd = MACD.calculate(macdInput).slice(-1)[0];

    // Simple logic based on indicators (to avoid slow AI calls in a loop)
    if (rsi < 30 && macd.histogram > 0) return 'BUY';
    if (rsi > 70 && macd.histogram < 0) return 'SELL';
    
    return 'HOLD';
  } catch (error) {
    // If indicators fail for any reason
    return 'HOLD';
  }
}

export async function runBacktest(options) {
  const { initialBalance = 10000, riskAmount = 100 } = options;

  let balance = initialBalance;
  let trades = [];
  let position = null; // 'LONG', 'SHORT', or null
  let peakBalance = initialBalance;
  let maxDrawdown = 0;

  const data = await getHistoricalData(); // Use real historical data
  if (!data || data.length < 30) {
    throw new Error('Not enough historical data to run a backtest.');
  }

  for (let i = 30; i < data.length; i++) { // Start after enough data for indicators
    const currentDay = data[i];
    const currentPrice = currentDay.close;
    const dataWindow = data.slice(0, i + 1);

    // Update peak balance and drawdown
    if (balance > peakBalance) {
      peakBalance = balance;
    }
    const drawdown = ((peakBalance - balance) / peakBalance) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }

    const signal = await getSignalForDay(dataWindow);

    // --- Position Management ---
    if (position) {
      const entryPrice = position.entryPrice;
      let pnl = 0;
      if (position.type === 'LONG') pnl = (currentPrice - entryPrice) * position.units;
      if (position.type === 'SHORT') pnl = (entryPrice - currentPrice) * position.units;

      // Exit condition (e.g., signal changes or simple stop/profit)
      const shouldExit = (position.type === 'LONG' && signal === 'SELL') || (position.type === 'SHORT' && signal === 'BUY');
      
      if (shouldExit) {
        balance += pnl;
        trades.push({
          ...position,
          exitDate: currentDay.date,
          exitPrice: currentPrice,
          pnl: pnl,
          balance: balance,
        });
        position = null;
      }
    }

    // --- Entry Logic ---
    if (!position) {
      if (signal === 'BUY' || signal === 'SELL') {
        const stopLossPrice = signal === 'BUY' ? currentPrice * 0.98 : currentPrice * 1.02; // 2% stop loss
        const units = riskAmount / Math.abs(currentPrice - stopLossPrice);
        
        position = {
          type: signal === 'BUY' ? 'LONG' : 'SHORT',
          entryDate: currentDay.date,
          entryPrice: currentPrice,
          units: units,
          stopLoss: stopLossPrice,
        };
      }
    }
  }

  // --- Compile Results ---
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0).length;
  const losingTrades = totalTrades - winningTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const netProfit = balance - initialBalance;
  const profitFactor = trades.reduce((acc, t) => {
    if (t.pnl > 0) acc.gains += t.pnl;
    if (t.pnl < 0) acc.losses += Math.abs(t.pnl);
    return acc;
  }, { gains: 0, losses: 0 });

  return {
    initialBalance: initialBalance,
    finalBalance: balance,
    netProfit: netProfit,
    profitFactor: profitFactor.losses > 0 ? profitFactor.gains / profitFactor.losses : 0,
    totalTrades: totalTrades,
    winningTrades: winningTrades,
    losingTrades: losingTrades,
    winRate: winRate,
    maxDrawdown: maxDrawdown,
    trades: trades.slice(-100), // Return last 100 trades to avoid huge payload
  };
}
