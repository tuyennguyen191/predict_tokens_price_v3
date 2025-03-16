import React, { useState, useEffect } from 'react';
import { fetchTopCryptocurrencies } from './api/cryptoApi';
import { Cryptocurrency } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CryptoCard from './components/CryptoCard';
import PredictionModal from './components/PredictionModal';
import AuthModal from './components/AuthModal';
import { Search, RefreshCw } from 'lucide-react';
import { useAuth } from './context/AuthContext';

function App() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { authState } = useAuth();

  useEffect(() => {
    loadCryptocurrencies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cryptocurrencies.filter(
        crypto => 
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCryptos(filtered);
    } else {
      setFilteredCryptos(cryptocurrencies);
    }
  }, [searchTerm, cryptocurrencies]);

  const loadCryptocurrencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopCryptocurrencies(20);
      setCryptocurrencies(data);
      setFilteredCryptos(data);
    } catch (err) {
      setError('Failed to load cryptocurrency data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoSelect = (crypto: Cryptocurrency) => {
    if (!authState.user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedCrypto(crypto);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Predict Cryptocurrency Prices with AI</h2>
              <p className="text-xl mb-6">
                Select any cryptocurrency to see price predictions based on historical data analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
                <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  How It Works
                </button>
                {!authState.user && (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Sign Up Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Top Cryptocurrencies</h2>
            
            <div className="flex w-full md:w-auto space-x-2">
              <div className="relative flex-grow md:flex-grow-0">
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              <button 
                onClick={loadCryptocurrencies}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : filteredCryptos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No cryptocurrencies found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCryptos.map((crypto) => (
                <CryptoCard 
                  key={crypto.id} 
                  crypto={crypto} 
                  onClick={() => handleCryptoSelect(crypto)}
                />
              ))}
            </div>
          )}
        </section>
        
        <section className="mt-16 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">How Our Prediction Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600">
                We collect historical price data from reliable cryptocurrency exchanges and market sources.
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Analysis</h3>
              <p className="text-gray-600">
                Our algorithms analyze price patterns, market trends, and historical performance.
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Prediction</h3>
              <p className="text-gray-600">
                Based on the analysis, we generate price predictions for different timeframes.
              </p>
            </div>
          </div>
        </section>
        
        {!authState.user && (
          <section className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Create Your Free Account Today</h2>
              <p className="text-xl mb-6">
                Sign up to save your favorite cryptocurrencies, get personalized predictions, and receive market alerts.
              </p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors text-lg"
              >
                Get Started
              </button>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      
      <PredictionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCrypto={selectedCrypto}
      />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
