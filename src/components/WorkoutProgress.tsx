import React from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';

interface UserProgress {
  currentLevel: number;
  completionsAtCurrentLevel: number;
  totalCompletions: number;
}

interface WorkoutType {
  id: string;
  name: string;
  icon: string;
  category: string;
  basePoints: number;
}

interface WorkoutProgressProps {
  userProgress: Record<string, UserProgress>;
  workoutTypes?: WorkoutType[];
}

const WorkoutProgress: React.FC<WorkoutProgressProps> = ({ userProgress, workoutTypes = [] }) => {
  const calculateProgressPercentage = (completions: number, maxCompletions: number = 5) => {
    return Math.min((completions / maxCompletions) * 100, 100);
  };

  const getNextLevelPoints = (basePoints: number, nextLevel: number) => {
    const levelMultiplier = 0.3 + (nextLevel * 0.17);
    return Math.floor(basePoints * levelMultiplier);
  };

  const sortedProgress = Object.entries(userProgress)
    .sort(([, a], [, b]) => b.totalCompletions - a.totalCompletions)
    .slice(0, 8); // Show top 8 most used workout types

  if (sortedProgress.length === 0) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">Complete some workouts to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-amber-400" />
        <h3 className="text-xl font-semibold text-white">Workout Progress</h3>
      </div>

      <div className="space-y-4">
        {sortedProgress.map(([workoutTypeId, progress]) => {
          const workoutType = workoutTypes.find(w => w.id === workoutTypeId);
          const progressPercentage = calculateProgressPercentage(progress.completionsAtCurrentLevel);
          const completionsNeeded = Math.max(0, 5 - progress.completionsAtCurrentLevel);
          const nextLevel = Math.min(10, progress.currentLevel + 1);
          const isMaxLevel = progress.currentLevel >= 10;

          return (
            <div key={workoutTypeId} className="border border-slate-600/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {workoutType?.icon || '💪'}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {workoutType?.name || workoutTypeId}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-amber-400">Level {progress.currentLevel}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">
                        {progress.totalCompletions} total completions
                      </span>
                    </div>
                  </div>
                </div>
                
                {progress.currentLevel >= 10 ? (
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 rounded-full">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">MAX</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Next Level</div>
                    <div className="text-amber-400 font-medium">
                      +{workoutType ? getNextLevelPoints(workoutType.basePoints, nextLevel) : '?'} pts
                    </div>
                  </div>
                )}
              </div>

              {!isMaxLevel && (
                <>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">
                        Progress to Level {nextLevel}
                      </span>
                      <span className="text-slate-400">
                        {progress.completionsAtCurrentLevel}/5
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  {completionsNeeded > 0 && (
                    <div className="text-xs text-slate-400">
                      Complete {completionsNeeded} more time{completionsNeeded !== 1 ? 's' : ''} to level up
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutProgress;