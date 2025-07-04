
import axios from 'axios';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY ;
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetches recent daily data for XAUUSD.
 * @returns {Promise<number[]>} A promise that resolves to an array of recent closing prices.
 */
export async function getRealTimeData() {
  console.log('Alpha Vantage API Key in priceService.js:', API_KEY);
  if (!API_KEY) {
    console.error('Alpha Vantage API key is missing in environment variables.');
    throw new Error('Alpha Vantage API key is not configured.');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: 'XAUUSD',
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      console.error('No time series data in response:', response.data);
      throw new Error('No real-time data returned from Alpha Vantage. Check symbol or API key.');
    }

    // Extract closing prices in chronological order (last 34 days for MACD)
    const prices = Object.values(timeSeries)
      .slice(0, 34) // Increased to support MACD (26 + 9 - 1)
      .map(item => parseFloat(item['4. close']))
      .filter(price => !isNaN(price) && price > 0);
    if (prices.length < 34) {
      console.error('Insufficient prices:', prices);
      throw new Error(`Insufficient valid price data: ${prices.length} prices received.`);
    }
    return prices.reverse();
  } catch (error) {
    console.error('Error fetching real-time data from Alpha Vantage:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch real-time price data.');
  }
}

/**
 * Fetches daily historical data for XAUUSD.
 * @returns {Promise<object[]>} A promise that resolves to an array of objects with { date, close }.
 */
export async function getHistoricalData() {
  console.log('Alpha Vantage API Key in priceService.js:', API_KEY);
  if (!API_KEY) {
    console.error('Alpha Vantage API key is missing in environment variables.');
    throw new Error('Alpha Vantage API key is not configured.');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: 'XAUUSD',
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      console.error('No time series data in response:', response.data);
      throw new Error('No historical data returned from Alpha Vantage. Check symbol or API key.');
    }

    // Format data and reverse to get chronological order
    const formattedData = Object.entries(timeSeries)
      .map(([date, item]) => ({
        date,
        close: parseFloat(item['4. close']),
      }))
      .filter(item => !isNaN(item.close) && item.close > 0)
      .reverse();
    return formattedData;
  } catch (error) {
    console.error('Error fetching historical data from Alpha Vantage:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch historical price data.');
  }
}