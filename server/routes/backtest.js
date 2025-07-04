// server/routes/backtest.js
import express from 'express';
import auth from '../middleware/auth.js';
import { runBacktest } from '../services/backtestService.js';

const router = express.Router();

// @route   POST api/backtest/run
// @desc    Run a new backtest
// @access  Private
router.post('/run', auth, async (req, res) => {
  try {
    const options = {
      initialBalance: req.body.initialBalance || 10000,
      riskAmount: req.body.riskAmount || 100,
    };

    const results = await runBacktest(options);
    res.json(results);
  } catch (error) {
    console.error('Error running backtest:', error);
    res.status(500).json({ error: 'Failed to run backtest' });
  }
});

export default router;
