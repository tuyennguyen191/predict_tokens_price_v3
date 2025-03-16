import axios from 'axios';
import { Cryptocurrency, HistoricalData } from '../types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCryptocurrencies = async (limit: number = 10): Promise<Cryptocurrency[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return [];
  }
};

export const fetchHistoricalData = async (
  coinId: string,
  days: number = 30
): Promise<HistoricalData> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return { prices: [] };
  }
};

// Simple prediction algorithm based on historical data
export const predictPrice = (historicalData: HistoricalData, days: number): number => {
  if (!historicalData.prices || historicalData.prices.length < 2) {
    return 0;
  }

  const prices = historicalData.prices.map(price => price[1]);
  
  // Simple linear regression
  const x = Array.from({ length: prices.length }, (_, i) => i);
  const y = prices;
  
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((a, b, i) => a + b * y[i], 0);
  const sum_xx = x.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;
  
  // Predict future price
  const predictedPrice = slope * (n + days) + intercept;
  
  return predictedPrice > 0 ? predictedPrice : prices[prices.length - 1];
};
