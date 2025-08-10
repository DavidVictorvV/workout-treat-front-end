import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type DateFilterType = 'thisMonth' | 'lastMonth' | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateFilterProps {
  selectedFilter: DateFilterType;
  customDateRange: DateRange;
  onFilterChange: (filter: DateFilterType) => void;
  onCustomDateChange: (dateRange: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedFilter,
  customDateRange,
  onFilterChange,
  onCustomDateChange
}) => {
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  const getCurrentMonth = (): { year: number; month: number } => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  };

  const getLastMonth = (): { year: number; month: number } => {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return { year, month: lastMonth };
  };

  const formatMonthName = (year: number, month: number): string => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleFilterSelect = (filter: DateFilterType) => {
    onFilterChange(filter);
    if (filter === 'custom') {
      setShowCustomInputs(true);
    } else {
      setShowCustomInputs(false);
    }
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = {
      ...customDateRange,
      [field]: value
    };
    onCustomDateChange(newRange);
  };

  const getFilterLabel = (): string => {
    switch (selectedFilter) {
      case 'thisMonth': {
        const current = getCurrentMonth();
        return formatMonthName(current.year, current.month);
      }
      case 'lastMonth': {
        const last = getLastMonth();
        return formatMonthName(last.year, last.month);
      }
      case 'custom':
        if (customDateRange.startDate && customDateRange.endDate) {
          const start = new Date(customDateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const end = new Date(customDateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return `${start} - ${end}`;
        }
        return 'Custom Range';
      default:
        return 'Select Period';
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Date Filter
      </h3>
      
      {/* Filter Options */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleFilterSelect('thisMonth')}
            className={`p-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              selectedFilter === 'thisMonth'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            This Month
          </button>
          
          <button
            onClick={() => handleFilterSelect('lastMonth')}
            className={`p-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              selectedFilter === 'lastMonth'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            Last Month
          </button>
          
          <button
            onClick={() => handleFilterSelect('custom')}
            className={`p-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              selectedFilter === 'custom'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Current Selection Display */}
        <div className="bg-slate-700/30 rounded-xl p-3 flex items-center justify-between">
          <span className="text-slate-300 text-sm">Selected: {getFilterLabel()}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Custom Date Inputs */}
        {(selectedFilter === 'custom' || showCustomInputs) && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {customDateRange.startDate && customDateRange.endDate && (
              <div className="text-center">
                <span className="text-sm text-green-400">
                  ✓ Date range selected
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilter;