import React, { useState } from "react";
import {
  User,
  Play,
  Dumbbell,
  Timer,
  Target,
  Mountain,
  Activity,
  Zap,
  Bike,
  Trophy,
} from "lucide-react";

interface Workout {
  id: string;
  name: string;
  duration: string;
  points: number;
  category: "outdoor" | "indoor";
  icon: string;
}

const workouts: Workout[] = [
  {
    id: "1",
    name: "Running or Jogging",
    duration: "30 min",
    points: 15,
    category: "outdoor",
    icon: "🏃‍♂️",
  },
  {
    id: "2",
    name: "Cycling",
    duration: "45 min",
    points: 15,
    category: "outdoor",
    icon: "🚴‍♂️",
  },
  {
    id: "3",
    name: "Hiking or Trail Running",
    duration: "60 min",
    points: 20,
    category: "outdoor",
    icon: "🥾",
  },
  {
    id: "4",
    name: "Outdoor Bootcamp",
    duration: "45 min",
    points: 25,
    category: "outdoor",
    icon: "🏋️‍♂️",
  },
  {
    id: "5",
    name: "Calisthenics",
    duration: "30 min",
    points: 20,
    category: "outdoor",
    icon: "🤸‍♂️",
  },
  {
    id: "6",
    name: "Rock Climbing",
    duration: "60 min",
    points: 30,
    category: "outdoor",
    icon: "🧗‍♂️",
  },
  {
    id: "7",
    name: "Rollerblading",
    duration: "30 min",
    points: 20,
    category: "outdoor",
    icon: "⛸️",
  },
  {
    id: "8",
    name: "10 Push-ups",
    duration: "5 min",
    points: 10,
    category: "indoor",
    icon: "💪",
  },
  {
    id: "9",
    name: "30 Jumping Jacks",
    duration: "5 min",
    points: 10,
    category: "indoor",
    icon: "🤾‍♂️",
  },
  {
    id: "10",
    name: "20 Squats",
    duration: "5 min",
    points: 10,
    category: "indoor",
    icon: "🏋️‍♂️",
  },
  {
    id: "11",
    name: "60s Plank Hold",
    duration: "1 min",
    points: 15,
    category: "indoor",
    icon: "🏋️‍♀️",
  },
];

type FilterCategory = "all" | "outdoor" | "indoor";

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [totalPoints] = useState(300);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(
    new Set()
  );

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeFilter === "all") return true;
    return workout.category === activeFilter;
  });

  const handleStartWorkout = (workoutId: string) => {
    setCompletedWorkouts((prev) => new Set([...prev, workoutId]));
  };

  const todayWorkouts = completedWorkouts.size;
  const todayPoints = Array.from(completedWorkouts).reduce(
    (total, workoutId) => {
      const workout = workouts.find((w) => w.id === workoutId);
      return total + (workout?.points || 0);
    },
    0
  );

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
              <span className="text-amber-400 text-lg">{totalPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24 px-4">
        <div className="py-6">
          <h2 className="text-2xl text-white mb-6">Workouts</h2>
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                All Workouts
              </button>
              <button
                onClick={() => setActiveFilter("outdoor")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "outdoor"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                Outdoor
              </button>
              <button
                onClick={() => setActiveFilter("indoor")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "indoor"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                Indoor
              </button>
            </div>

            {/* Workouts List */}
            <div className="space-y-3">
              {filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-200 border-slate-700/50 hover:border-slate-600/50"
                >
                  <div className="flex items-center gap-8">
                    <div className="text-3xl">{workout.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg">{workout.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-slate-400 text-sm">
                          {workout.duration}
                        </span>
                        <span className="text-amber-400 text-sm">
                          +{workout.points} pts
                        </span>
                      </div>
                    </div>
                    <div className="m-4">
                      <button
                        onClick={() => handleStartWorkout(workout.id)}
                        disabled={completedWorkouts.has(workout.id)}
                        className={`h-12 px-8 min-w-[100px] rounded-xl transition-all duration-200 font-semibold ${
                          completedWorkouts.has(workout.id)
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        {completedWorkouts.has(workout.id) ? "Done" : "Start"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card - Only show when workouts completed */}
            {todayWorkouts > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="text-center">
                  <div className="text-3xl text-amber-400 mb-2">
                    {todayPoints}
                  </div>
                  <div className="text-slate-300">Total Points Earned</div>
                  <div className="text-sm text-slate-400 mt-2">
                    {todayWorkouts} workouts completed today
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
