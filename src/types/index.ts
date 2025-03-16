export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface PredictionResult {
  coin: string;
  currentPrice: number;
  predictedPrice: number;
  percentageChange: number;
  timeframe: string;
}

export interface HistoricalData {
  prices: [number, number][];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
