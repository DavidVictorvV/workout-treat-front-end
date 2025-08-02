import React from "react";
import { Star, Dumbbell, Trophy, Target } from "lucide-react";

const ProgressPage: React.FC = () => {
  // Sample data - in a real app this would come from state/API
  const currentPoints = 300;
  const workoutsToday = 0;
  const totalEarned = 300;
  const weeklyGoal = 7;
  const weeklyProgress = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Sticky Header */}
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
              <span className="text-amber-400 text-lg">{currentPoints}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pb-24 px-4">
        <div className="py-6">
          <h2 className="text-2xl text-white mb-6">Statistics</h2>
          <div className="space-y-6">
            {/* Weekly Progress Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300">Workouts Completed</span>
                  <span className="text-amber-400 font-medium">{weeklyProgress}/{weeklyGoal}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyProgress / weeklyGoal) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                {weeklyGoal - weeklyProgress} more workouts to reach your goal!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current Points */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
                <Star className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-amber-400 mb-1">{currentPoints}</div>
                <div className="text-sm text-slate-400">Current Points</div>
              </div>

              {/* Workouts Today */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
                <Dumbbell className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-400 mb-1">{workoutsToday}</div>
                <div className="text-sm text-slate-400">Workouts Today</div>
              </div>

              {/* Total Earned */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
                <Trophy className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-400 mb-1">{totalEarned}</div>
                <div className="text-sm text-slate-400">Total Earned</div>
              </div>

              {/* Weekly Goal */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
                <Target className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-400 mb-1">{weeklyProgress}/{weeklyGoal}</div>
                <div className="text-sm text-slate-400">Weekly Goal</div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-lg">First Workout</div>
                    <div className="text-sm text-slate-400">Complete your first workout</div>
                  </div>
                </div>
                
                {/* Placeholder for more achievements */}
                <div className="text-center py-8 text-slate-500">
                  <Star className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">More achievements coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
