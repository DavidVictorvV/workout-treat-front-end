import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WorkoutHistoryEntry } from '@/services/apiService';
import type { DateRange } from './DateFilter';

type WorkoutEntry = WorkoutHistoryEntry;

interface WorkoutCalendarProps {
  workoutEntries: WorkoutEntry[];
  onDateRangeSelect: (dateRange: DateRange) => void;
  isVisible: boolean;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  workouts: WorkoutEntry[];
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  workoutEntries,
  onDateRangeSelect,
  isVisible
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });

  if (!isVisible) return null;

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // First day of the week for the first day of month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentIterDate = new Date(startDate);
    
    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = currentIterDate.toISOString().split('T')[0];
      const dayWorkouts = workoutEntries.filter(entry => 
        entry.completedAt.startsWith(dateStr)
      );
      
      days.push({
        date: dateStr,
        day: currentIterDate.getDate(),
        isCurrentMonth: currentIterDate.getMonth() === month,
        workouts: dayWorkouts
      });
      
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }
    
    return days;
  };

  const handleDayClick = (dateStr: string) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new selection
      setSelectedRange({ start: dateStr, end: null });
    } else if (selectedRange.start && !selectedRange.end) {
      // Complete the range
      const start = selectedRange.start;
      const end = dateStr;
      
      // Ensure start is before end
      const finalStart = start <= end ? start : end;
      const finalEnd = start <= end ? end : start;
      
      setSelectedRange({ start: finalStart, end: finalEnd });
      onDateRangeSelect({ startDate: finalStart, endDate: finalEnd });
    }
  };

  const isDateInRange = (dateStr: string): boolean => {
    if (!selectedRange.start) return false;
    if (!selectedRange.end) return dateStr === selectedRange.start;
    
    return dateStr >= selectedRange.start && dateStr <= selectedRange.end;
  };

  const isDateRangeEnd = (dateStr: string): boolean => {
    return dateStr === selectedRange.start || dateStr === selectedRange.end;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getWorkoutIcons = (workouts: WorkoutEntry[]): string => {
    const uniqueIcons = [...new Set(workouts.map(w => w.workoutIcon))];
    return uniqueIcons.slice(0, 3).join(''); // Show max 3 icons
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Select Date Range</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium min-w-[180px] text-center">
            {monthName}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-4 text-sm text-slate-400 text-center">
        {!selectedRange.start ? (
          "Click on a date to start selecting a range"
        ) : !selectedRange.end ? (
          "Click on another date to complete the range"
        ) : (
          `Selected: ${new Date(selectedRange.start).toLocaleDateString()} - ${new Date(selectedRange.end).toLocaleDateString()}`
        )}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const hasWorkouts = day.workouts.length > 0;
          const isInRange = isDateInRange(day.date);
          const isRangeEnd = isDateRangeEnd(day.date);
          
          return (
            <button
              key={index}
              onClick={() => day.isCurrentMonth && handleDayClick(day.date)}
              disabled={!day.isCurrentMonth}
              className={`
                relative p-2 h-12 text-sm rounded-lg transition-all duration-200 flex flex-col items-center justify-center
                ${!day.isCurrentMonth 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-white hover:bg-slate-700/50 cursor-pointer'
                }
                ${isInRange && day.isCurrentMonth
                  ? isRangeEnd 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    : 'bg-amber-400/20 border border-amber-400/30'
                  : ''
                }
                ${hasWorkouts && day.isCurrentMonth && !isInRange
                  ? 'border border-green-400/30 bg-green-400/10'
                  : ''
                }
              `}
            >
              <span className="text-xs font-medium">{day.day}</span>
              {hasWorkouts && (
                <div className="text-[8px] leading-none mt-1 flex flex-wrap justify-center max-w-full overflow-hidden">
                  {getWorkoutIcons(day.workouts)}
                </div>
              )}
              {hasWorkouts && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400/20 border border-green-400/30 rounded"></div>
          <span>Has workouts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded"></div>
          <span>Selected range</span>
        </div>
      </div>

      {/* Clear selection button */}
      {(selectedRange.start || selectedRange.end) && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setSelectedRange({ start: null, end: null })}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutCalendar;