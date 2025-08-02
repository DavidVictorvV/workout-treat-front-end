import { completeWorkout } from '@/services/pointsService';

// Function to add sample workout data for testing the charts
export const addSampleWorkoutData = () => {
  const sampleWorkouts = [
    // Last week data
    { id: '1', name: 'Running or Jogging', icon: '🏃‍♂️', category: 'outdoor' as const, points: 15, daysAgo: 7 },
    { id: '2', name: 'Cycling', icon: '🚴‍♂️', category: 'outdoor' as const, points: 15, daysAgo: 6 },
    { id: '8', name: '10 Push-ups', icon: '💪', category: 'indoor' as const, points: 10, daysAgo: 5 },
    { id: '1', name: 'Running or Jogging', icon: '🏃‍♂️', category: 'outdoor' as const, points: 15, daysAgo: 4 },
    { id: '9', name: '30 Jumping Jacks', icon: '🤾‍♂️', category: 'indoor' as const, points: 10, daysAgo: 3 },
    
    // This week data
    { id: '3', name: 'Hiking or Trail Running', icon: '🥾', category: 'outdoor' as const, points: 20, daysAgo: 2 },
    { id: '10', name: '20 Squats', icon: '🏋️‍♂️', category: 'indoor' as const, points: 10, daysAgo: 1 },
    { id: '2', name: 'Cycling', icon: '🚴‍♂️', category: 'outdoor' as const, points: 15, daysAgo: 1 },
    { id: '11', name: '60s Plank Hold', icon: '🏋️‍♀️', category: 'indoor' as const, points: 15, daysAgo: 0 },
  ];

  // Add workouts with specific dates
  sampleWorkouts.forEach(workout => {
    // Temporarily modify the completeWorkout function to accept a custom date
    const originalDate = Date.now;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - workout.daysAgo);
    
    // Mock the Date.now function to return our target date
    Date.now = () => targetDate.getTime();
    
    try {
      completeWorkout(
        `${workout.id}-${workout.daysAgo}`, 
        workout.name, 
        workout.icon, 
        workout.category, 
        workout.points
      );
    } catch (error) {
      console.error('Error adding sample workout:', error);
    } finally {
      // Restore original Date.now
      Date.now = originalDate;
    }
  });

  console.log('Sample workout data added for testing charts!');
};

// Function to clear all workout data
export const clearWorkoutData = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'fitpoints_workout_history=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'fitpoints_completed_workouts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Workout data cleared!');
  }
};