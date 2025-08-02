import React, { useState, useMemo } from "react";
import { Star, Dumbbell, Trophy, Target } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import StatsCard from "@/components/StatsCard";
import WorkoutChart from "@/components/WorkoutChart";
import DateFilter, { type DateFilterType, type DateRange } from "@/components/DateFilter";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import { usePoints } from "@/hooks/usePoints";

const ProgressPage: React.FC = () => {
  const { totalPoints, workoutHistory, getWorkoutsByDateRange } = usePoints();
  
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thisMonth');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });

  // Calculate date ranges
  const getCurrentMonthRange = (): DateRange => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const getLastMonthRange = (): DateRange => {
    const now = new Date();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Get filtered workout data
  const filteredWorkouts = useMemo(() => {
    switch (dateFilter) {
      case 'thisMonth':
        const thisMonth = getCurrentMonthRange();
        return getWorkoutsByDateRange(thisMonth.startDate, thisMonth.endDate);
      case 'lastMonth':
        const lastMonth = getLastMonthRange();
        return getWorkoutsByDateRange(lastMonth.startDate, lastMonth.endDate);
      case 'custom':
        if (customDateRange.startDate && customDateRange.endDate) {
          return getWorkoutsByDateRange(customDateRange.startDate, customDateRange.endDate);
        }
        return [];
      default:
        return [];
    }
  }, [dateFilter, customDateRange, getWorkoutsByDateRange]);

  // Get date range label for display
  const getDateRangeLabel = (): string => {
    switch (dateFilter) {
      case 'thisMonth':
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'lastMonth':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  // Calculate stats for the filtered period
  const currentPoints = totalPoints;
  const workoutsInPeriod = filteredWorkouts.length;
  const pointsEarnedInPeriod = filteredWorkouts.reduce((sum, workout) => sum + workout.points, 0);
  const uniqueWorkoutTypes = new Set(filteredWorkouts.map(w => w.workoutName)).size;
  const weeklyGoal = 7;
  const weeklyProgress = Math.min(workoutsInPeriod, weeklyGoal);

  const handleCustomDateRangeSelect = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    setDateFilter('custom');
  };

  return (
    <PageLayout points={currentPoints} title="Statistics">
      {/* Date Filter */}
      <DateFilter
        selectedFilter={dateFilter}
        customDateRange={customDateRange}
        onFilterChange={setDateFilter}
        onCustomDateChange={setCustomDateRange}
      />

      {/* Workout Calendar - only shown when custom filter is selected */}
      <WorkoutCalendar
        workoutEntries={workoutHistory}
        onDateRangeSelect={handleCustomDateRangeSelect}
        isVisible={dateFilter === 'custom'}
      />

      {/* Weekly Progress Card */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold mb-4">Progress for {getDateRangeLabel()}</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-300">Workouts Completed</span>
            <span className="text-amber-400 font-medium">{weeklyProgress}/{weeklyGoal}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          {weeklyGoal - weeklyProgress > 0 
            ? `${weeklyGoal - weeklyProgress} more workouts to reach your goal!`
            : "🎉 Goal achieved! Keep up the great work!"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          icon={Star}
          value={currentPoints}
          label="Current Points"
          iconColor="text-amber-400"
          valueColor="text-amber-400"
        />
        <StatsCard
          icon={Dumbbell}
          value={workoutsInPeriod}
          label={`Workouts (${getDateRangeLabel()})`}
          iconColor="text-blue-400"
          valueColor="text-blue-400"
        />
        <StatsCard
          icon={Trophy}
          value={pointsEarnedInPeriod}
          label="Points Earned"
          iconColor="text-green-400"
          valueColor="text-green-400"
        />
        <StatsCard
          icon={Target}
          value={uniqueWorkoutTypes}
          label="Workout Types"
          iconColor="text-orange-400"
          valueColor="text-orange-400"
        />
      </div>

      {/* Workout Chart */}
      <WorkoutChart
        workoutEntries={filteredWorkouts}
        dateRange={getDateRangeLabel()}
      />

      {/* Recent Achievements */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
        
        <div className="space-y-4">
          {filteredWorkouts.length > 0 ? (
            <div className="space-y-3">
              {filteredWorkouts.slice(-3).reverse().map((workout, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    {workout.workoutIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-lg">{workout.workoutName}</div>
                    <div className="text-sm text-slate-400">
                      {new Date(workout.completedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • +{workout.points} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Star className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No workouts completed in {getDateRangeLabel().toLowerCase()}</p>
              <p className="text-xs mt-1">Complete some workouts to see your achievements!</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProgressPage;