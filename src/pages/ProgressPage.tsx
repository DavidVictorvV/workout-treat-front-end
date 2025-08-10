import React, { useState, useEffect, useCallback } from "react";
import { Star, Dumbbell, Trophy, Target, RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import StatsCard from "@/components/StatsCard";
import WorkoutChart from "@/components/WorkoutChart";
import DateFilter, { type DateFilterType, type DateRange } from "@/components/DateFilter";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import { useBackendData } from "@/hooks/useBackendData";

const ProgressPage: React.FC = () => {
  const { 
    totalPoints, 
    currentStreak, 
    longestStreak, 
    workoutHistory, 
    workoutStats,
    chartData,
    loading, 
    error,
    statsLoading,
    getStatsData,
    refreshStats
  } = useBackendData();
  
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thisMonth');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [hasLoadedDefault, setHasLoadedDefault] = useState(false);


  // Fetch stats data based on filter using centralized context
  const fetchStatsData = useCallback(async () => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    let period: 'thisMonth' | 'lastMonth' | undefined;

    switch (dateFilter) {
      case 'thisMonth':
        period = 'thisMonth';
        break;
      case 'lastMonth':
        period = 'lastMonth';
        break;
      case 'custom':
        if (customDateRange.startDate && customDateRange.endDate) {
          startDate = customDateRange.startDate;
          endDate = customDateRange.endDate;
        }
        break;
    }

    await getStatsData(startDate, endDate, period);
  }, [dateFilter, customDateRange, getStatsData]);

  // Track when default data becomes available from initial load
  useEffect(() => {
    if (!loading && workoutStats && chartData && !hasLoadedDefault) {
      setHasLoadedDefault(true);
    }
  }, [loading, workoutStats, chartData, hasLoadedDefault]);

  // Fetch stats only when user explicitly changes from default (thisMonth with no custom dates)
  useEffect(() => {
    // Don't fetch if we haven't loaded default data yet or if we're using default settings
    if (!hasLoadedDefault || loading) return;

    const isDefaultView = dateFilter === 'thisMonth' && !customDateRange.startDate && !customDateRange.endDate;
    
    // Only fetch when user changes away from default view
    if (!isDefaultView) {
      fetchStatsData();
    }
  }, [dateFilter, customDateRange, hasLoadedDefault, loading, fetchStatsData]);

  // Get date range label for display
  const getDateRangeLabel = (): string => {
    switch (dateFilter) {
      case 'thisMonth':
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'lastMonth': {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  const handleCustomDateRangeSelect = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    setDateFilter('custom');
  };

  // Calculate stats for the filtered period
  const workoutsInPeriod = workoutStats?.summary?.totalWorkouts || 0;
  const pointsEarnedInPeriod = workoutStats?.summary?.pointsEarned || 0;
  const weeklyGoal = 7;
  const weeklyProgress = Math.min(workoutsInPeriod, weeklyGoal);

  if (loading) {
    return (
      <PageLayout points={totalPoints} title="Statistics">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading statistics...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout points={totalPoints} title="Statistics">
        <div className="bg-red-600/20 border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-400 mb-2">Error loading statistics</p>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout points={totalPoints} title="Statistics">
      {/* Header with reload button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <DateFilter
            selectedFilter={dateFilter}
            customDateRange={customDateRange}
            onFilterChange={setDateFilter}
            onCustomDateChange={setCustomDateRange}
          />
        </div>
        <button
          onClick={refreshStats}
          disabled={statsLoading}
          className="ml-4 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 transition-colors disabled:opacity-50"
          title="Reload statistics"
        >
          <RefreshCw className={`w-4 h-4 text-slate-300 ${statsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Workout Calendar - only shown when custom filter is selected */}
      <WorkoutCalendar
        workoutEntries={workoutHistory}
        onDateRangeSelect={handleCustomDateRangeSelect}
        isVisible={dateFilter === 'custom'}
      />

      {/* Progress Card */}
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
          value={totalPoints}
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
          value={`${currentStreak}/${longestStreak}`}
          label="Current/Best Streak"
          iconColor="text-orange-400"
          valueColor="text-orange-400"
        />
      </div>

      {/* Workout Chart */}
      {statsLoading ? (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
              <p className="text-slate-400 text-sm">Loading chart data...</p>
            </div>
          </div>
        </div>
      ) : chartData ? (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold mb-4">Workout Statistics - {getDateRangeLabel()}</h3>
          
          {/* Use the existing WorkoutChart component with adapted data */}
          <WorkoutChart
            workoutEntries={workoutStats?.workouts || []}
            dateRange={getDateRangeLabel()}
          />
        </div>
      ) : null}

      {/* Recent Achievements */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
        
        <div className="space-y-4">
          {workoutStats && workoutStats.workouts.length > 0 ? (
            <div className="space-y-3">
              {workoutStats.workouts.slice(-3).reverse().map((workout, index) => (
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
                      })} • +{workout.pointsEarned} points
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