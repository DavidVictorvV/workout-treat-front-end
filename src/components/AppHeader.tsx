import React from "react";
import { Dumbbell } from "lucide-react";

interface AppHeaderProps {
  points: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({ points }) => {
  return (
    <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg text-white">FitPoints</h1>
          </div>
          <div className="flex items-center bg-slate-800/80 rounded-full px-4 py-2 space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">★</span>
            </div>
            <span className="text-amber-400 text-lg">{points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;