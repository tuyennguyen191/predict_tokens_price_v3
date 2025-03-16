import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Cryptocurrency } from '../types';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  onClick: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick }) => {
  const priceChangeIsPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-2" />
        <h3 className="font-bold text-lg">{crypto.name}</h3>
        <span className="text-gray-500 ml-2">{crypto.symbol.toUpperCase()}</span>
      </div>
      
      <div className="mt-2">
        <p className="text-xl font-semibold">${crypto.current_price.toLocaleString()}</p>
        <div className={`flex items-center mt-1 ${priceChangeIsPositive ? 'text-green-500' : 'text-red-500'}`}>
          {priceChangeIsPositive ? (
            <ArrowUpCircle size={16} className="mr-1" />
          ) : (
            <ArrowDownCircle size={16} className="mr-1" />
          )}
          <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
