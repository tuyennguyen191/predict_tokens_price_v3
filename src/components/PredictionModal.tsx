import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, TrendingUp, Clock } from 'lucide-react';
import { Cryptocurrency, HistoricalData, PredictionResult } from '../types';
import { fetchHistoricalData, predictPrice } from '../api/cryptoApi';
import PriceChart from './PriceChart';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrypto: Cryptocurrency | null;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, selectedCrypto }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData>({ prices: [] });
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const timeframes = [
    { days: 7, label: '7 Days' },
    { days: 30, label: '30 Days' },
    { days: 90, label: '3 Months' },
  ];

  useEffect(() => {
    const loadData = async () => {
      if (selectedCrypto && isOpen) {
        setIsLoading(true);
        try {
          const data = await fetchHistoricalData(selectedCrypto.id, 30);
          setHistoricalData(data);
          
          // Generate predictions for different timeframes
          const newPredictions = timeframes.map(timeframe => {
            const predictedPrice = predictPrice(data, timeframe.days);
            const percentageChange = ((predictedPrice - selectedCrypto.current_price) / selectedCrypto.current_price) * 100;
            
            return {
              coin: selectedCrypto.name,
              currentPrice: selectedCrypto.current_price,
              predictedPrice,
              percentageChange,
              timeframe: timeframe.label
            };
          });
          
          setPredictions(newPredictions);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [selectedCrypto, isOpen]);

  if (!selectedCrypto) return null;

  const currentPrediction = predictions.find(p => 
    p.timeframe === timeframes.find(t => t.days === selectedTimeframe)?.label
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-xl font-bold flex items-center">
              {selectedCrypto.name} Price Prediction
              <TrendingUp className="ml-2 text-blue-500" />
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-12 h-12 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})</h3>
                    <p className="text-gray-600">Current Price: ${selectedCrypto.current_price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex space-x-2 mb-4">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe.days}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          selectedTimeframe === timeframe.days
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedTimeframe(timeframe.days)}
                      >
                        <Clock size={16} className="mr-1" />
                        {timeframe.label}
                      </button>
                    ))}
                  </div>

                  {currentPrediction && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="text-lg font-semibold mb-2">Prediction Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-gray-500 text-sm">Current Price</p>
                          <p className="text-xl font-bold">${currentPrediction.currentPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-gray-500 text-sm">Predicted Price</p>
                          <p className="text-xl font-bold">${currentPrediction.predictedPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-gray-500 text-sm">Potential Change</p>
                          <p className={`text-xl font-bold ${
                            currentPrediction.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {currentPrediction.percentageChange >= 0 ? '+' : ''}
                            {currentPrediction.percentageChange.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <PriceChart 
                    historicalData={historicalData} 
                    predictedPrice={currentPrediction?.predictedPrice || 0}
                    coinName={selectedCrypto.name}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p className="font-semibold">Disclaimer:</p>
                  <p>This prediction is based on historical data analysis and should not be considered as financial advice. Cryptocurrency markets are highly volatile and unpredictable. Always do your own research before making investment decisions.</p>
                </div>
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PredictionModal;
