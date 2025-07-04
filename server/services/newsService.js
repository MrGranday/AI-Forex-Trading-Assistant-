
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY ; // Hardcode for testing
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Fetches recent news headlines related to gold.
 * @returns {Promise<string[]>} A promise that resolves to an array of headlines.
 */
export async function getGoldNews() {
  if (!NEWS_API_KEY) {
    console.warn('NewsAPI key not found, skipping news fetch.');
    return []; // Return empty array if key is not set
  }

  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: 'gold OR XAUUSD OR "precious metals" OR inflation',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 5,
        apiKey: NEWS_API_KEY,
      },
    });

    if (response.data && response.data.articles) {
      return response.data.articles.map(article => article.title);
    }

    console.warn('No news articles found.');
    return [];
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error.response ? error.response.data : error.message);
    return [];
  }
}