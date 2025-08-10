import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WorkoutHistoryEntry } from '@/services/apiService';

type WorkoutEntry = WorkoutHistoryEntry;

interface WorkoutChartProps {
  workoutEntries: WorkoutEntry[];
  dateRange: string;
}

interface ChartDataPoint {
  date: string;
  overall: number;
  [workoutType: string]: number | string;
}

const WorkoutChart: React.FC<WorkoutChartProps> = ({ workoutEntries, dateRange }) => {
  const generateChartData = (): ChartDataPoint[] => {
    if (workoutEntries.length === 0) return [];

    // Group workouts by date
    const workoutsByDate: Record<string, WorkoutEntry[]> = {};
    workoutEntries.forEach(entry => {
      const date = entry.completedAt.split('T')[0];
      if (!workoutsByDate[date]) {
        workoutsByDate[date] = [];
      }
      workoutsByDate[date].push(entry);
    });

    // Get all unique workout types
    const workoutTypes = [...new Set(workoutEntries.map(entry => entry.workoutName))];

    // Create data points for each date
    const chartData: ChartDataPoint[] = [];
    const sortedDates = Object.keys(workoutsByDate).sort();

    sortedDates.forEach(date => {
      const dayWorkouts = workoutsByDate[date];
      const dataPoint: ChartDataPoint = {
        date: formatDateForDisplay(date),
        overall: dayWorkouts.length
      };

      // Count each workout type for this date
      workoutTypes.forEach(workoutType => {
        const count = dayWorkouts.filter(w => w.workoutName === workoutType).length;
        dataPoint[workoutType] = count;
      });

      chartData.push(dataPoint);
    });

    return chartData;
  };

  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWorkoutTypes = (): string[] => {
    return [...new Set(workoutEntries.map(entry => entry.workoutName))];
  };

  const getLineColor = (index: number): string => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', 
      '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
    ];
    return colors[index % colors.length];
  };

  const chartData = generateChartData();
  const workoutTypes = getWorkoutTypes();

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold mb-4">Workout Statistics</h3>
        <div className="text-center py-8 text-slate-400">
          <p>No workout data available for {dateRange}</p>
          <p className="text-sm mt-2">Complete some workouts to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-semibold mb-4">Workout Statistics - {dateRange}</h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            
            {/* Overall workout line */}
            <Line
              type="monotone"
              dataKey="overall"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
              name="Overall Workouts"
            />
            
            {/* Individual workout type lines */}
            {workoutTypes.map((workoutType, index) => (
              <Line
                key={workoutType}
                type="monotone"
                dataKey={workoutType}
                stroke={getLineColor(index)}
                strokeWidth={2}
                dot={{ fill: getLineColor(index), strokeWidth: 2, r: 4 }}
                name={workoutType}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{workoutEntries.length}</div>
          <div className="text-sm text-slate-400">Total Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{chartData.length}</div>
          <div className="text-sm text-slate-400">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{workoutTypes.length}</div>
          <div className="text-sm text-slate-400">Workout Types</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {workoutEntries.reduce((sum, entry) => sum + entry.pointsEarned, 0)}
          </div>
          <div className="text-sm text-slate-400">Points Earned</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutChart;