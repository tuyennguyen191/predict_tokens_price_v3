import React from 'react';
import { TrendingUp } from 'lucide-react';
import UserMenu from './UserMenu';

interface HeaderProps {
  onOpenAuthModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp size={32} className="mr-2" />
            <h1 className="text-2xl font-bold">CryptoPredictX</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-blue-200 transition-colors">Home</a>
              <a href="#" className="hover:text-blue-200 transition-colors">About</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Contact</a>
            </div>
            
            <UserMenu onOpenAuthModal={onOpenAuthModal} />
          </div>
        </div>
        <p className="mt-2 text-blue-100 max-w-2xl">
          Advanced cryptocurrency price prediction using machine learning algorithms
        </p>
      </div>
    </header>
  );
};

export default Header;
