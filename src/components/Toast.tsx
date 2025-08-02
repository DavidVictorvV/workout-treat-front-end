import React, { useEffect, useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';

interface ToastProps {
  message: string;
  points?: number;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  points, 
  show, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="font-medium">{message}</span>
        {points && (
          <div className="flex items-center space-x-1 bg-green-700 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold">+{points}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;