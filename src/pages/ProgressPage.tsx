import React from "react";
import { Star, Dumbbell, Trophy, Target } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import StatsCard from "@/components/StatsCard";
import { usePoints } from "@/hooks/usePoints";

const ProgressPage: React.FC = () => {
  const { totalPoints, completedWorkouts } = usePoints();
  
  const currentPoints = totalPoints;
  const workoutsToday = completedWorkouts.length;
  const totalEarned = totalPoints;
  const weeklyGoal = 7;
  const weeklyProgress = Math.min(workoutsToday, weeklyGoal);

  return (
    <PageLayout points={currentPoints} title="Statistics">
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
                value={workoutsToday}
                label="Workouts Today"
                iconColor="text-blue-400"
                valueColor="text-blue-400"
              />
              <StatsCard
                icon={Trophy}
                value={totalEarned}
                label="Total Earned"
                iconColor="text-green-400"
                valueColor="text-green-400"
              />
              <StatsCard
                icon={Target}
                value={`${weeklyProgress}/${weeklyGoal}`}
                label="Weekly Goal"
                iconColor="text-orange-400"
                valueColor="text-orange-400"
              />
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
    </PageLayout>
  );
};

export default ProgressPage;
