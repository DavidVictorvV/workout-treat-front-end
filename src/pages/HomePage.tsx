import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FilterTabs from "@/components/FilterTabs";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import { usePoints } from "@/hooks/usePoints";

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
  const [toastState, setToastState] = useState<{show: boolean, message: string, points?: number}>(
    {show: false, message: '', points: 0}
  );
  const { totalPoints, completeWorkout, isWorkoutCompleted } = usePoints();

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeFilter === "all") return true;
    return workout.category === activeFilter;
  });

  const handleStartWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout && completeWorkout(workoutId, workout.points)) {
      setToastState({
        show: true,
        message: 'Workout completed!',
        points: workout.points
      });
    }
  };

  const completedWorkoutsToday = workouts.filter(w => isWorkoutCompleted(w.id));
  const todayWorkouts = completedWorkoutsToday.length;
  const todayPoints = completedWorkoutsToday.reduce((total, workout) => total + workout.points, 0);

  return (
    <PageLayout points={totalPoints} title="Workouts">
            <FilterTabs
              tabs={[
                { key: "all", label: "All Workouts" },
                { key: "outdoor", label: "Outdoor" },
                { key: "indoor", label: "Indoor" }
              ]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Workouts List */}
            <div className="space-y-3">
              {filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-200 border-slate-700/50 hover:border-slate-600/50"
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
                    <div>
                      <Button
                        onClick={() => handleStartWorkout(workout.id)}
                        disabled={isWorkoutCompleted(workout.id)}
                        variant={isWorkoutCompleted(workout.id) ? "success" : "primary"}
                        size="md"
                        className="h-12 px-8 min-w-[100px]"
                      >
                        {isWorkoutCompleted(workout.id) ? "Done" : "Start"}
                      </Button>
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
      
      <Toast
        show={toastState.show}
        message={toastState.message}
        points={toastState.points}
        onClose={() => setToastState({show: false, message: '', points: 0})}
      />
    </PageLayout>
  );
};

export default HomePage;
