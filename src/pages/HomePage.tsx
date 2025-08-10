import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import FilterTabs from "@/components/FilterTabs";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import BackendErrorDisplay from "@/components/BackendErrorDisplay";
import { useBackendData } from "@/hooks/useBackendData";
import { useAuth } from "@/hooks/useAuth";

type FilterCategory = "all" | "outdoor" | "indoor";

const HomePage: React.FC = () => {
  const { signOut } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [toastState, setToastState] = useState<{show: boolean, message: string, points?: number}>({
    show: false, 
    message: '', 
    points: 0
  });
  
  const { 
    totalPoints, 
    availableWorkouts, 
    completeWorkout, 
    isWorkoutCompleted,
    loading,
    workoutsLoading,
    error,
    refreshWorkouts
  } = useBackendData();

  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [completionLoading, setCompletionLoading] = useState<boolean>(true);

  // Check which workouts are completed today
  useEffect(() => {
    const checkCompletedWorkouts = async () => {
      if (availableWorkouts.length > 0) {
        setCompletionLoading(true);
        const completed = new Set<string>();
        
        for (const workout of availableWorkouts) {
          const isCompleted = await isWorkoutCompleted(workout.id);
          if (isCompleted) {
            completed.add(workout.id);
          }
        }
        
        setCompletedToday(completed);
        setCompletionLoading(false);
      } else {
        setCompletionLoading(false);
      }
    };

    checkCompletedWorkouts();
  }, [availableWorkouts, isWorkoutCompleted]);

  const filteredWorkouts = availableWorkouts.filter((workout) => {
    if (activeFilter === "all") return true;
    return workout.category === activeFilter;
  });

  // Debug logging - only log if there are issues
  if (error || workoutsLoading) {
    console.log(`🏋️ HomePage: ${availableWorkouts.length} workouts, loading: ${workoutsLoading}, error: ${!!error}`);
  }

  const handleStartWorkout = async (workoutId: string) => {
    // Prevent double-clicks and already completed workouts
    if (completedToday.has(workoutId)) {
      return;
    }

    const workout = availableWorkouts.find(w => w.id === workoutId);
    if (workout) {
      // Optimistically update UI to prevent double-clicks
      setCompletedToday(prev => new Set([...prev, workoutId]));
      
      const success = await completeWorkout(workoutId);
      if (success) {
        setToastState({
          show: true,
          message: 'Workout completed!',
          points: workout.points
        });
        // The BackendDataContext already handles updating workoutHistory immediately
        // No need to revert optimistic update since it succeeded
      } else {
        // Revert optimistic update on failure
        setCompletedToday(prev => {
          const newSet = new Set(prev);
          newSet.delete(workoutId);
          return newSet;
        });
      }
    }
  };

  const completedWorkoutsToday = availableWorkouts.filter(w => completedToday.has(w.id));
  const todayWorkouts = completedWorkoutsToday.length;
  const todayPoints = completedWorkoutsToday.reduce((total, workout) => total + workout.points, 0);

  if (loading) {
    return (
      <PageLayout points={totalPoints} title="Workouts">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading workouts...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout points={totalPoints} title="Workouts">
        <BackendErrorDisplay 
          error={error} 
          onRetry={() => window.location.reload()}
          onSignOut={signOut}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout points={totalPoints} title="Workouts">
      {/* Header with reload button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <FilterTabs
            tabs={[
              { key: "all", label: "All Workouts" },
              { key: "outdoor", label: "Outdoor" },
              { key: "indoor", label: "Indoor" }
            ]}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        <button
          onClick={refreshWorkouts}
          disabled={workoutsLoading}
          className="ml-4 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 transition-colors disabled:opacity-50"
          title="Reload workouts"
        >
          <RefreshCw className={`w-4 h-4 text-slate-300 ${workoutsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Workouts List */}
      <div className="space-y-3">
        {workoutsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
            <p className="text-slate-400 text-sm">Loading workouts...</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No workouts available in this category</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
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
                    disabled={completedToday.has(workout.id) || completionLoading}
                    variant={completedToday.has(workout.id) ? "success" : "primary"}
                    size="md"
                    className="h-12 px-8 min-w-[100px]"
                  >
                    {completionLoading ? "..." : completedToday.has(workout.id) ? "Done" : "Start"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
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